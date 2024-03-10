import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfessorNav from "./ProfessorNav";
import MaterialTable from "./MaterialTable";
import {Typography, Button, Grid, Alert} from '@mui/material';

const CourseDetails = () => {
    const { courseId } = useParams();
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);
    const [courseName, setCourseName] = useState('');
    const backendUrl = process.env.REACT_APP_BACKEND_URL;

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
    }, [courseId]);

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
    }, [courseId]);

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

    return (
        <div className="dashboard">
            <Typography variant="h4" gutterBottom>
                Course: {courseName}
            </Typography>
            {error && <Alert severity="error" onClose={() => {setError("")}}>{error}</Alert>}
            <br/>
            <div className="content">
                <Grid container spacing={2}>
                    <Grid item xs={12} container justifyContent="flex-end">
                            <Button href={`/Professor/Course/${courseId}/upload`} variant="contained" color="primary">
                                Upload
                            </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTable
                            materials={materials}
                            formatDateTime={formatDateTime}
                            handleDelete={handleDelete}
                            backendUrl={backendUrl}
                            courseId={courseId}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default CourseDetails;
