require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth2').Strategy;

let sequelizeInstance;

// Function to set the sequelize instance from outside
function setSequelize(sequelize) {
    sequelizeInstance = sequelize;
}

passport.use(new GoogleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: "http://localhost:5000/auth/google/callback",
        passReqToCallback: true
    },
    async function (request, accessToken, refreshToken, profile, done) {
        try {
            if (!sequelizeInstance) {
                console.error("Sequelize instance is not set.");
                return done(null, false, { message: "Sequelize instance is not set." });
            }

            const email = profile.email ? profile.email : profile.emails[0].value;

            // Dynamically require your models using the sequelize instance
            const ProfessorModel = require('../models/Professor')(sequelizeInstance);
            const StudentModel = require('../models/student')(sequelizeInstance);

            let user = await ProfessorModel.findOne({ where: { email: email } });
            if (!user) {
                user = await StudentModel.findOne({ where: { email: email } });
            }
    
            if (user) {
                // Convert Sequelize model instance to a plain object
                const userObj = user.get({ plain: true });
                //const userObj = user.get({ plain: true });
                //console.log(userObj)
                return done(null, userObj);
            } else {
                return done(null, false, { message: 'User not found in the database.' });
            }
        } catch (error) {
            console.error("Error in authentication:", error);
            return done(error);
        }
    }));

passport.serializeUser(function (user, done) {
    // Serializes the entire database user object into the session
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // Directly deserializes the user object from the session
    done(null, user);
});

module.exports = { setSequelize };

