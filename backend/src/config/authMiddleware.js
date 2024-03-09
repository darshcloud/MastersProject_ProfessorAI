// authMiddleware.js

// isLoggedIn Middleware
// This middleware checks if the user is authenticated by looking for req.user,
// which is set by Passport.js upon successful authentication.
const isLoggedIn = (req, res, next) => {
    // Log the user object if debugging is necessary

    // Check if the user object exists indicating authentication was successful
    if (req.user) {
        next(); // Proceed to the next middleware or request handler
    } else {
        // If there is no user object, the request is not authenticated.
        // Send a 401 Unauthorized response.
        res.status(401).json({ message: "Unauthorized access. Please log in." });
    }
};

module.exports = {
    isLoggedIn,
};
