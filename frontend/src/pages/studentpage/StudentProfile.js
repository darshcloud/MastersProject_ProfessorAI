import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, IconButton} from '@mui/material';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import './StudentProfile.css';
import image from './avatar.jpg';
import {useAuth} from "../../context/AuthContext";
import { isValidPhoneNumber } from 'libphonenumber-js';

const StudentProfile = () => {
  const { currentUser } = useAuth();
  const [studentDetails, setStudentDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone_number: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const studentId = currentUser?.student_id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProfileInformation = async () => {
      try {
        const response = await axios.get(
            `${backendUrl}/api/student/profile/${studentId}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
              }}
        );
        setStudentDetails(response.data);
      } catch (error) {
        // Handle the error
        setAlert({ show: true, message: 'Failed to load student data', type: 'error' });
      }
    };

    fetchProfileInformation();
  }, [studentId, backendUrl]);
  const handleInputChange = (e) => {
    setStudentDetails({
      ...studentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setStudentDetails({
      ...studentDetails,
      bio: '',
      phone_number: '',
    });
  };

  const isValidUSPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) {
      return true;
    }
    if (phoneNumber.startsWith('+') && !phoneNumber.startsWith('+1')) {
      return false;
    }
    return isValidPhoneNumber(phoneNumber, 'US');
  };

  const saveStudentProfileDetails = async () => {
    try {
      await axios.put(`${backendUrl}/api/student/profile/update/${studentId}`,
          {
            bio: studentDetails.bio,
            phone_number: studentDetails.phone_number
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin": "*"
            }
          }
      );

      setAlert({ show: true, message: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      setAlert({ show: true, message: 'Error updating profile.', type: 'error' });
    }
  };

  const handleSave = () => {
    if (isValidUSPhoneNumber(studentDetails.phone_number)) {
      saveStudentProfileDetails();
    } else {
      setAlert({ show: true, message: 'Please enter a valid US phone number.', type: 'error' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
      <div className="dashboard">
        <div className="content">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <img
                  /* Image by <a href="https://www.freepik.com/free-psd/3d-illustration-human-avatar-profile_58509056.htm#query=happy%20avatar&position=21&from_view=keyword&track=ais&uuid=0f376cd8-810e-4240-9f4a-6e1911ef6ebe">Freepik</a> */
                  src={image}
                  alt="ProfilePicture"
                  style={{width: '100%', height: 'auto'}}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <h2>Personal Information</h2><br/>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="First Name" name="first_name" value={studentDetails.first_name} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Last Name" name="last_name" value={studentDetails.last_name} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" value={studentDetails.email} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Bio"
                      name="bio"
                      value={studentDetails.bio}
                      onChange={handleInputChange}
                      multiline
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Phone Number"
                      name="phone_number"
                      value={studentDetails.phone_number}
                      onChange={handleInputChange}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="buttonpanel">
                    <Button variant="contained" style={{ backgroundColor: 'primary' }} onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="contained" style={{ backgroundColor: 'red' }} onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </Grid>
              </Grid>
              <br/>
            </Grid>
          </Grid>
          {alert.show && (
              <Alert
                  variant="filled"
                  severity={alert.type}
                  action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={handleCloseAlert}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
              >
                {alert.message}
              </Alert>
          )}
        </div>
      </div>
  );
};


export default StudentProfile;
