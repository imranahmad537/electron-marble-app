const express = require('express');
const mySql = require('mysql')
const cors = require('cors')

const app = express();
app.use(cors());

const db = mySql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"marble-factory"
})

// db.connect(err => {
//   if (err) {
//     console.error('❌ MySQL connection error:', err);
//     return;
//   }
//   console.log('✅ Connected to MySQL database');
// });

// Helper function to run a query with promise support
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

async function main() {
  try {
    // Step 1: Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      )
    `);
    console.log('Table "users" is ready');

    // Step 2: Insert a user
    const insertResult = await query('INSERT INTO users (name) VALUES (?)', ['John Doe']);
    console.log('Inserted user with ID:', insertResult.insertId);

    // Step 3: Query all users
    const users = await query('SELECT * FROM users');
    console.log('Users:', users);

    // Close the pool (optional, if you want to end process)
    db.end();
  } catch (err) {
    console.error('MySQL error:', err);
  }
}

main();
app.get('/getData', (req, res) => {
    const sql = "SELECT * FROM ";
    db.query(sql, (req, res) => {
        
    })
})

app.get('/', (req, res) => {
    return res.json("From Backend side")
})

app.listen(3000, () =>{
    console.log(`The server is listening on port ${3000}`)
})




// middlewares, routes, etc.
app.use(express.json());
// app.use('/api', require('./routes/someRoute'));

module.exports = app; // Export app so Electron can start it
