import React, { useContext, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Stack,
  Typography,
  ThemeProvider,
  TextField,
  Grid,
  Chip
} from "@mui/material";
import { Box } from "@mui/system";
import { Delete, Edit } from "@mui/icons-material";
import DraftEditor from "../RichText/DraftEditor";
import { EditorState } from 'draft-js';
import { convertFromRaw } from 'draft-js';
import moment from "moment";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

const MessageDiscussion = ({ message }) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start" 
      spacing={2} >
      <Grid item>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
            {`${message.user.name.substring(0, 1)}${message.user.surname.substring(0, 1)}`}
          </Avatar>
          <Typography
            fontWeight="bold"
            sx={{ color: "neutral.darkBlue" }} >
            {`${message.user.name} ${message.user.surname}`}
          </Typography>
          <Typography sx={{ color: "neutral.grayishBlue" }}>
            {moment(message.insert_date).format("DD/MM/YY HH:mm")}
          </Typography>
        </Stack>
      </Grid>
      <Grid item>
        <DraftEditor
          content={convertFromRaw(JSON.parse(message.text))}
          readOnly={true}
          idOpera={180} 
          idComment={129} 
          referenceToComment={null} 
          simpleEditor={true} />
      </Grid>
    </Grid>
  )
}

const MessageComment = ({ message }) => {
  console.log('o messagg', message)
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start" 
      spacing={2} >
      <Grid item>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: (theme) => theme.palette.secondary.main }}>
            {`${message.user.name.substring(0, 1)}${message.user.surname.substring(0, 1)}`}
          </Avatar>
          <Typography
            fontWeight="bold"
            sx={{ color: "neutral.darkBlue" }} >
            {`${message.user.name} ${message.user.surname}`}
          </Typography>
          <Typography sx={{ color: "neutral.grayishBlue" }}>
            {moment(message.insert_date).format("DD/MM/YY HH:mm")}
          </Typography>  
          <Chip 
            label={message.impact ? message.impact.toUpperCase() : "Primary Comment"}
            color="primary" 
            icon={<PriorityHighIcon />} />
        </Stack>
      </Grid>
      <Grid item>
        {parseInt(message.from_paragraph) !== parseInt(message.to_paragraph) && (
            <Typography variant="caption" style={{ color: "#00000094" }}>
                Comment from paragraph <strong>{message.from_paragraph}</strong> to <strong>{message.to_paragraph}</strong>
            </Typography>
        )}
      </Grid>
      <Grid item>
        {message.tags.map((tag) => (
            <Chip label={tag} style={{ margin: 3 }}/>
        ))}
      </Grid>
      <Grid item>
        <DraftEditor
          content={convertFromRaw(JSON.parse(message.text))}
          readOnly={true}
          idOpera={180} 
          idComment={129} 
          referenceToComment={null} />
      </Grid>
    </Grid>
  )
}

const Message = ({ message }) => {

  return (
      <Card sx={{ width: "fit-content", height: "fit-content" }}>
        <Box 
          sx={{ 
            p: "15px", 
            backgroundColor: (theme) => !message.room_id ? theme.palette.grey[200] : null,
            borderRadius: '5px', 
            boxShadow: (theme) => 
                        (`inset -2px -3px 0px 0px ${theme.palette.grey[400]}, 
                        1px 2px 0px 1px ${theme.palette.grey[400]}`)
          }}>
          {message.room_id 
            ? (<MessageDiscussion message={message} />)
            : (<MessageComment message={message} />)
          }
        </Box>
      </Card>
  );
};
export default Message;