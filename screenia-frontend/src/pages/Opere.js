import { Grid, Fab, Button } from "@mui/material"
import { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import CardOpera from "../components/Opera/CardOpera";
import moment from "moment";
import { fetchAllOpere, fetchUploadOpera } from "../api/opereApi";
import { Pagination } from "@mui/material";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SimpleDialog from "../components/Dialog/SimpleDialog";
import DropzoneFile from "../components/Dropzone/DropzoneFile";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { opereAtom } from "../state/opera/opereAtom";

const OPERE_FOR_PAGE = 10;

const OperePage = () => {
    const opere = useRecoilValue(opereAtom);
    const [page, setPage] = useState(1);
    const [openUploadOpera, setOpenUploadOpera] = useState(false);
    const [fileOpera, setFileOpera] = useState(null);

    const opereFetch = useRecoilCallback(({ set }) => async (page = 1, forPage = OPERE_FOR_PAGE) => {
        try {
            const response = await fetchAllOpere({
                page,
                forPage
            })

            set(opereAtom, response.data.data);
        } catch(e) {
            return toast.error("Unable to upload the work. Please contact the administration!");
        }
    });

    useEffect(() => {
        opereFetch();
    }, [page])

    const handleChangePage = (event, value) => {
        if(!value) {
            return;
        }

        setPage(value);
    }

    const handleDialogUploadOpera = () => {
        if(fileOpera) {
            setFileOpera(null);
        }
        setOpenUploadOpera(lastValueOpen => !lastValueOpen);
    }

    const handleUploadOpera = (file) => {
        if(!file) return;

        setFileOpera(file)
    }

    const saveFileOpera = async () => {
        try {
            const response = await fetchUploadOpera(fileOpera);
            setFileOpera(null);
            if(response.status === 200) {
                toast.info("The opera has been taken up!");
                opereFetch(page, OPERE_FOR_PAGE);
            }
        } catch(e) {
            toast.error("Unable to upload the work. Please contact the administration!");
        } finally {
            setOpenUploadOpera(false);
        }
    }

    const reloadOpere = () => {
        opereFetch(page, OPERE_FOR_PAGE);
        toast.info("Uploading of opere done!")
    }

    return (
        <>
            <IconButton 
                color="secondary" 
                onClick={reloadOpere}
                style={{ float: "right" }}>
                <Tooltip title="Reload Opera">
                    <RestartAltIcon></RestartAltIcon>
                </Tooltip>
            </IconButton>
            {openUploadOpera && 
            (<SimpleDialog
                open={openUploadOpera}
                handleClose={handleDialogUploadOpera}
                buttons={[
                    (<Button 
                        onClick={handleDialogUploadOpera} 
                        color="info">Close</Button>),
                    (<Button 
                        onClick={saveFileOpera}
                        variant="contained" 
                        color="info"
                        disabled={!fileOpera}>Upload</Button>),
                ]} >
                    <DropzoneFile 
                        fileTypes={['ZIP', 'RAR', 'TAR', 'GZIP']} 
                        file={fileOpera}
                        handleFiles={handleUploadOpera}
                    />
                    <Typography style={{ marginTop: 15 }}>
                        {fileOpera ? `File name: ${fileOpera?.name}` : "No files uploaded!"}
                    </Typography>
                </SimpleDialog>)}
            <Grid container spacing={2}>
                {Array.isArray(opere) && opere.map(({ id, title, insert_date, authors, editions}) => {
                    const edition = editions.find((edition) => edition.is_reference);

                    return (
                        <Grid item xs={12} md={4}>
                            <CardOpera 
                                id={id}
                                title={title} 
                                date={moment(insert_date).isValid() ? 
                                    moment(insert_date).format("DD/MM/YYYY HH:mm:ss")
                                    : ""
                                } 
                                author={authors[0] ? authors[0].name : ""} 
                                edition={edition ? edition.ISBN : ""} />
                        </Grid>)
                    })}
                <Grid item xs={12}>
                    {opere && opere.length > 0 && 
                        (<Pagination 
                            count={Math.ceil(opere.length/OPERE_FOR_PAGE)} 
                            onChange={handleChangePage} 
                            style={{ display: "flex", justifyContent: "center" }} />)
                    }
                </Grid>
            </Grid>
            <Fab 
                onClick={handleDialogUploadOpera} 
                color="secondary" 
                aria-label="Upload Opera" 
                style={{ 
                    position: "absolute",
                    bottom: 15,
                    right: 15
                }}>
                <FileUploadIcon style={{ color: "#fff" }} />
            </Fab>
      </>
    )
}

export default OperePage;