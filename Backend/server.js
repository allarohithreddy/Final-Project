const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const authRoutes = require('./authRoutes');

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'rohit_nbad',
    database: 'rohit_nbad'
});

const secretKey = 'Rohitreddy'

const jwtMiddleware = expressJwt({
    secret: secretKey,
    algorithms: ['HS256']
});

app.use(express.json());

app.get('/api/solarGrowth', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Assuming you have user authentication

    connection.query(
        'SELECT * FROM solar_growth',  // Fetch all data from solar_growth table
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get solar growth data' });
            } else {
                res.json(results);
            }
        }
    );
});

app.get('/api/solarAdoption', jwtMiddleware, (req, res) => {
    const userId = req.auth.userId;  // Assuming you have user authentication

    connection.query(
        'SELECT region, percentage FROM solar_adoption_regions',  // Fetch all data from solar_growth table
        (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Failed to get solar adoption  data' });
            } else {
                res.json(results);
            }
        }
    );
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

const closeMysqlConnection = () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed');
        }
    });
};

app.use('/', authRoutes);

app.get('/', async (req, res) => {
        res.status(200).json({success : true, message : 'Everything is Good.'});
});

const server = app.listen(port, () => {
    console.log(`Server on port ${port}`);
});

// Close the server and MySQL connection when the tests are finished
process.on('exit', () => {
    server.close();
    closeMysqlConnection();
    console.log('Server and MySQL connection closed');
});

module.exports = app;