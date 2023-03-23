import React from "react";

import Button from '@mui/material/Button';
import { Box } from "@mui/system";

const UploadFileButton: React.FC<{ handleProcessing: (file: File) => void, label?: string }> = ({ handleProcessing, label = "Upload" }) => {

    const [file, setFile] = React.useState<File>();

    const buttonName = () => {
        if (!file) return "No file chosen yet";
        return `Process ${file.name}`;
    }


    return (
        <Box sx={{ display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
            <label htmlFor="contained-button-file">
                <input style={{ display: "none" }} accept="*" id="contained-button-file" type="file" onChange={(e) => {
                    setFile(() => {
                        if (e.target.files) {
                            return e.target.files[0]
                        }
                    });
                }} />
                <Button variant="outlined" component="span" >
                    {label}
                </Button>
            </label>
            <Button disabled={!file ? true : false} sx={{ ml: 2 }} variant="contained" onClick={() => { file && handleProcessing(file) }}>{buttonName()}</Button>
        </Box>
    );
}

export default UploadFileButton;
