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

const getJsonRichTextReferenceToMultipleComment = (mention = null) => {  
    if(!mention || !mention.id || !mention.name || !mention.link) return null;
  
    const text = `Refer to the comment by ${mention.name}`;
    return {
      "blocks":[
         {
            "text": `Refer to the comment by ${mention.name}`,
            "type":"unstyled",
            "depth":0,
            "inlineStyleRanges":[
               
            ],
            "entityRanges":[
               {
                  "offset": 0,
                  "length": text.substring(0, 24).length + mention.name.length,
                  "key":0
               }
            ],
            "data":{
               
            }
         }
      ],
      "entityMap":{
         "0":{
            "type":"/comment_multiple_referencemention",
            "mutability":"IMMUTABLE",
            "data":{
               "mention":{
                  "id": mention.id,
                  "name": mention.name,
                  "link": mention.link,
                  "type":"comment_multiple_reference"
               }
            }
         }
      }
   }
}

const generateCommentReferences = (comments = []) => {
    const newComments = [
        ...comments
    ];

    //Create reference comment for view
    for(const comment of comments) {
        if(comment.from_paragraph !== comment.to_paragraph) {
          for(let i=0; i < comment.to_paragraph - 1; i++) {
            const jsonMultipleComment = getJsonRichTextReferenceToMultipleComment({ 
              id: `${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`,
              name: `${comment.user.name} ${comment.user.surname}, paragraph ${comment.label ? comment.label : comment.number_paragraph}`,
              link: `${comment.id_opera}, ${comment.number_book}, ${comment.number_chapter}, ${comment.number_paragraph}`
            });
  
            newComments.push({
              id_opera: comment.id_opera,
              number_book: comment.number_book,
              number_chapter: comment.number_chapter,
              number_paragraph: comment.number_paragraph,
              text: JSON.stringify(jsonMultipleComment),
              from_paragraph: 0,
              to_paragraph: 0,
              number_paragraph: i+1,
              reference_to_comment: comment.id,
              insert_date: comment.insert_date,
              tags: [...comment.tags],
              user: {...comment.user.dataValues}
            })
          }
        }
    }

    return newComments;
}

const CommentContainer = ({ comments = [], paragraphs = [], handleUpdateComment }) => {
    const commentsView = generateCommentReferences(comments);

    return (
        <Paper id="container_comment" style={{ height: 550, marginTop: 15, overflowY: 'scroll' }}>
        {commentsView && commentsView.length > 0 && 
            (<List 
                sx={{ height: '10000px', '& ul': { padding: 0 }}}
                subheader={<li />}>
                {paragraphs.map(({ number, number_book, number_chapter, id_opera }) => {
                    const commentsByParagraph = commentsView.filter(
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