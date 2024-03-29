const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const { Sequelize } = require('sequelize');
const passportConfig = require('./src/config/passport');
require('./src/config/passport');
const dotenv = require('dotenv');
const { isLoggedIn } = require('./src/config/authMiddleware');
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Need to Replace with the URL of frontend of our custom domain later
    credentials: true // Allow cookies to be sent across origins
  }));

dotenv.config();
app.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false
  }));
//  
app.use(passport.initialize());
app.use(passport.session()); 
app.get('/api/auth/status', isLoggedIn, (req, res) => {
    // Initialize the user object to return
    let userResponse = {
        user_role: req.user.user_role,
        first_name: req.user.first_name,
    };

    if (req.user.user_role === 'student') {
        userResponse.student_id = req.user.student_id; 
    } else if (req.user.user_role === 'professor') {
        userResponse.professor_id = req.user.professor_id; 
    }

    // User is authenticated, return user info and authentication status
    res.json({
        isAuthenticated: true,
        user: userResponse,
    });
});


app.get('/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile']
        }
));

// Call back route
// Backend: /auth/google/callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:3000' }),
    function (req, res) {
        if (req.user.user_role === 'professor') {
            res.redirect('http://localhost:3000/professor');
        } else if (req.user.user_role === 'student') {
            res.redirect('http://localhost:3000/student');
        } else {
            res.redirect('http://localhost:3000');
        }
    }
);

// Route that logs out the authenticated user  
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error while destroying session:', err);
            return res.status(500).json({ message: 'Error destroying session' });
        }
        req.logout(() => {
            console.log('You are logged out');
            // Instead of redirecting, send a simple JSON response
            res.json({ success: true, message: 'Logged out successfully' });
        });
    });
});
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Server Status</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    margin: 40px; 
                    background-color: #f0f0f0; 
                    text-align: center; 
                    color: #333;
                }
                h1 { color: #0366d6; }
                p { font-size: 20px; }
            </style>
        </head>
        <body>
            <h1>Vola! The server is running.</h1>
            <p>Backend API server is now up and operational. Ready to handle requests!</p>
        </body>
        </html>
    `);
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
        passportConfig.setSequelize(sequelize);
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
