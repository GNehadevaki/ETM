const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const session = require('express-session'); 





const app = express();
app.use(bodyParser.json()); // Parse incoming JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("neha"));

// Configure session middleware
app.use(session({
    secret: 'secret', // Change this to a secure random string in production
    resave: true,
    saveUninitialized: true
}));

// Create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Neha2004',
    database: 'neha'
});

// Connect to the database
connection.connect(function (error) {
    if (error) throw error;
    console.log('Connected to MySQL database');
});

// Function to send files with correct paths
const sendFile = (res, filename, message) => {
    const filePath = path.join(__dirname, filename);
    if (message) {
        res.redirect(`${filename}?message=${encodeURIComponent(message)}`);
    } else {
        res.sendFile(filePath);
    }
};

app.get("/", function (req, res) {
    sendFile(res, "/index.html");
});

app.get("/login", function (req, res) {
    sendFile(res, "/login.html");
});

app.get("/signup", function (req, res) {
    sendFile(res, "/signup.html");
});





app.post("/signup", function (req, res) {
    const { name, email, password, phone, gender } = req.body;

    // Insert the new user
    connection.query("INSERT INTO loginuser (user_name, user_mail, user_password, phone_number, gender) VALUES (?, ?, ?, ?, ?)", [name, email, password, phone, gender], function (error, results) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error occurred while signing up.");
        }
        console.log('User inserted successfully');

        // Create tables for the user based on email
        const soloTableName = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}_solo`;
        const familyTableName = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}_family`;
        const businessTableName = `user_${email.replace(/[^a-zA-Z0-9]/g, "_")}_business`;

        const createTableQuery = `CREATE TABLE IF NOT EXISTS ?? (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            date DATE,
            description VARCHAR(255),
            amount DECIMAL(10, 2),
            type ENUM('expense', 'income'),
            note TEXT,
            wallet ENUM('cash', 'debit', 'credit'),
            budget DECIMAL(10, 2) DEFAULT 0
        )`;

        // Create solo table
        connection.query(createTableQuery, [soloTableName], function (error, results) {
            if (error) {
                console.error(error);
                return res.status(500).send("Error occurred while creating solo table.");
            }
            console.log(`Table ${soloTableName} created successfully`);

            // Create family table
            connection.query(createTableQuery, [familyTableName], function (error, results) {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Error occurred while creating family table.");
                }
                console.log(`Table ${familyTableName} created successfully`);

                // Create business table
                connection.query(createTableQuery, [businessTableName], function (error, results) {
                    if (error) {
                        console.error(error);
                        return res.status(500).send("Error occurred while creating business table.");
                    }
                    console.log(`Table ${businessTableName} created successfully`);

                    req.session.email = email; // Store email in session
                    res.redirect("main.html");
                });
            });
        });
    });
});








app.post("/login", function (req, res) {
    const { email, password } = req.body;
    connection.query("SELECT * FROM loginuser WHERE user_mail = ? AND user_password = ?", [email, password], function (error, results, fields) {
        if (error) {
            console.error(error);
            return res.status(500).send("Error occurred while logging in.");
        }
        if (results.length === 0) {
            return res.status(404).send("User not found or incorrect password.");
        }
        const user = results[0];
        req.session.email = email; // Store email in session
        res.redirect("main.html");
    });
});
















app.get("/welcome", function (req, res) {
    sendFile(res, "/welcome.html");
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
