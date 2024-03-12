import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Tooltip } from '@mui/material';

const MaterialTable = ({ materials, formatDateTime, handleDelete, backendUrl, courseId }) => {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="caption table">
                <TableHead>
                    <TableRow>
                        <TableCell><b>File Name</b></TableCell>
                        <TableCell><b>Created</b></TableCell>
                        <TableCell><b>Modified</b></TableCell>
                        <TableCell><b>Actions</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {materials.map((material, index) => (
                        <TableRow key={index}>
                            <TableCell style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <Tooltip title={material.file_name}>
                                    <span>{material.file_name}</span>
                                </Tooltip>
                            </TableCell>
                            <TableCell>{formatDateTime(material.created_at)}</TableCell>
                            <TableCell>{formatDateTime(material.updated_at)}</TableCell>
                            <TableCell>
                                <Grid container spacing={2} justifyContent="flex-start">
                                    <Grid item>
                                        <Button onClick={() => handleDelete(material.material_id)} variant="contained" color="error">
                                            Delete
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <a href={`${backendUrl}/api/courses/${courseId}/materials/${material.material_id}/view`} download style={{ textDecoration: 'none' }}>
                                            <Button variant="contained" color="success">
                                                View Material
                                            </Button>
                                        </a>
                                    </Grid>
                                </Grid>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MaterialTable;
