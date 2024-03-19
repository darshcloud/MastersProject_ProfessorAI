import React, {useEffect, useState} from 'react';
import {Button, Grid, Alert, Typography} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    fileBox: {
        marginTop: 12,
        padding: 12,
        border: '2px solid #cccccc',
        backgroundColor: '#f9f9f9',
        background: 'linear-gradient(45deg, #f3f3f3 30%, #f9f9f9 90%)',
        borderRadius: 8,
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        '&:hover': {
            boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.2)',
            backgroundColor: '#f7f7f7',
        },
    },
});

const MaterialUpload = () => {
    const { courseId } = useParams(); // Fetch courseId from path parameters
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [courseName, setCourseName] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [uploading, setUploading] = useState(false);
    const classes = useStyles();

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/courses/${courseId}`, {
                    withCredentials: true
                });
                setCourseName(response.data.course_name);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourseDetails();
    }, [courseId, backendUrl]);

    // Function to handle file change
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    // Function to handle file upload
    const uploadFile = async () => {
        setUploading(true);
        if (file) {
            try {
                // Check if the file already exists
                const response = await axios.get(`${backendUrl}/api/courses/${courseId}/materials`, {
                    withCredentials: true
                });
                const existingMaterials = response.data;
                const existingMaterial = existingMaterials.find(material => material.file_name === file.name);

                const formData = new FormData();
                formData.append('file', file);

                if (existingMaterial) {
                    // Ask for confirmation before uploading if the file already exists
                    const confirmed = window.confirm("A file with the same name already exists. Are you sure you want to upload it anyway?");
                    if (!confirmed) {
                        setUploading(false);
                        return; // Do not upload if not confirmed
                    }
                }

                if (existingMaterial) {
                    // File already exists, perform PUT request
                    await axios.put(`${backendUrl}/api/courses/${courseId}/materials/${existingMaterial.material_id}`, formData, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }});
                    setSuccessMessage("File updated successfully.");
                } else {
                    // File does not exist, perform POST request
                    await axios.post(`${backendUrl}/api/courses/${courseId}/materials`, formData, {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }});
                    setSuccessMessage("File uploaded successfully.");
                }

                // Clear the file input and reset error state
                setFile(null);
                setError(null);
            } catch (error) {
                setError(error.message);
                setSuccessMessage(null);
            }
        } else {
            setError("Please select a file to upload.");
            setSuccessMessage(null);
        }
        setUploading(false);
    };

    return (
        <div className="dashboard">
            <br/>
            <Typography variant="h4" gutterBottom>
                Course Name: {courseName}
            </Typography>
            {error && <Alert variant="filled" severity="error" onClose={() => {setError("")}}>{error}</Alert>}
            {successMessage && <Alert variant="filled" severity="success" onClose={() => {setSuccessMessage("")}}>{successMessage}</Alert>}
            <br/>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <div className="content" style={{ paddingTop: '20px' }}>
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Select File
                            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                        </Button>
                        {file && (
                            <Box className={classes.fileBox}>
                                <Typography variant="subtitle1">
                                    {file.name}
                                </Typography>
                            </Box>
                        )}
                        <br/>
                        <Button variant="contained" color="primary" onClick={uploadFile} disabled={uploading}>Upload</Button>
                        {uploading && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                <CircularProgress color="secondary" />
                            </div>
                        )}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default MaterialUpload;
