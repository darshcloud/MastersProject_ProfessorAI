import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Adjust the path as necessary

const Professor = () => {
  const { currentUser, logout } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phoneNumber: ''
  }); // Initialize state for profile details

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(currentUser.professor_id)
        // Assuming you have the professor's ID in currentUser.professor_id
        // Adjust URL and endpoint as necessary
        const response = await fetch(`http://localhost:5000/api/professor/profile/${currentUser.professor_id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // Include other headers as required, such as Authorization
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          // Assuming the response data has the structure { firstName, lastName, email, bio, phoneNumber }
          setProfile({
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            bio: data.bio,
            phoneNumber: data.phone_number,
          });
        } else {
          console.error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (currentUser && currentUser.professor_id) {
      fetchProfile();
    }
  }, [currentUser]); // Dependency array to refetch if currentUser changes

  const handleLogout = async () => {
    try {
      await logout();
      // Handle post-logout logic, like redirecting
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="professor-page">
      <h1>Welcome, {profile.firstName} {profile.lastName}!</h1>
      <div>
        <p>Email: {profile.email}</p>
        <p>Bio: {profile.bio}</p>
        <p>Phone: {profile.phoneNumber}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Professor;
