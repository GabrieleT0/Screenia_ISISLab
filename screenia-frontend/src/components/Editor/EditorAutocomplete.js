import {
    Autocomplete,
    TextField
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchUsersEditors } from '../../api/userApi';

const EditorAutocomplete = ({ value = null, handleSelect = null, readOnly = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [editorOptions, setEditorOptions] = useState([]);

    useEffect(() => { 
        getUsersEditors();
    }, []);

    const getUsersEditors = async () => {

        try {
            setIsLoading(true);
            const response = await fetchUsersEditors();
            let options = [];

            if(response.data && response.data.length > 0) {
                options = [...response.data]
            }

            setEditorOptions(options);
        } catch(e) {
            toast.error("Impossibile recuperare i Tag. Contattare l'amministrazione!")
        } finally {
            setIsLoading(false);
        }
    }

    const onChangeTag = useCallback((e, value) => {
        if(!value) return;

        handleSelect(value);
    })

    return (
        <Autocomplete
            multiple={false}
            value={value}
            id="editors-comment"
            noOptionsText="There is no editor present!"
            options={editorOptions.sort()}
            getOptionLabel={(option) => {
                const editorFilter = editorOptions.filter(
                    ({ name, surname }) => 
                        name.toLowerCase() === option.name.toLowerCase() &&
                        surname.toLowerCase() === option.surname.toLowerCase());

                if(editorFilter.length > 1) {
                    return `${option.name} ${option.surname} - ${option.email}`;
                }

                return `${option.name} ${option.surname}`;
            }}
            onChange={onChangeTag}
            style={{ maxWidth: 583 }}
            getOptionDisabled={(option) => {
                if(option.disabled) return true;

                return false;
            }}
            disabled={readOnly}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Editor"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                        <>
                            {isLoading ? <CircularProgress color="primary" size={20} /> : null}
                            {params.InputProps.endAdornment}
                        </>
                        ),
                    }} />
            )}
        />
    )
}

export default EditorAutocomplete;