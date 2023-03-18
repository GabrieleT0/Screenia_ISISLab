import { 
    Paper,
    Grid,
    List,
    ListItem,
    Avatar,
    ListSubheader,
    Chip,
    Typography
} from "@mui/material";
import moment from "moment";
import { Element, animateScroll as scroll, scroller } from 'react-scroll';
import CommentParagraph from "./CommentParagraph";
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import DraftEditor from '../RichText/DraftEditor';
import Comment from "./Comment";
 /*height: '70vh'*/
const CommentContainer = ({ comments = [], paragraphs = [], handleUpdateComment }) => {
    return (
        <Paper id="container_comment" style={{ height: 550, marginTop: 15, overflowY: 'scroll', maxWidth: 500 }}>
        {comments && comments.length > 0 && 
            (<List 
                sx={{ height: '10000px', '& ul': { padding: 0 }}}
                subheader={<li />}>
                {paragraphs.map(({ number, number_book, number_chapter, id_opera }) => {
                    const commentsByParagraph = comments.filter(
                        ({ number_paragraph }) => parseInt(number) === number_paragraph);
                    return (
                        <>
                            <Element name={`#comment-paragraph_${number}`}>
                                <ListSubheader>
                                    {`Paragraph #${number}`}
                                </ListSubheader>
                            </Element>
                            {commentsByParagraph.length === 0 && (
                                <ListItem key={`section-nocomment-${number}`}>
                                    <Typography>
                                        Non ci sono commenti per questo paragrafo.
                                    </Typography>
                                </ListItem>
                            )}
                            {commentsByParagraph.map(({ 
                                id, 
                                text, 
                                user, 
                                insert_date, 
                                number_paragraph,
                                number_book,
                                number_chapter,
                                id_opera, 
                                tags,
                                from_paragraph,
                                to_paragraph,
                                reference_to_comment,
                                parent_id,
                                room
                            }, index) => (
                                <li key={`section-${number_paragraph}`}>
                                    <ul>
                                        <ListItem key={id}>
                                                <Comment
                                                    opera={{
                                                        idOpera: id_opera, 
                                                        idBook: number_book,
                                                        idChapter: number_chapter,
                                                        idParagraph: number_paragraph
                                                    }}
                                                    comment={{
                                                        idComment: id,
                                                        name: user.name,
                                                        surname: user.surname,
                                                        insertDate: insert_date,
                                                        text: text,
                                                        tags: tags,
                                                        from: from_paragraph,
                                                        to: to_paragraph,
                                                        referenceToComment: reference_to_comment,
                                                        idParent: parent_id,
                                                        idUser: user.id,
                                                        idRoom: room && room.id ? room.id : null
                                                    }} 
                                                    handleUpdateComment={handleUpdateComment} />
                                        </ListItem>
                                    </ul>
                                </li>
                            ))}
                        </>
                    )
                })}
            </List>)
        }
    </Paper>
    )
}

export default CommentContainer;