const express = require('express');
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const {OAuth2Client} = require('google-auth-library');
const app = express();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate a URL that asks permissions for the user's email and profile
const SCOPES = ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'];

app.get('/auth/google', (req, res) => {
    // Generate the Google Authentication URL
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    res.redirect(authUrl);
});

const {google} = require('googleapis');

app.get('/auth/google/callback', async (req, res) => {
    const {code} = req.query;
    if (code) {
        try {
            // Exchange the authorization code for tokens
            const {tokens} = await oAuth2Client.getToken(code);
            oAuth2Client.setCredentials(tokens);

            // Create a Google People API client
            const peopleService = google.people({version: 'v1', auth: oAuth2Client});

            // Retrieve user profile information
            const profile = await peopleService.people.get({
                resourceName: 'people/me',
                personFields: 'names,emailAddresses,photos',
            });

            // Extract the profile information
            const userInfo = {
                name: profile.data.names?.[0]?.displayName,
                email: profile.data.emailAddresses?.[0]?.value,
                photo: profile.data.photos?.[0]?.url,
            };

            // Respond with the user info in JSON format
            res.json(userInfo);
        } catch (error) {
            console.error('Error retrieving user info', error);
            res.status(500).json({ error: 'Failed to retrieve user profile' });
        }
    } else {
        res.status(400).json({ error: 'Invalid request: no code provided' });
    }
});



// Load environment variables from .env file
dotenv.config();

// MySQL connection configuration
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// Middleware to parse JSON bodies
app.use(express.json());

// Load routes
const apiRoutes = require('./src/routes/api');

// Use routes
app.use('/api', apiRoutes(sequelize));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
