import {
    Grid,
    Avatar,
    Chip,
    Typography,
    IconButton
} from "@mui/material";
import moment from "moment";
import { Element, animateScroll as scroll, scroller } from 'react-scroll';
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import DraftEditor from '../RichText/DraftEditor';
import EditIcon from '@mui/icons-material/Edit';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import authTokenAtom from "../../state/authToken/authTokenAtom";
import { userAtom } from "../../state/user/userAtom";
import { fetchCreateRoom } from "../../api/opereApi";
import { useCallback } from "react";
import useLoader from "../../customHooks/loaderHooks/useLoader";
import confirmModalAtom from "../../state/modal/confirmModalAtom";
import { red, green } from '@mui/material/colors';

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
        idRoom
    } = comment;
    const authToken = useRecoilValue(authTokenAtom);
    const userLogged = useRecoilValue(userAtom);
    const { setLoader } = useLoader();
    //Confirm Modal State
    const [modal, setModal] = useRecoilState(confirmModalAtom);

    console.log('prova', JSON.parse(text))

    const handleClickRoom = useCallback(() => {
        if(idRoom) {

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
        } catch(e) {
            console.log('Error: ', e)
        } finally {
            setLoader();
        }
    }

    return (
        <Element name={`#comment_${idComment}`}>
            <Grid container wrap="nowrap" spacing={2}>
                <Grid item>
                    <Avatar alt={`${name} ${surname}`} />
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
                                            color:  !comment.idRoom ? red[500] : green[600] 
                                        }} />
                                </IconButton>
                            )}
                        </p>)}
                    </Grid>
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
                    <DraftEditor
                        editor={() => EditorState.createWithContent(
                            convertFromRaw(JSON.parse(text))
                        )}
                        readOnly={true}
                        idOpera={idOpera} 
                        idComment={idComment} 
                        referenceToComment={referenceToComment} 
                        isMentionsComment={true} />
                </Grid>
        </Grid>
        </Element>
    )
}

export default Comment;