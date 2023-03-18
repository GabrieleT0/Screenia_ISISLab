import React, { useEffect, useRef, useState } from 'react';
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
import { fetchCommentsByRoom, fetchDiscussionByRoom } from '../api/opereApi';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/system';
import Message from '../components/Room/Message';
import DraftEditor from "../components/RichText/DraftEditor";
import moment from 'moment';
import { Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { getCommentsAndDiscussionsSelector } from '../state/room/roomSelector';
import { useRecoilState, useRecoilValue } from 'recoil';
import { roomCommentsAtom } from '../state/room/roomAtom';

export default function DiscussionCommentPage() {
    const { idRoom } = useParams();
    const theme = useTheme();
    const [toggleDiscussion, setToogleDiscussion] = useState(null);
    const messages = useRecoilValue(getCommentsAndDiscussionsSelector);
    const [room, setRoom] = useRecoilState(roomCommentsAtom);

    useEffect(() => {
        setRoom({
            idRoom: idRoom,
            filter: 'both'
        })
    }, [idRoom]);

    useEffect(() => console.log('messages', messages), [messages]);

    const handleChangeToggleDiscussion = (event, newToggle) => {
        setRoom({
            idRoom: idRoom,
            filter: newToggle
        })
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ marginBottom: 3 }}>
                <ToggleButtonGroup
                    color="primary"
                    value={room.filter}
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
                                    <DraftEditor
                                        editor={null}
                                        readOnly={false}
                                        idOpera={180} 
                                        callbackChangeEditor={() => console.log('ok')} 
                                        styleOptions={{ width: '100%', maxHeight: '200px', overflowY: 'scroll' }} />
                                </Grid>
                                <Grid item>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={() => console.log('ok')}
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
