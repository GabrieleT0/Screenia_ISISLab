import { 
    Grid, 
    Button, 
    Paper, 
    Typography, 
    Autocomplete, 
    TextField, 
    Tooltip,
    FormControl,
    MenuItem,
    InputLabel,
    Select
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { fetchPostComment, fetchTags } from '../../api/opereApi';
import DraftEditor from '../RichText/DraftEditor';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import useLoader from '../../customHooks/loaderHooks/useLoader';
import { EditorState } from 'draft-js';
import useCommentsChapter from '../../customHooks/operaHooks/useCommentsChapter';
import { useRecoilState } from 'recoil';
import confirmModalAtom from '../../state/modal/confirmModalAtom';
import TagAutocomplete from '../Tag/TagAutocomplete';
import { convertFromRaw } from 'draft-js';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { commentAtom } from '../../state/comment/commentAtom';

const CommentParagraph = ({ 
    opera = null,
    paragraphs = [],
    commentUpdate = null,
    handleResetUpdateComment
}) => {
    const idOpera = opera.idOpera;
    const idBook = opera.idBook;
    const idChapter = opera.idChapter;
    const idParagraph = opera.idParagraph;
    const [tagSelected, setTagSelected] = useState([]);
    const { setLoader } = useLoader();
    const [textEditor, setTextEditor] = useState({
        plainText: "",
        convertToRaw: {}
    });
    const [editor, setEditor] = useState(() => EditorState.createEmpty());
    const [fromRange, setFromRange] = useState(0);
    const [toRange, setToRange] = useState(0);
    const [typeUpdate, setTypeUpdate] = useState(null);

    //Set comment filter for reload comments
    const [commentFilter, setCommentFilter] = useRecoilState(commentAtom);

    //Confirm Modal State
    const [modal, setModal] = useRecoilState(confirmModalAtom);

    useEffect(() => {
        resetInputsComment();
    }, [idOpera, idBook, idChapter]);

    useEffect(() => {
        if(toRange) return;

        setToRange(fromRange);
    }, [fromRange])

    useEffect(() => {
        if(!commentUpdate || !commentUpdate.idComment) return;

        const commentFrom = commentUpdate.from ? commentUpdate.from : commentUpdate.idParagraph;
        const commentTo = commentUpdate.to ? commentUpdate.to : commentUpdate.idParagraph;
        handleSetRange(commentFrom, "from")
        handleSetRange(commentTo, "to")
        setEditor(() => EditorState.createWithContent(
            convertFromRaw(JSON.parse(commentUpdate.text))
        ));
        setTagSelected([...commentUpdate.tags])
    }, [commentUpdate]);

    const handleSelectTags = useCallback((items) => {
        setTagSelected(items);
    })

    const handleChangeEditor = useCallback((plainText, convertToRaw) => {
        setTextEditor({
            plainText,
            convertToRaw
        })
    })

    const handleConfirmSubmitComment = () => {
        if(!validateComment()) return;

        setModal({
            isOpen: true,
            title: "Are you sure you want to submit the comment?",
            description: "The operation is irreversible!",
            handleConfirm: handleSave
        })
    }

    const handleSave = useCallback(() => {
        let idParent = null;

        if(commentUpdate && commentUpdate.idComment) {
            if(commentUpdate.idParent) {
                idParent = commentUpdate.idParent;
            } else {
                idParent = commentUpdate.idComment
            }
        }

        const comment = {
            text: JSON.stringify(textEditor.convertToRaw),
            idOpera: opera.idOpera,
            idBook: opera.idBook,
            idChapter: opera.idChapter,
            idParagraph: toRange,
            tags: tagSelected.map(({ title }) => title),
            from: fromRange,
            to: toRange,
            flatText: textEditor.plainText,
            idParent: idParent,
            impact: typeUpdate
        }

        sendComment(comment);
    })

    const sendComment = async (comment) => {
        try {
            setLoader();
            await fetchPostComment(comment);
            toast.success("Commento inserito!")
            resetInputsComment();
            /*setCommentFilter({
                idOpera,
                idBook,
                idChapter,
                filters: null
            })*/
        } catch(e) {
            console.log('Error', e);
            toast.error("Impossibile inviare i dati. Contattare l'amministrazione!")
        } finally {
            setLoader();
        }
    }

    const resetInputsComment = () => {
        setTextEditor({
            plainText: "",
            convertToRaw: {}
        });
        setEditor(() => EditorState.createEmpty());
        setTagSelected([]);
        setFromRange(0);
        setToRange(0);
        setTypeUpdate(null);

        if(commentUpdate && commentUpdate.idComment) {
            handleResetUpdateComment();
        }
    }

    const handleSetRange = (value, range) => {
        console.log('valueRANGE', value)
        if(range === "from") {
            setFromRange(parseInt(value));
        } else if(range === "to") {
            setToRange(parseInt(value));
        }
    }

    const validateComment = () => {
        if(!textEditor.plainText.trim()) {
            toast.warning("Non è possibile inviare un commento vuoto!");
            return false;
        } else if(textEditor.plainText.trim().length < 5) {
            toast.warning("Per inviare un commento bisogna inserire almeno cinque caratteri!");
            return false;
        }

        if(parseInt(fromRange) > parseInt(toRange)) {
            toast.warning("Il range per commentare paragrafi multipli non è valido!");
            return false;
        }

        if(commentUpdate && commentUpdate.idComment) {
            if(!typeUpdate) {
                toast.warning("Devi selezionare l'impatto della modifica!");
                return false;
            }
        }

        return true;
    }

    const getParagraphsMenuSelect = () => {
        return paragraphs.map(({ number }) => (
            <MenuItem value={number}>{number}</MenuItem>
        ))
    }

    const getDescription = () => {
        if(!commentUpdate || !commentUpdate.idComment) {
            if(fromRange === toRange) {
                return `You are commenting on paragraph number: ${fromRange ? `${fromRange}` : ""}`;
            } 

            return `You are commenting from paragraph ${fromRange} to paragraph ${toRange}`;
        } else if(commentUpdate.idComment) {
            if(fromRange === toRange) {
                return `You are editing a paragraph comment number: ${fromRange}`;
            } 

            return `You are editing a comment from paragraph ${fromRange} to paragraph ${toRange}`;
        }
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <Grid
                container
                direction="row"
                spacing={2} >
                <Grid item xs={12}>
                    <Typography style={{ float: "left" }} >{getDescription()}</Typography>
                    <Button 
                        variant="outlined" 
                        startIcon={<RestartAltIcon />} 
                        disabled={(!fromRange && !toRange)}
                        style={{ float: "right" }}
                        onClick={resetInputsComment} >
                        Reset all
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel id="from">From</InputLabel>
                        <Select
                            labelId="From"
                            id="from"
                            value={fromRange}
                            label="From"
                            disabled={(commentUpdate && commentUpdate.idComment)}
                            onChange={(event) => handleSetRange(event.target.value, "from")} >
                                {getParagraphsMenuSelect()}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel id="to">To</InputLabel>
                        <Select
                            labelId="to"
                            id="from"
                            value={toRange}
                            label="To"
                            onChange={(event) => handleSetRange(event.target.value, "to")} >
                                {getParagraphsMenuSelect()}
                        </Select>
                    </FormControl>
                </Grid>
                {(commentUpdate && commentUpdate.idComment) && 
                (<Grid item xs={4}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Impact Edit</InputLabel>
                        <Select
                            id="update_major_or_minor"
                            value={typeUpdate}
                            label="Age"
                            onChange={(event) => setTypeUpdate(event.target.value)}
                        >
                            <MenuItem value={"minor"}>Minor</MenuItem>
                            <MenuItem value={"major"}>Major</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>)}
                <Grid item xs={12}>
                    <TagAutocomplete value={tagSelected} handleSelect={handleSelectTags} readOnly={false}/>
                </Grid>
                <Grid item xs={12}>
                    <DraftEditor
                        editor={editor}
                        readOnly={false}
                        idOpera={opera.idOpera} 
                        callbackChangeEditor={handleChangeEditor} 
                        styleOptions={{ width: '100%', maxHeight: '200px', overflowY: 'scroll' }} />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        disabled={!toRange}
                        onClick={handleConfirmSubmitComment}
                        style={{ float: "right" }}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

CommentParagraph.propTypes = {
    opera: PropTypes.shape({
        idOpera: PropTypes.number,
        idBook: PropTypes.number,
        idChapter: PropTypes.number,
        idParagraph: PropTypes.number,
        paragraphs: PropTypes.array
    }).isRequired,
    tags: PropTypes.array,
    handleResetComments: PropTypes.func
};

export default CommentParagraph;