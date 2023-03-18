import { Typography } from "@mui/material";
import { 
    List,
    ListSubheader,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material";
import BasicCard from "../BasicCard/BasicCard";
import InfoIcon from '@mui/icons-material/Info';

const ListItemAuthor = ({ author, handleSelect }) => {
    return (
        <>
            <ListItem alignItems="flex-start">
                <ListItemText>
                    <IconButton onClick={() => handleSelect(author)}>
                        <InfoIcon color="secondary" />
                    </IconButton>
                    <Typography sx={{ display: "inline" }}>{author.name}</Typography>
                </ListItemText>
            </ListItem>
        </>
    )
}

const CardAuthor = ({ authors = [], handleSelect }) => {
    return (
        <BasicCard>
            <List sx={{ 
                width: '100%',
                maxHeight: 250,
                overflow: "auto",
                bgcolor: 'background.paper' }}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Authors
                    </ListSubheader>
                } >
                {authors.map((author) => 
                    (<ListItemAuthor author={author} handleSelect={handleSelect} />)
                )}
            </List>
        </BasicCard>
    )
}

export default CardAuthor;