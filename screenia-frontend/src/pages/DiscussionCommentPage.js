import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
    Paper,
    List,
    ListItem,
    ListItemText,
    Input,
    Button,
    Typography,
    useTheme,
    ListItemAvatar,
    Avatar,
    Breadcrumbs,
    Link,
    ButtonGroup,
    Grid,
    Stack,
    ToggleButtonGroup,
    ToggleButton
} from "@mui/material";
import { toast } from 'react-toastify';
import { fetchCommentsByRoom, fetchDiscussionByRoom, fetchPostDiscussionByRoom } from '../api/opereApi';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import Message from '../components/Room/Message';
import DraftEditor from "../components/RichText/DraftEditor";
import moment from 'moment';
import { Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { getCommentsAndDiscussionsSelector } from '../state/room/roomSelector';
import { useRecoilState, useRecoilValue } from 'recoil';
import { roomCommentsAtom } from '../state/room/roomAtom';
import uuid from 'react-uuid';
import { EditorState } from 'draft-js';
import confirmModalAtom from '../state/modal/confirmModalAtom';
import { Contrast } from '@mui/icons-material';
import QuillRichText from '../components/QuillRichText/QuillRichText';

export default function DiscussionCommentPage() {
    const { idRoom } = useParams();
    const theme = useTheme();
    const [toggleDiscussion, setToogleDiscussion] = useState('both');
    const messages = useRecoilValue(getCommentsAndDiscussionsSelector);
    const [room, setRoom] = useRecoilState(roomCommentsAtom);
    const [editor, setEditor] = useState(() => EditorState.createEmpty());
    const [textEditor, setTextEditor] = useState({
        plainText: "",
        convertToRaw: {}
    });
    //Confirm Modal State
    const [modal, setModal] = useRecoilState(confirmModalAtom);

    useEffect(() => {
        setRoom({
            idRoom: idRoom,
            filter: 'both'
        })
    }, [idRoom]);

    useEffect(() => console.log('messages', messages), [messages]);

    const handleChangeToggleDiscussion = (event, newToggle) => {
        if(!newToggle) return;

        setToogleDiscussion(newToggle);
        
        setRoom({
            idRoom: idRoom,
            filter: newToggle
        })
    };

    const handleChangeEditor = useCallback((plainText, convertToRaw) => {
        setTextEditor({
            plainText,
            convertToRaw
        })
    })

    const onSubmitDiscussion = useCallback(async () => {
        try {
            handleChangeContentEditor({}, "");
            await fetchPostDiscussionByRoom({
                text: JSON.stringify(textEditor.convertToRaw),
                flat_text: textEditor.plainText,
                room_id: idRoom
            });

            setRoom({
                idRoom: idRoom,
                filter: toggleDiscussion
            })
        } catch(e) {
            console.log('Errore', e);
            toast.error("Error in posting discussion. If the error persists, please contact the administration!");
        }
    })

    const handleConfirmSubmitDiscussion = () => {
        if(!validateDiscussion()) return;

        setModal({
            isOpen: true,
            title: "Are you sure you want to submit the comment?",
            description: "The operation is irreversible!",
            handleConfirm: onSubmitDiscussion
        })
    }

    const validateDiscussion = () => {
        if(!textEditor.plainText.trim()) {
            toast.warning("Non è possibile inviare un commento vuoto!");
            return false;
        } else if(textEditor.plainText.trim().length < 5) {
            toast.warning("Per inviare un commento bisogna inserire almeno cinque caratteri!");
            return false;
        }

        return true;
    }

    useEffect(() => console.log('OK RESET', textEditor), [])

    const handleChangeContentEditor = useCallback((convertToRaw, plainText) => {
        setTextEditor({
            plainText,
            convertToRaw
        })
    })

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginBottom: 3 }}>
                <ToggleButtonGroup
                    color="primary"
                    value={toggleDiscussion}
                    exclusive
                    onChange={handleChangeToggleDiscussion}
                >
                    <ToggleButton value="history">History</ToggleButton>
                    <ToggleButton value="both">Both</ToggleButton>
                    <ToggleButton value="discussion">Discussion</ToggleButton>
                </ToggleButtonGroup>
            </Box>
            <Box 
                component={Paper} 
                sx={{
                    width: '100%', 
                    height: '500px', 
                    overflow: 'scroll',
                    padding: 5,
                }} >
                <Stack spacing={3} id="container_discussion">
                    {messages.map((message) => (
                        <Message message={message} />
                    ))}
                </Stack>
            </Box>
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch" 
                spacing={2} 
                sx={{ marginTop: 3 }}>
                <Grid item>
                    <Paper sx={{ padding: 2 }}>
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch" >
                                <Grid item>
                                    {/*<DraftEditor
                                        editorKey={uuid()}
                                        editor={editor}
                                        readOnly={false}
                                        disabledMension={true}
                                        callbackChangeEditor={handleChangeEditor} 
                    styleOptions={{ width: '100%', maxHeight: '200px', overflowY: 'scroll' }} />*/}
                                <QuillRichText
                                    content={textEditor.convertToRaw} 
                                    handleChangeContent={handleChangeContentEditor}
                                    disabledMension={true} />
                                </Grid>
                                <Grid item>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={handleConfirmSubmitDiscussion}
                                        style={{ float: "right" }}>
                                        Save
                                    </Button>
                                </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}
