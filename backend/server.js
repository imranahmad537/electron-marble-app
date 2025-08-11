const express = require('express');
const mySql = require('mysql')
const cors = require('cors')

const app = express();
app.use(cors());

const db = mySql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"marble-factory"
})

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