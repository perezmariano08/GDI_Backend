const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const routes = require('./routes/routes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://localhost:5174'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use('/api', routes);

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Corriendo en http://localhost:${port}`);
});

server.setTimeout(30000);
