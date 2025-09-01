// backend/db.js
// This file configures and exports the MySQL database connection.
// Change the values of host, user, password, and database according to your environment.

const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',      // Database server
  user: 'root',           // MySQL user (adjust if different)
  password: 'Jeronimo11', // MySQL password (adjust if you have one)
  database: 'gma',        // Database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool to use it in other files
module.exports = pool;
