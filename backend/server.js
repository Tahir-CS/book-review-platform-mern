const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken'); // JWT was not imported
const customer_routes = require('./routes/auth_users.js').authenticated;
const genl_routes = require('./routes/general.js').general;

const app = express();

app.use(express.json());

// Session middleware setup for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware for authenticated customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) { // Check if user is logged in
        let token = req.session.authorization['accessToken']; // Retrieve token from session
        jwt.verify(token, "access", (err, user) => { // Verify JWT
            if (!err) {
                req.user = user;
                next(); // If token is valid, proceed
            }
            else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));