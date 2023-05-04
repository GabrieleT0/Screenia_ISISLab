import { 
    Paper,
    MenuItem, 
    Grid,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel, 
    FormGroup,
    Switch,
    Button,
    TextField,
    IconButton,
    Box,
    Fade
} from "@mui/material";
import { useEffect, useState, useCallback, useRef, createRef, Suspense } from "react";
import { useParams } from "react-router-dom";
import { fetchAllAuthorByOpera, fetchAllComment, fetchAllEditionByOpera, fetchBooksByOpera, fetchOpera, fetchParagraph } from "../api/opereApi";
import ChapterTabs from "../components/Opera/ChapterTabs";
import { toast } from 'react-toastify';
import FullScreenDialog from "../components/Dialog/FullScreenDialog";
import CardAuthor from "../components/Opera/CardAuthor";
import CardEdition from "../components/Opera/CardEdition";
import AuthorDetails from "../components/Author/AuthorDetails";
import EditionDetails from "../components/Edition/EditionDetails";
import CommentContainer from "../components/Comment/CommentContainer";
import BasicMenu from "../components/BasicMenu/BasicMenu";
import SimpleDialog from "../components/Dialog/SimpleDialog";
import CommentParagraph from "../components/Comment/CommentParagraph";
import scrollIntoView from "scroll-into-view-if-needed";
import { 
    selectorAuthorsOfOpera, 
    selectorBooksOfOpera, 
    selectorChaptersOfBook, 
    selectorEditionsOfOpera, 
    selectorParagraphsOfChapter 
} from "../state/opera/opereSelector";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { operaDetailsAtom, syncTextCommentOpera } from "../state/opera/opereAtom";
import useCommentsChapter from '../customHooks/operaHooks/useCommentsChapter';
import TagAutocomplete from "../components/Tag/TagAutocomplete";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import authTokenAtom from "../state/authToken/authTokenAtom";
import { userAtom } from "../state/user/userAtom";
import { getCommentsSelector } from "../state/comment/commentSelector";
import { commentAtom } from "../state/comment/commentAtom";
import useOperaDetails from "../customHooks/operaHooks/useOperaDetails";
import { getParagraphsSelector } from "../state/paragraph/paragraphSelector";
import { paragraphAtom } from "../state/paragraph/paragraphAtom";
import useComponentByUserRole from "../customHooks/authHooks/useComponentByRole";
import { startTransition } from "react";
import useLoader from "../customHooks/loaderHooks/useLoader";
import QuillRichText from "../components/QuillRichText/QuillRichText";
import { animateScroll } from 'react-scroll';

const SelectBook = ({ books = [], value = 1, handleSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectChange = (event) => {
        setIsOpen(false);
        handleSelect(event.target.value);
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="select-book-opera" shrink={true}>Select Book</InputLabel>
            <Select
                open={isOpen}
                key={value}
                labelId="select-book-opera"
                id="select-book-opera"
                label="Book"
                onClose={() => setIsOpen(false)}
                onOpen={() => setIsOpen(true)}
                onChange={handleSelectChange}
                value={value}
                sx={{
                    background: "#fff"
                }}
            >
                {books.map(({ number, title }) => {
                    console.log('title ci sta', title)
                    const label = title ? `Book #${number} - ${title}` : `Book #${number}`
                    return (<MenuItem value={number}>{label}</MenuItem>)
                })}
            </Select>
        </FormControl>
    )
}

const FilteredComment = ({ handleSave }) => {
    const [tagSelected, setTagSelected] = useState([]);
    const [username, setUsername] = useState("");

    const handleSelectTags = useCallback((items) => {
        setTagSelected(items);
    });

    const handleChangeUsername = useCallback((event) => {
        setUsername(event.target.value)
    });

    const onSearch = () => {
        const tagsTitlte = tagSelected.map(( { title }) => title)
        handleSave(username, tagsTitlte);
        setTagSelected([]);
        setUsername("");
    }

    return (
        <Paper elevation={2} style={{ padding: 7 }}>
            <Grid
                container
                direction="row"
                spacing={2} >
                <Grid item xs={12} md={4}>
                    <TagAutocomplete 
                        value={tagSelected} 
                        handleSelect={handleSelectTags} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField 
                        id="filter_comment_user" 
                        label="Commentator" 
                        variant="outlined" 
                        value={username} 
                        onChange={handleChangeUsername} />
                </Grid>
                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-start', }}>
                    <Button
                        size="small"
                        onClick={onSearch}
                        variant="outlined" >
                        Search
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    )
}

const OperaDetailsPage = () => {
    //Params url
    const { id } = useParams();
    const { paramIdBook } = useParams();
    const { paramIdChapter } = useParams();
    const { paramIdParagraph } = useParams();

    //Local state
    const [bookId, setBookId] = useState(null);
    const [chapterId, setChapterId] = useState(null);
    const [authorSelected, setAuthorSelected] = useState(null);
    const [editionSelected, setEditionSelected] = useState(null);
    const [paragraphId, setParapraghId] = useState(null);
    const [isSyncTextComment, setIsSyncTextComment] = useRecoilState(syncTextCommentOpera);
    const [commentUpdate, setCommentUpdate] = useState(null);
    const [showFiltersComment, setShowFiltersComment] = useState(false);

    const itemsMenu = [
        { 
            title: `Download text Chapter #${chapterId}`, 
            action: () => downloadParagraphTxtFile(chapterId, paragraphs)
        },
        { 
            title: !showFiltersComment ? `View filters comments` : `Hide filters comments`, 
            action: () => setShowFiltersComment((prev) => !prev)
        }
    ];

    //Global State and Call API
    const [authToken, setAuthToken] = useRecoilState(authTokenAtom);
    const [user, setUser] = useRecoilState(userAtom);
    const { books, authors, editions } = useOperaDetails();
    const chaptersOfBook = useRecoilValue(selectorChaptersOfBook(bookId));
    const { setLoader } = useLoader();

    const comments = useRecoilValue(getCommentsSelector);
    const [commentFilter, setCommentFilter] = useRecoilState(commentAtom);
    const paragraphs = useRecoilValue(getParagraphsSelector);
    const [paragraphFilter, setParagraphFilter] = useRecoilState(paragraphAtom);

    const isUserAccessAddComment = useComponentByUserRole(
        authToken, 
        ["admin", "editor"], 
        user?.role || null);


    const fetchOperaDetails = useRecoilCallback(({ set }) => async (id) => {
        try {
            setLoader();
            const responseOpera = await fetchOpera(id);
            const responseBooks = await fetchBooksByOpera(id);
            //const responseAuthors = await fetchAllAuthorByOpera(id);
            //const responseEditions = await fetchAllEditionByOpera(id);

            const operaDetailsResponse = { 
                ...responseOpera.data,
                books: [...responseBooks.data],
                //editions: [...responseAuthors.data],
                //authors: [...responseEditions.data]
            }
    
            set(operaDetailsAtom, operaDetailsResponse);

            return operaDetailsResponse;
        } catch(e) {
            return toast.error("Unable to upload the work. Please contact the administration!");
        } finally {
            setLoader();
        }
    });
    
    useEffect(() => {
        initialLoad();
    }, [id, paramIdBook, paramIdChapter, paramIdParagraph]);

    useEffect(() => {
        console.log('paragraphs', paragraphs)
    }, [paragraphs]);

    useEffect(() => {
        setParapraghId(0);
        setParagraphFilter({
            idOpera: id,
            idBook: bookId,
            idChapter: chapterId,
        })
        setCommentFilter({
            idOpera: id,
            idBook: bookId,
            idChapter: chapterId,
            filter: null 
        })
    }, [chapterId, bookId])

    const initialLoad = async () => {
        const operaDetails = await fetchOperaDetails(id);
        const booksOperaDetails = operaDetails.books;
        let findBookWithParam = null;
        if(Array.isArray(booksOperaDetails) && booksOperaDetails && booksOperaDetails[0]) {

            if(paramIdBook) {
                findBookWithParam = booksOperaDetails.find((book) => parseInt(book.number) === parseInt(paramIdBook))
            }
            setBookId(findBookWithParam ? paramIdBook : booksOperaDetails[0].number);

            if(Array.isArray(booksOperaDetails[0].chapters) && booksOperaDetails[0]?.chapters[0]?.number) {
                let findChapterWithParam = null;

                if(paramIdChapter && findBookWithParam) {
                    findChapterWithParam = findBookWithParam.chapters.find((chapter) => parseInt(chapter.number) === parseInt(paramIdChapter))
                }
                setChapterId(findChapterWithParam ? paramIdChapter : booksOperaDetails[0]?.chapters[0]?.number);
            }
        }
    }

    const handleSelectBook = useCallback((value) => {
        setBookId(value);
        setChapterId(1);
    })

    const handleSelectChapter = useCallback((e, value) => {
        setChapterId(value);
    })

    const downloadParagraphTxtFile = (chapterId, paragraphs = []) => {
        if(!chapterId || !paragraphs || paragraphs.length === 0) {
            return;
        }

        const element = document.createElement("a");
        const textParagraph = paragraphs.map(({ text }) => (text));
        const file = new Blob([textParagraph.join(`\n\n`)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${chapterId}.txt`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const handleCommentParagraph = (id) => {
        setParapraghId(id);
    }

    const serachCommentByFilter = (username = "", tags = []) => {
        setCommentFilter({
            idOpera: id,
            idBook: bookId,
            idChapter: chapterId,
            filters: {
                user: username,
                tags: [...tags]
            } 
        })
    }

    const handleUpdateComment = (commentOnPassed) => {
        if(!commentOnPassed) return;

        console.log('commentOnPassed', commentOnPassed)

        setCommentUpdate({ ...commentOnPassed });
    }

    const handleSyncComment = (event) => {
        const checked = event.target.checked;
        setIsSyncTextComment(event.target.checked);
        if(checked) {
            animateScroll.scrollToTop({containerId: "container_paragraph"});
        }
    }

    return (
        <Grid
            container
            direction="row"
            spacing={2} >
            {authorSelected && (
                <FullScreenDialog 
                    title={`Author Details`}
                    open={authorSelected}
                    setOpen={() => setAuthorSelected(null)} >
                    <AuthorDetails author={authorSelected} />
                </FullScreenDialog>
            )}
            {editionSelected && (
                <FullScreenDialog 
                    title={`Edition Details`}
                    open={editionSelected}
                    setOpen={() => setEditionSelected(null)} >
                    <EditionDetails edition={editionSelected} />
                </FullScreenDialog>
            )}
            <Grid item xs={6}>
                <SelectBook 
                    books={books} 
                    value={bookId} 
                    handleSelect={handleSelectBook} />
            </Grid>
            <Grid item xs={2}/>
            <Grid item xs={4}>
                <BasicMenu 
                    disabled={(!id && !bookId && !chapterId)} 
                    title="Actions" 
                    items={itemsMenu} 
                    sx={{ float: "right" }} />
            </Grid>
            <Grid item xs={12}>
                <FormGroup sx={{ float: "right" }}>
                    <FormControlLabel
                        label="Synchronized scroll"
                        control={
                            <Switch 
                                disabled={!comments || comments.length === 0}
                                color="secondary"
                                checked={isSyncTextComment} 
                                onChange={handleSyncComment} />}
                    />
                </FormGroup>
            </Grid>
            <Fade in={showFiltersComment} appear={false} unmountOnExit={true}>
                <Grid item xs={12}>
                    <FilteredComment handleSave={serachCommentByFilter} />
                </Grid>
            </Fade>
            <Grid item xs={12} md={8}>
                <Paper style={{ height: 550, marginTop: 15 }}>
                    <ChapterTabs
                        chapters={chaptersOfBook}
                        paragraphs={paragraphs}
                        value={chapterId} 
                        handleSelect={handleSelectChapter}
                        handleCommentParagraph={handleCommentParagraph} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <CommentContainer 
                    comments={comments} 
                    paragraphs={paragraphs} 
                    handleUpdateComment={handleUpdateComment} />
            </Grid>
            {/*<Grid item xs={12} md={6}>
                <CardAuthor authors={authors} handleSelect={(author) => setAuthorSelected(author)} />
            </Grid>
            <Grid item xs={12} md={6}>
                <CardEdition editions={editions} handleSelect={(edition) => setEditionSelected(edition)}/>
            </Grid>*/}
            {isUserAccessAddComment &&
                (<Grid item xs={12}>
                    <CommentParagraph 
                        opera={{
                            idOpera: id,
                            idBook: bookId,
                            idChapter: chapterId,
                            idParagraph: paragraphId
                        }}
                        paragraphs={paragraphs} 
                        commentUpdate={commentUpdate} 
                        handleResetUpdateComment={() => setCommentUpdate(null)} />
                </Grid>)}
        </Grid>
    )
}

export default OperaDetailsPage;