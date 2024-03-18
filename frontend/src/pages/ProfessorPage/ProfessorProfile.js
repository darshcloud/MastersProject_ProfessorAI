import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, IconButton} from '@mui/material';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import './ProfessorProfile.css';
import image from './avatar.jpg';
import {useAuth} from "../../context/AuthContext";
import {isValidPhoneNumber} from "libphonenumber-js";

const ProfessorProfile = () => {
  const { currentUser } = useAuth();
  const [professorDetails, setProfessorDetails] = useState({
    first_name: '',
    last_name: '',
    email: '',
    bio: '',
    phone_number: '',
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const professorId = currentUser?.professor_id;
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchProfileInformation = async () => {
      try {
        const response = await axios.get(
            `${backendUrl}/api/professor/profile/${professorId}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
              }}
        );
        setProfessorDetails(response.data);
      } catch (error) {
        setAlert({ show: true, message: 'Failed to load professor data', type: 'error' });
      }
    };

    fetchProfileInformation();
  }, [professorId, backendUrl]);
  const handleInputChange = (e) => {
    setProfessorDetails({
      ...professorDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setProfessorDetails({
      ...professorDetails,
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

  const saveProfessorProfileDetails = async () => {
    try {
      await axios.put(`${backendUrl}/api/professor/profile/update/${professorId}`,
          {
            bio: professorDetails.bio,
            phone_number: professorDetails.phone_number
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
    if (isValidUSPhoneNumber(professorDetails.phone_number)) {
      saveProfessorProfileDetails();
    } else {
      setAlert({ show: true, message: 'Please enter a valid US phone number.', type: 'error' });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, show: false });
  };

  return (
      <div className="professor-dashboard">
        <div className="content">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <img
                  /* Image by <a href="https://www.freepik.com/free-psd/3d-illustration-person-with-glasses_27470357.htm#fromView=search&page=3&position=52&uuid=203f7135-e817-456e-a9dc-79b530910992">Image by freepik</a> */
                  src={image}
                  alt="ProfilePicture"
                  style={{width: '100%', height: 'auto'}}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <h2>Personal Information</h2><br/>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="First Name" name="first_name" value={professorDetails.first_name} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Last Name" name="last_name" value={professorDetails.last_name} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Email" value={professorDetails.email} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Bio"
                      name="bio"
                      value={professorDetails.bio}
                      onChange={handleInputChange}
                      multiline
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Phone Number"
                      name="phone_number"
                      value={professorDetails.phone_number}
                      onChange={handleInputChange}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className="button-panel-2">
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


export default ProfessorProfile;
