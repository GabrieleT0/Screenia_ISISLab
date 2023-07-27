import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilState } from 'recoil';
import { fetchPostComment } from '../../api/opereApi';
import useLoader from '../../customHooks/loaderHooks/useLoader';
import { commentAtom } from '../../state/comment/commentAtom';
import confirmModalAtom from '../../state/modal/confirmModalAtom';
import QuillRichText from '../QuillRichText/QuillRichText';
import TagAutocomplete from '../Tag/TagAutocomplete';

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
    //const [editor, setEditor] = useState(() => EditorState.createEmpty());
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
        if((!fromRange || !fromRange.number) || (toRange && toRange.number)) return;

        setToRange({ number: fromRange.number, label: fromRange.label });
    }, [fromRange])

    useEffect(() => {
        if(!commentUpdate || !commentUpdate.idComment) return;

        handleSetRange(commentUpdate.from, "from")
        handleSetRange(commentUpdate.to, "to")
        setTextEditor({
            plainText: commentUpdate.flat_text,
            convertToRaw: JSON.parse(commentUpdate.text)
        });
        setTagSelected([...commentUpdate.tags])
    }, [commentUpdate]);

    const handleSelectTags = useCallback((items) => {
        setTagSelected(items);
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
            idParagraph: toRange.number,
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
            setCommentFilter({
                idOpera,
                idBook,
                idChapter,
                filters: null
            })
        } catch(e) {
            
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
        setTagSelected([]);
        setFromRange(null);
        setToRange(null);
        setTypeUpdate(null);

        if(commentUpdate && commentUpdate.idComment) {
            handleResetUpdateComment();
        }
    }

    const handleSetRange = (value, range) => {
        if(range === "from") {
            setFromRange({ ...value });
        } else if(range === "to") {
            setToRange({ ...value });
        }
    }

    const validateComment = () => {
        if(!textEditor.plainText.trim()) {
            toast.warning("It is not possible to post a blank comment!");
            return false;
        } else if(textEditor.plainText.trim().length < 5) {
            toast.warning("Per inviare un commento bisogna inserire almeno cinque caratteri!");
            return false;
        }

        if(parseInt(fromRange.number) > parseInt(toRange.number)) {
            toast.warning("You must enter at least five characters to post a comment!");
            return false;
        }

        if(commentUpdate && commentUpdate.idComment) {
            if(!typeUpdate) {
                toast.warning("You have to select the impact of the change!");
                return false;
            }
        }

        return true;
    }

    const getParagraphsMenuSelect = () => {
        return paragraphs.map(({ number, label }) => (
            <MenuItem value={{ number, label }}>{label}</MenuItem>
        ))
    }

    const getDescription = () => {

        if(!commentUpdate || !commentUpdate.idComment) {
            if(!fromRange || !fromRange.number || !toRange || !toRange.number) {
                return "Select the paragraphs to be commented on. If you want to comment on only one paragraph, <i><strong>From</strong></i> and <i><strong>To</strong></i> must be the same.";
            }

            if(fromRange && toRange && fromRange.number && toRange.number) {
                if(parseInt(fromRange.number) === parseInt(toRange.number)) {
                    return `You are commenting on paragraph with label: ${fromRange && fromRange.label ? `<i><strong>${fromRange.label}</strong></i>` : ""}`;
                } 
    
                return `You are commenting from paragraph with label <i><strong>${fromRange.label}</strong></i> to paragraph with label <i><strong>${toRange.label}</strong></i>`;
            }
        } else if(commentUpdate && commentUpdate.idComment) {
            if(fromRange && toRange && fromRange.number && toRange.number) {
                if(parseInt(fromRange.number) === parseInt(toRange.number)) {
                    return `You are editing a paragraph comment number: <i><strong>${fromRange.label}`;
                } 
    
                return `You are editing a comment from paragraph <i><strong>${fromRange.label}</strong></i> to paragraph <i><strong>${toRange.label}</strong></i>`;
            }
        }

        return "";
    }

    const handleChangeContentEditor = (contentToRaw, text) => {
        setTextEditor({
            plainText: text,
            convertToRaw: contentToRaw
        })
    }

    return (
        <Paper sx={{ padding: 2 }}>
            <Grid
                container
                direction="row"
                spacing={2} >
                <Grid item xs={12}>
                    <Typography style={{ float: "left" }} >
                        <div dangerouslySetInnerHTML={{ __html: getDescription() }} />
                    </Typography>
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
                            renderValue={(value) => value.label}
                            label="From"
                            disabled={(commentUpdate && commentUpdate.idComment)}
                            MenuProps={{ 
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                                getContentAnchorEl: null,
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // imposta l'altezza massima del menu
                                    },
                                },
                            }}
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
                            renderValue={(value) => value.label}
                            label="To"
                            MenuProps={{ 
                                anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                },
                                transformOrigin: {
                                    vertical: 'top',
                                    horizontal: 'left',
                                },
                                getContentAnchorEl: null,
                                PaperProps: {
                                    style: {
                                        maxHeight: 200, // imposta l'altezza massima del menu
                                    },
                                },
                            }}
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
                    {/*<DraftEditor
                        editorKey="comment_paragraph_editor"
                        editor={editor}
                        readOnly={false}
                        idOpera={opera.idOpera} 
                        callbackChangeEditor={handleChangeEditor} 
                        styleOptions={{ width: '100%', maxHeight: '200px', overflowY: 'scroll' }} />*/}
                        <QuillRichText 
                            idOpera={idOpera}
                            content={textEditor.convertToRaw} 
                            handleChangeContent={handleChangeContentEditor} />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        variant="contained" 
                        color="primary"
                        disabled={!fromRange || !toRange || !fromRange.number || !toRange.number}
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