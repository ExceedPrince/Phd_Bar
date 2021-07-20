const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const allowCors = require('./middleware/allowCors');
const corsOptions = require('./utils/corsOptions');
const notExists = require('./middleware/notExists');

// Init Middleware
app.use(express.json());
app.use(allowCors);
app.use(cors(corsOptions));

//GET - Basic route
//Public
app.get('/', async (req, res) => {
	res.send('Backend is on')
});

// Define Routes
app.use('/api/menu', require('./routes/api/menu'));
app.use('/api/openings', require('./routes/api/openings'));
app.use('/api/reservations', require('./routes/api/reservations'));
app.use('/api/admin', require('./routes/api/admin'));

app.use(notExists);

module.exports = app;