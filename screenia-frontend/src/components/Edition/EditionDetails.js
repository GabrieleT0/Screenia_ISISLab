import {
    Container,
    Paper,
    Grid, 
    TextField,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { Typography } from '@mui/material';
import { Alert } from '@mui/material';

const useStyles = (theme => ({
    disabled: {
        color: "#000",
        "-webkit-text-fill-color": "#000 !important"
    }
}));

const EditionDetails = ({ edition }) => {
    const classes = useStyles();

    return (
        <Container maxWidth="lg" sx={{ marginTop: 5 }}>
        <Paper elevation={2} sx={{ padding: 5 }} >
        <Grid
            container
            direction="row"
            spacing={2} >
                {edition.is_reference && (
                    <Grid item xs={12} md={12}>
                        <Alert severity="info">
                            <Typography variant="caption">
                                {`Note: this edition is the reference edition of the opera.`}
                            </Typography>
                        </Alert>
                    </Grid>
                )}
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="ISBN" variant="standard" value={edition.ISBN} 
                    InputProps={{
                    classes:{
                        disabled: classes.disabled
                    }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="IPI" variant="standard" value={edition.IPI} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="Publisher" variant="standard" value={edition.publisher} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="Serie" variant="standard" value={edition.serie} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="Date of publication" variant="standard" value={edition.date} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField disabled fullWidth label="#Volume" variant="standard" value={edition.volumes.length} 
                    InputProps={{
                        classes:{
                            disabled: classes.disabled
                        }}} />
                </Grid>
            </Grid>
        </Paper>
        </Container>
    )
}

export default EditionDetails;