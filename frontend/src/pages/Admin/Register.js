import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, MenuItem ,Box} from '@mui/material';
import axios from 'axios'; // Ensure axios is imported for API calls
import Cookies from 'js-cookie';

function Register() {
  const [personId, setPersonId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [role, setRole] = useState('');
  const [registrationDetails, setRegistrationDetails] = useState(null);
  const [submissionError, setSubmissionError] = useState('');

  const handleSubmit = async (event) => {

    event.preventDefault();
    setRegistrationDetails(null); // Reset registration details on new submission
    setSubmissionError(''); // Reset submission error on new submission

    const token = Cookies.get('token'); // Retrieve your token from the cookie
    const headers = {
      Authorization: `Bearer ${token}` // Prepare the authorization header
    };
    const personData = {
        student_id: personId,
        first_name: firstName,
        last_name: lastName,
        email: email,
        bio: bio,
        phone_number: phoneNum,
        user_role: role
    };

    try {
      const response = await axios.post(`http://localhost:5000/api/admin/register`, personData, { headers });
      // Set the registration details from the response data to display them
      setRegistrationDetails(response.data);
    } catch (error) {
      console.error(`There was an error adding the ${role}:`, error);
      setSubmissionError(`Error adding ${role}: ` + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '30px' }}>
        <Typography component="h1" variant="h5">
          Register Professor/Student
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <TextField
            select
            label="Role"
            value={role}
            onChange={e => setRole(e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            required
          >
            <MenuItem key="student" value="student">Student</MenuItem>
            <MenuItem key="professor" value="professor">Professor</MenuItem>
          </TextField>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="personId"
            label={role === 'student' ? "Student ID" : "Professor ID"}
            name="personId"
            value={personId}
            onChange={(e) => setPersonId(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="bio"
            label="Bio"
            name="bio"
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phoneNum"
            label="Phone Number"
            name="phoneNum"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Register
          </Button>
          {submissionError && (
            <Typography color="error" style={{ marginTop: '20px' }}>
              {submissionError}
            </Typography>
          )}
        </form>
        {registrationDetails && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              {role.charAt(0).toUpperCase() + role.slice(1)} Registered Successfully!
            </Typography>
            <Typography variant="body1">Name: {registrationDetails.user.first_name} {registrationDetails.last_name}</Typography>
            <Typography variant="body1">Email: {registrationDetails.user.email}</Typography>
            <Typography variant="body1">Bio: {registrationDetails.user.bio}</Typography>
            <Typography variant="body1">Role: {registrationDetails.user.user_role}</Typography>
            <Typography variant="body1">Phone Number: {registrationDetails.user.phone_number}</Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Register;
