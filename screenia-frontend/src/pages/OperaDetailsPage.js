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
    Button
} from "@mui/material";
import { useEffect, useState, useCallback, useRef, createRef } from "react";
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
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

const SelectBook = ({ books = [], value, handleSelect }) => {
    return (
        <FormControl fullWidth>
            <InputLabel id="select-book-opera" shrink={true}>Select Book</InputLabel>
            <Select
                labelId="select-book-opera"
                id="select-book-opera"
                label="Age"
                onChange={handleSelect}
                value={value}
                sx={{
                    background: "#fff"
                }}
            >
                {books.map(({ number, title }) => {
                    const label = number && title ? `Book #${number} - ${title}` : `Book #${number}`
                    return (<MenuItem value={number}>{label}</MenuItem>)
                })}
            </Select>
        </FormControl>
    )
}

const OperaDetailsPage = () => {
    const { id } = useParams();
    const { paramIdBook } = useParams();
    const { paramIdChapter } = useParams();
    const { paramIdParagraph } = useParams();
    const [opera, setOpera] = useState({});
    const [books, setBooks] = useState([]);
    const [bookId, setBookId] = useState(null);
    const [chaptersOfBook, setChaptersOfBook] = useState([]);
    const [chapterId, setChapterId] = useState();
    const [paragraphs, setParagraphs] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [editions, setEditions] = useState([]);
    const [authorSelected, setAuthorSelected] = useState(null);
    const [editionSelected, setEditionSelected] = useState(null);
    const [comments, setComments] = useState(null);
    const [openDialogComment, setOpenDialogComment] = useState(false);
    const [isSyncTextComment, setIsSyncTextComment] = useState(true);
    const [paragraphId, setParapraghId] = useState(null);
    const commentRef = useRef();
    const containerCommentRef = useRef();
    const [refsComments, setRefsComments] = useState();
    const itemsMenu = [
        { 
            title: `Download text Chapter #${chapterId}`, 
            action: () => downloadParagraphTxtFile(chapterId, paragraphs)
        },
        {
            title: `Comment Book #${bookId} - Chapter #${chapterId}`,
            action: () => handleDialogComment(true)
        }
    ];
    
    useEffect(() => {
        fetchAllData()
    }, [id, paramIdBook, paramIdChapter, paramIdParagraph]);

    /*useEffect(() => {
        if(!paramIdParagraph || !paragraphs || paragraphs.length === 0) return;

        const elementParagraph = document.getElementById(
            `paragraph-${id}-${paramIdBook}-${paramIdChapter}-${paramIdParagraph}`);
            
        if(!elementParagraph) return;
        console.log('elementParagraph', elementParagraph)
        scrollIntoView(elementParagraph, {
            block: 'nearest',
            inline: 'start',
            behavior: 'smooth',
        })
        //elementParagraph.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [paramIdParagraph, paragraphs])*/

    useEffect(() => {
        selectBook()
    }, [bookId])

    useEffect(() => {
        fetchParagraphByChapter()
        fetchCommentByChapter()
    }, [chapterId])

    useEffect(() => {
        if(!id || !bookId || !chapterId) return;

        if(isSyncTextComment) {
            document.getElementById("container_paragraph").scrollTop = 0;
            document.getElementById("container_comment").scrollTop = 0;

            const paragraphElementOne = document.getElementById(
                `paragraph-${id}-${bookId}-${chapterId}-1`);

            paragraphElementOne.style.backgroundColor = "#00bcd442";
        } else if(
            !isSyncTextComment 
            && Array.isArray(paragraphs) 
            && paragraphs.length > 0) {
            for(const paragraph of paragraphs) {
                const { id_opera, number_book, number_chapter, number } = paragraph;

                const pragraphElement = document.getElementById(
                    `paragraph-${id_opera}-${number_book}-${number_chapter}-${number}`);

                pragraphElement.style.backgroundColor = null;
            }
        } else {
            
        }
    }, [isSyncTextComment])

    useEffect(() => {
        if(Array.isArray(comments) && comments.length > 0) {
            setRefsComments(comments.reduce((acc, value) => {
                acc[value.number_paragraph] = createRef();
                return acc;
            }, {}));
        }
    }, [comments])

    const fetchAllData = async () => {
        if(id === null) return;

        try {
            const responseOpera = await fetchOpera(id);
            const responseBook = await fetchBooksByOpera(id);
            const responseAuthors = await fetchAllAuthorByOpera(id);
            const responseEditions = await fetchAllEditionByOpera(id);

            if(!responseOpera.error 
                && !responseBook.error 
                && !responseAuthors.error
                && !responseEditions.error) {
                setOpera(responseOpera.data);
                setBooks(responseBook.data);
                setAuthors(responseAuthors.data);
                setEditions(responseEditions.data);
                if(responseBook.data.length > 0) {
                    setBookId(paramIdBook ? parseInt(paramIdBook) : 1);
                }
            }
        } catch(e) {
            toast.error("Impossibile recuperare i dati. Contattare l'amministrazione!");
        }
    }

    const selectBook = () => {
        if(bookId === null) return;

        const bookFind = books.find(({ number }) => parseInt(number) === parseInt(bookId));
        if(bookFind.chapters.length > 0) {
            setChaptersOfBook(bookFind.chapters)
            setChapterId(paramIdChapter ? parseInt(paramIdChapter) : 1);
            fetchParagraphByChapter()
            fetchCommentByChapter()
        }
    }

    const handleSelectBook = useCallback((e) => {
        setBookId(e.target.value);
        setParapraghId(null);
    })

    const handleSelectChapter = useCallback((e, value) => {
        setChapterId(value);
        setParapraghId(null);
    })

    const fetchParagraphByChapter = async () => {
        if(!id || !bookId || !chapterId) return;

        try {
            const response = await fetchParagraph(id, bookId, chapterId);
            setParagraphs(response.data || []);

            if(!response?.data || response.data.length === 0) {
                toast.info(`Non ci sono paragrafi per il capitolo #${chapterId} #${bookId}!`);
            }
        } catch(e) {
            toast.error("Impossibile recuperare i paragrafi. Contattare l'amministrazione!");
        }
    }

    const fetchCommentByChapter = async () => {
        if(!bookId || !chapterId) return;

        const response = await fetchAllComment(id, bookId, chapterId);
        setComments(response.data.comments || []);
        if(!response.data || (Array.isArray(response.data) && response.data.length === 0)) {
            setIsSyncTextComment(false);
        } else if(
            response.data 
            && Array.isArray(response.data) 
            && response.data.length > 0
            && isSyncTextComment) {
                setIsSyncTextComment(true);
        }
    }

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

    const handleDialogComment = () => {
        setOpenDialogComment(lastValue => !lastValue);
    }

    const handlePostCommentSubmit = () => {
        handleDialogComment();
        fetchCommentByChapter();
    }

    const handleCommentParagraph = (id) => {
        setParapraghId(id);
    }

    return (
        <Grid
            container
            direction="row"
            spacing={2} >
                                        <Button onClick={() => {
        scroller.scrollTo('#comment-paragraph_3', {
          duration: 1500,
          delay: 100,
          smooth: true,
          containerId: 'container_comment',
          offset: 50
        })
      }}>Clicca qui library</Button>
            {openDialogComment && (
                <SimpleDialog
                    open={openDialogComment}
                    title="Insert a comment"
                    handleClose={handleDialogComment} >
                    <CommentForm
                        idOpera={id}
                        idBook={bookId}
                        idChapter={chapterId}
                        paragraphs={paragraphs ? paragraphs.map((items) => items.number) : []}
                        handlePostSubmit={handlePostCommentSubmit}
                    />
                </SimpleDialog>
            )}
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
            <Grid item xs={2} />
            {id && bookId && chapterId && 
                (<Grid item xs={4}>
                    <BasicMenu title="Actions" items={itemsMenu} sx={{ float: "right" }} />
                </Grid>)
            }
            <Grid item xs={12}>
                <FormGroup sx={{ float: "right" }}>
                    <FormControlLabel
                        control={
                            <Switch 
                                disabled={!comments || comments.length === 0}
                                color="secondary"
                                checked={isSyncTextComment} 
                                onChange={e => setIsSyncTextComment(e.target.checked)} />}
                        label="Synchronized scroll"
                    />
                </FormGroup>
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper style={{ height: 550, marginTop: 15 }}>
                    <ChapterTabs
                        chapters={chaptersOfBook}
                        paragraphs={paragraphs}
                        value={chapterId} 
                        handleSelect={handleSelectChapter}
                        handleCommentParagraph={handleCommentParagraph} 
                        isSyncTextComment={isSyncTextComment} />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <CommentContainer 
                    comments={comments} 
                    paragraphs={paragraphs} 
                    refsComments={refsComments} />
            </Grid>
            {/*<Grid item xs={12} md={6}>
                <CardAuthor authors={authors} handleSelect={(author) => setAuthorSelected(author)} />
            </Grid>
            <Grid item xs={12} md={6}>
                <CardEdition editions={editions} handleSelect={(edition) => setEditionSelected(edition)}/>
            </Grid>*/}
            <Grid item xs={12}>
                <CommentParagraph 
                    opera={{
                        idOpera: id,
                        idBook: bookId,
                        idChapter: chapterId,
                        idParagraph: paragraphId
                    }}/>
            </Grid>
        </Grid>
    )
}

export default OperaDetailsPage;

