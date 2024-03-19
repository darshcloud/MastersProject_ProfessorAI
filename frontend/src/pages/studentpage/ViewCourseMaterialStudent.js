import React, { useEffect, useState } from 'react';
import FilePreview from "../FilesViewer/FilePreview";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from "axios";

import { makeStyles } from '@mui/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const useStyles = makeStyles((theme) => ({
    centerContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
}));

const ViewCourseMaterialStudent = ({ materialId, materialName, courseId }) => {

    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [files, setFiles] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                // Fetch the path using materialId and courseId
                const response = await axios.get(`${backendUrl}/api/courses/${courseId}/materials/${materialId}/view`, {
                    withCredentials: true,
                });
                const materialLink = response.data.downloadLink;

                // Extract the file type from materialName
                const fileType = materialName.split('.').pop();

                // Add the new material to the files array
                setFiles([{
                    name: materialName,
                    path: materialLink,
                    type: fileType
                }]);
            } catch (error) {
                console.error('Error fetching material:', error);
            }
        };

        fetchMaterial();
    }, [materialId, materialName, courseId, backendUrl]);

    const handleOpen = (file) => {
        setSelectedFile(file);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
    };

    const handleDownload = () => {
        if (selectedFile) {
            const link = document.createElement("a");
            link.href = selectedFile.path;
            link.download = selectedFile.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const fileViewerStyle = {
        width: '100%',
        maxHeight: '600px',
        overflow: 'auto',
        backgroundColor: '#f8f8f8',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
    };

    const dialogStyle = {
        backgroundColor: '#fff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: '10px',
        padding: '20px',
    };

    const dialogContentStyle = {
        position: 'relative',
        overflow: 'hidden',
    };

    const fileItemStyle = {
        padding: '10px 15px',
        borderBottom: '1px solid #e0e0e0',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#e8e8e8',
        },
        fontSize: '16px',
    };

    const buttonStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.25)',
        '&:hover': {
            backgroundColor: '#0056b3',
        },
        margin: '0 10px',
    };

    const closeButtonStyle = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        '&:hover': {
            backgroundColor: '#5a6268',
        },
    };

    return (
        <div>
            <br/>
            <div className={classes.centerContainer}>
                <h3>Please click on the selected file to preview</h3>
                <List>
                    {files.map(file => (
                        <ListItem button key={file.name} onClick={() => handleOpen(file)} style={fileItemStyle}>
                            <ListItemIcon>
                                <InsertDriveFileIcon/>
                            </ListItemIcon>
                            <ListItemText primary={file.name}/>
                        </ListItem>
                    ))}
                </List>
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth style={dialogStyle}>
                <DialogContent dividers style={dialogContentStyle}>
                    {selectedFile && (
                        <div style={fileViewerStyle}>
                            <FilePreview
                                fileType={selectedFile.type}
                                filePath={selectedFile.path}
                            />
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDownload} style={buttonStyle}>Download</Button>
                    <Button onClick={handleClose} style={closeButtonStyle}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );

};

export default ViewCourseMaterialStudent;