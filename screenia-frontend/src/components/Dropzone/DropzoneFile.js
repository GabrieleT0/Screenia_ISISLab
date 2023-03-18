import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Typography } from "@mui/material";
import { FileUploader } from "react-drag-drop-files";

const DropzoneFile = ({ fileTypes = [], handleFiles }) => {

  return (
    <>
        <Typography>To Drag & Drop Files</Typography>
        <FileUploader
            multiple={false}
            handleChange={handleFiles}
            name="file"
            types={fileTypes}
        />
    </>
  );
}

DropzoneFile.propTypes = {
    fileTypes: PropTypes.array
}

export default DropzoneFile;
