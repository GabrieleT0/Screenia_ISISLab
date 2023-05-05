import { 
    Autocomplete, 
    LinearProgress, 
    TextField, 
    Tooltip,
    Typography
} from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { fetchTags } from '../../api/opereApi';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import _ from "lodash";

const TagAutocomplete = ({ value = [], handleSelect = null, readOnly = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [tagValue, setTagValue] = useState("");
    const [tagsOptions, setTagsOptions] = useState([]);

    const placeholderOption = {
        title: 'Type to search for more tags...',
        placeholder: true,
        disabled: true
    };
    const debouncedSearchTags = _.debounce((value) => searchTags(value), 1000);

    useEffect(() => { 
        searchTags("");
    }, []);

    useEffect(() => {
        if(!tagValue) return;
        setIsLoading(true);

        debouncedSearchTags(tagValue)
    }, [tagValue]);

    const searchTags = async (value) => {

        try {
            const response = await fetchTags(value);
            let options = [];

            if(response.data && response.data.length > 0) {
                options = [...response.data]
            }

            setTagValue("");
            setTagsOptions(options);
        } catch(e) {
            toast.error("Impossibile recuperare i Tag. Contattare l'amministrazione!")
        } finally {
            setIsLoading(false);
        }
    }

    const onChangeTag = useCallback((e, value) => {
        if(!value) return;

        handleSelect(value);
        setTagsOptions([]);
    })

    return (
        <Autocomplete
            multiple
            id="tags-comment"
            value={value}
            noOptionsText="Type something to search for a tag!"
            options={[
                ...tagsOptions.filter((option) => !option.placeholder),
                placeholderOption
            ].sort((a, b) => -b.category.localeCompare(a.category))}
            getOptionLabel={(option) => option.title}
            onChange={onChangeTag}
            style={{ maxWidth: 583 }}
            getOptionDisabled={(option) => {
                if(option.disabled) return true;

                return false;
            }}
            disabled={readOnly}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.title === value.title}
            groupBy={(option) => option.category}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Tags"
                    onChange={(e) => setTagValue(e.target.value)}
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
            renderOption={(props, option, { selected }) => {
                if (option.placeholder) {
                    return (
                        <li {...props}>
                            <Typography variant="caption">
                                {option.title}
                            </Typography>
                        </li>
                    );
                } else {
                    return (
                        <li {...props}>
                            <Tooltip title={`${option.description ? option.description : ""}`}>
                                <InfoIcon style={{ marginRight: 5 }} color="secondary" />
                            </Tooltip>
                            {option.title}
                        </li>
                    )
                }
            }}
        />
    )
}

export default TagAutocomplete;