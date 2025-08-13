const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// example route
app.get('/', (req, res) => res.json('Backend: OK'));

// import and register your routes
// const orderRoutes = require('./routes/orderRoutes');
// app.use('/api/orders', orderRoutes);

module.exports = app;
