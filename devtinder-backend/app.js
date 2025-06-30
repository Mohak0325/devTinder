const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestsRouter = require('./routes/request');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const initializeSocket = require('./utils/socket');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH'],
}));

app.use('/api/auth' , authRouter);
app.use('/api/profile' , profileRouter);
app.use('/api/request' , requestsRouter);
app.use('/api/user' , userRouter);
app.use('/api/chat' , chatRouter);

app.get("/", (req, res) => {
  res.send("Dev Tinder API is running");
});

const port =  process.env.PORT || 7777;

const server = http.createServer(app);
initializeSocket(server);


connectDB().then(() => {
    server.listen(port , () => {
        console.log(`Server is running on port ${port}`)
    });
}).catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
});

