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

const ListItemEdition = ({ edition, handleSelect }) => {
    return (
        <>
            <ListItem alignItems="flex-start">
                    <ListItemText>
                        <IconButton onClick={() => handleSelect(edition)}>
                            <InfoIcon color="secondary" />
                        </IconButton>
                        <Typography sx={{ display: "inline" }}>{edition.ISBN}</Typography>
                    </ListItemText>
                </ListItem>
        </>
    )
}

const CardEdition = ({ editions = [], handleSelect }) => {
    return (
        <BasicCard>
            <List sx={{ 
                width: '100%',
                maxHeight: 250,
                overflow: "auto",
                bgcolor: 'background.paper' }}
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                      Editions
                    </ListSubheader>
                } >
                {editions.map((edition) => 
                    (<ListItemEdition edition={edition} handleSelect={handleSelect} />)
                )}
            </List>
        </BasicCard>
    )
}

export default CardEdition;