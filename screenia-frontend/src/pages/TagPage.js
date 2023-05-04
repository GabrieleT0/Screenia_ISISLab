import { useState, useEffect } from 'react';
import { 
    Grid,
    Box,
    Button,
    Divider
} from "@mui/material";
import { HookSelect, HookTextField, useHookForm } from "mui-react-hook-form-plus";
import { toast } from "react-toastify";
import { fetchPostTag, fetchTags } from "../api/opereApi";
import useLoader from '../customHooks/loaderHooks/useLoader';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    editable: false,
  },
  {
    field: 'description',
    headerName: 'Description',
    width: 350,
    editable: false,
  },
  {
    field: 'category',
    headerName: 'Category',
    width: 150,
    editable: false,
  }
];

const TagDataGrid = ({ tags = [] }) => {
  return (
    <Box sx={{ height: 350, width: '100%', bgcolor: 'background.paper' }}>
        <DataGrid
            getRowId={(row) => row?.title}
            rows={tags}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
        />
    </Box>
  );
}

const TagForm = ({ reloadTags = null }) => {
    const {
        registerState, 
        setError, 
        handleSubmit, 
        getValues, 
        setValue, 
        reset,
        formState: { errors } } = useHookForm({});
        
    const { setLoader } = useLoader();

    const onSubmit = async (data) => {
        try {
            setLoader();
            await fetchPostTag({
                title: data.title.toLowerCase(),
                description: data.description || null,
                category: data.category
            })
            toast.success("Tag successfully submitted!");

            if(reloadTags) {
                reloadTags();
            }

            reset()
        } catch(e) {
            const message = e?.response?.data?.message 
                ? e.response.data.message :
                 "Unable to submit data. Contact administration!"
            toast.error(message);
        } finally {
            setLoader();
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
            <Grid sx={{ padding: 2 }} container spacing={2}>
                <Grid item xs={12} md={6}>
                    <HookTextField 
                        {...registerState('title')}
                        textFieldProps={{
                            label: 'Title',
                            variant: 'outlined',
                            fullWidth: true
                        }}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please enter something',
                            },
                            minLength: {
                                value: 3,
                                message: 'Please enter at least 3 characters'
                            },
                            maxLength: {
                                value: 250,
                                message: 'You can enter a maximum of 255 characters!'
                            }
                        }} />
                </Grid>
                <Grid item xs={12} md={4}>
                    <HookSelect
                        {...registerState('category')}
                        label='Category'
                        selectProps={{
                            clearable: false,
                        }}
                        items={[
                            { label: "", value: "" },
                            { label: "Concepts", value: "concepts" },
                            { label: "Methods", value: "methods" }
                        ]}
                        rules={{
                            required: {
                                value: true,
                                message: 'Please select atleast one',
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <HookTextField 
                        {...registerState('description')}
                        textFieldProps={{
                            label: 'Description',
                            variant: 'outlined',
                            fullWidth: true,
                            multiline: true,
                            maxRows: 5
                        }}
                        rules={{
                            required: {
                                message: 'Required',
                                value: false,
                            },
                            minLength: {
                                value: 5,
                                message: 'Please enter at least 5 characters'
                            },
                            maxLength: {
                                value: 255,
                                message: 'You can enter a maximum of 255 characters!'
                            }
                        }} />
                </Grid>
                <Grid item xs={12}>
                    <Button 
                        type="submit"
                        variant="contained"
                        color="secondary"
                        style={{ color: "#fff", float: "right" }}>
                            Submit
                        </Button>
                </Grid>
            </Grid>
        </form>
    )
}

const TagPage = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        loadTags();
    }, [])

    const loadTags = async () => {
        try {
            const response = await fetchTags();
            setTags(response.data || []);
        } catch(e) {
        }
    }

    return (
        <>
            <Box
                id="tag_form_box"
                sx={{ 
                    flexGrow: 1, 
                    bgcolor: 'background.paper', 
                    display: 'flex',
                    justifyContent: 'center'
                }}
            >
                <TagForm reloadTags={() => loadTags()} />
            </Box>
            <Divider style={{ marginTop: 15, marginBottom: 15 }}/>
            <TagDataGrid tags={tags} />
        </>
    )
}

export default TagPage;