import {
    Container,
    Paper,
    Grid, 
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CakeIcon from '@mui/icons-material/Cake';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import { List } from '@mui/material';
import { ListItemIcon } from '@mui/material';
import { ListItemText } from '@mui/material';
import { ListItem } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip } from '@mui/material';

const useStyles = (theme => ({
    disabled: {
        color: "#000",
        "-webkit-text-fill-color": "#000 !important"
    }
}));

const DateAccordion = ({ dates = [] }) => {
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>Author's Dates</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {dates.map((item) => {
                        const labelInfoReference = item.is_reference_date
                        ? `This is the date to consider for reference`
                        : `This is another possible, but not reference date`

                        const labelBirthOrDeath = item.is_birth_date 
                            ? (<CakeIcon color="secondary" />)
                            : (<LocalHospitalIcon color="secondary" />)

                        const labelData = (
                            <ListItemText sx={{ float: "rigth" }} 
                                primary={item.data} 
                                secondary={item.comment || null} />)
                        return (
                            <ListItem>
                                <ListItemIcon>
                                    <Tooltip title={labelInfoReference}>
                                        <InfoIcon color="secondary" />
                                    </Tooltip>
                                    {labelBirthOrDeath}
                                </ListItemIcon>
                                    {labelData}
                            </ListItem>)
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

const PlaceAccordion = ({ places = [] }) => {
    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>Author's Places</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {places.map((item) => {
                        const labelInfoReference = item.is_reference_place
                            ? `This is the place to consider for reference`
                            : `This is another possible, but not reference place`

                        const labelBirthOrDeath = item.is_birth_place
                            ? (<CakeIcon color="secondary" />)
                            : (<LocalHospitalIcon color="secondary" />)

                        const labelPlace = (
                            <ListItemText sx={{ float: "rigth" }} 
                                primary={item.current ? `${item.place} (Current: ${item.current})` : `${item.place}`} 
                                secondary={item.comment || null} />)
                        return (
                            <ListItem>
                                <ListItemIcon>
                                    <Tooltip title={labelInfoReference}>
                                        <InfoIcon color="secondary" />
                                    </Tooltip>
                                    {labelBirthOrDeath}
                                </ListItemIcon>
                                {labelPlace}
                            </ListItem>)
                    })}
                </List>
            </AccordionDetails>
        </Accordion>
    )
}

const AuthorDetails = ({ author }) => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Paper elevation={2} sx={{ padding: 5 }} >
        <Grid
            container
            direction="row"
            spacing={2} >
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="Name" variant="standard" value={author.name} 
                    InputProps={{
                    classes:{
                        disabled: classes.disabled
                    }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="IT Name" variant="standard" value={author.it_name} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="EN Name" variant="standard" value={author.en_name} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="FR Name" variant="standard" value={author.fr_name} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="DE Name" variant="standard" value={author.de_name} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="Short Name" variant="standard" value={author.short_name} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12}>
                    <DateAccordion dates={author.date} />
                </Grid>
                <Grid item xs={12}>
                    <PlaceAccordion places={author.place} />
                </Grid>
        </Grid>
        </Paper>
        </Container>
    )
}

export default AuthorDetails;