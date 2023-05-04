import { useCallback, useEffect, useState } from "react";
import {
    Grid,
    Avatar,
    Chip,
    Typography,
    IconButton,
    Paper
} from "@mui/material";
import moment from "moment";
import { Element, animateScroll as scroll, scroller } from 'react-scroll';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import DraftEditor from '../RichText/DraftEditor';
import EditIcon from '@mui/icons-material/Edit';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import authTokenAtom from "../../state/authToken/authTokenAtom";
import { userAtom } from "../../state/user/userAtom";
import { fetchCreateRoom } from "../../api/opereApi";
import useLoader from "../../customHooks/loaderHooks/useLoader";
import confirmModalAtom from "../../state/modal/confirmModalAtom";
import { red, green } from '@mui/material/colors';
import uuid from 'react-uuid';
import { commentAtom } from "../../state/comment/commentAtom";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import QuillRichText from "../QuillRichText/QuillRichText"; 
import { getHtmlComment } from "../../utils/quillRichTextUtils";

const Comment = ({ opera, comment, handleUpdateComment }) => {
    const { idOpera, idBook, idChapter, idParagraph } = opera;
    const { 
        idComment, 
        name = "", 
        surname= "", 
        insertDate = "",
        text = {}, 
        tags = [], 
        from = 0, 
        to = 0, 
        referenceToComment = null ,
        idParent,
        idUser,
        idRoom,
        impact
    } = comment;
    const authToken = useRecoilValue(authTokenAtom);
    const userLogged = useRecoilValue(userAtom);
    const { setLoader } = useLoader();
    const [modal, setModal] = useRecoilState(confirmModalAtom);
    const [editor, setEditor] = useState(null);
    const navigate = useNavigate();
    const [commentFilter, setCommentFilter] = useRecoilState(commentAtom); //Set comment filter for reload comments

    const handleClickRoom = useCallback(() => {
        if(idRoom) {
            navigate(`/room/${idRoom}`);
        } else {
            console.log('modale room')

            setModal({
                isOpen: true,
                title: "Are you sure you want to create a discussion room?",
                description: "The operation is irreversible!",
                handleConfirm: postCreateRoom
            })
        }
    })

    const postCreateRoom = async () => {
        try {
            setLoader();
            await fetchCreateRoom({
                comment_paragraph_id: idComment
            });


            setCommentFilter({
                idOpera,
                idBook,
                idChapter,
                filters: null
            })
        } catch(e) {
            console.log('Error: ', e)
        } finally {
            setLoader();
        }
    }

    return (
        <Paper style={{ width: "100%", padding: 3 }}>
            <Element name={`comment_${idOpera}/${idBook}/${idChapter}/${idParagraph}/${idComment}`}>
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
                            {`${name.charAt(0)}${surname.charAt(0)}`}
                        </Avatar>
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                        <Grid item>
                            <h4 style={{ margin: 0, textAlign: "left", display: "inline" }}>
                                {`${name} ${surname}`}
                            </h4>
                            <p style={{ textAlign: "left", color: "gray", display: "inline", marginLeft: 3 }}>
                                {moment(insertDate).format("DD/MM/YY HH:mm")}
                            </p>
                            {!referenceToComment && 
                                (<p style={{ textAlign: "left", color: "gray", display: "inline" }}>
                                    {authToken 
                                        && userLogged.id === idUser 
                                        && 
                                        (<IconButton 
                                            aria-label="update-comment" 
                                            onClick={() => handleUpdateComment({ ...comment, ...opera })}>
                                            <EditIcon color="secondary" style={{ fontSize: '1em' }} />
                                        </IconButton>)}
                                    {authToken && (
                                        <IconButton 
                                            size="small" 
                                            aria-label="update-comment"
                                            onClick={handleClickRoom} >
                                            <MeetingRoomIcon  
                                                style={{ 
                                                    fontSize: '1em', 
                                                    color: !comment.idRoom ? red[500] : green[600] 
                                                }} />
                                        </IconButton>
                                    )}
                                </p>)}
                        </Grid>
                        {impact && 
                            (<Grid item>
                                    <p style={{ textAlign: "left", color: "gray", display: "inline" }}>
                                        Edited comment with <strong>{impact}</strong> impact
                                    </p>
                            </Grid>)}
                        <Grid item>
                            {parseInt(from) !== parseInt(to) && (
                                <Typography variant="caption" style={{ color: "#00000094" }}>
                                    Comment from paragraph <strong>{from}</strong> to <strong>{to}</strong>
                                </Typography>
                            )}
                        </Grid>
                        <Grid item>
                            {tags.map(({ title }) => (
                                <Chip label={title} style={{ margin: 3 }}/>
                            ))}
                        </Grid>
                        {/*<DraftEditor
                            editorKey={uuid()}
                            editor={editor}
                            readOnly={true}
                            idOpera={idOpera} 
                            idComment={idComment} 
                            referenceToComment={referenceToComment} />*/}
                        <Grid item>
                            <Typography 
                                variant="body1" 
                                component="div" 
                                style={{ maxHeight: 100, overflowY: "auto" }}
                                dangerouslySetInnerHTML={{ __html: getHtmlComment(JSON.parse(text).ops) }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Element>
        </Paper>
    )
}

export default Comment;