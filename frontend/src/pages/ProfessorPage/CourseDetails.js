import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import MaterialTable from "./MaterialTable";
import {Typography, Button, Grid, Alert} from '@mui/material';
import ViewCourseMaterial from "./ViewCourseMaterial";

const CourseDetails = () => {
    const { courseId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/courses/${courseId}`, {
                    withCredentials: true,
                });
                setCourseName(response.data.course_name);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourseDetails();
    }, [courseId, backendUrl]);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/courses/${courseId}/materials`, {
                    withCredentials: true,
                });
                setMaterials(response.data);
                setError(null);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchMaterials();
    }, [courseId, backendUrl]);

    // Function to format date without seconds
    const formatDateTime = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const formattedDateTime = dateTime.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        return formattedDateTime;
    };

    // Function to handle delete action
    const handleDelete = async (materialId) => {
        try {
            await axios.delete(`${backendUrl}/api/courses/${courseId}/materials/${materialId}`, {
                withCredentials: true
            });
            // Remove the deleted material from the state
            setMaterials(materials.filter(material => material.material_id !== materialId));
        } catch (error) {
            setError(error.message);
        }
    };

    const history = useHistory();

    const handleUpload = (courseId) => {
        history.push(`/Professor/Course/${courseId}/upload`);
    };

    const handleViewMaterial = (materialId, materialName, courseId) => {
        setSelectedMaterial({ materialId, materialName, courseId });
    }

    return (
        <div className="dashboard">
            <br/>
            <Typography variant="h4" gutterBottom>
                Course Name: {courseName}
            </Typography>
            {error && <Alert severity="error" onClose={() => {setError("")}}>{error}</Alert>}
            <br/>
            <div className="content">
                <Grid container spacing={2}>
                    <Grid item xs={12} container justifyContent="flex-end">
                        <Button onClick={() => handleUpload(courseId)} variant="contained" color="primary">
                            Upload
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            materials={materials}
                            formatDateTime={formatDateTime}
                            handleDelete={handleDelete}
                            handleViewMaterial={handleViewMaterial}
                            backendUrl={backendUrl}
                            courseId={courseId}
                        />
                        {selectedMaterial && (
                            <ViewCourseMaterial
                                materialId={selectedMaterial.materialId}
                                materialName={selectedMaterial.materialName}
                                courseId={selectedMaterial.courseId}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default CourseDetails;
