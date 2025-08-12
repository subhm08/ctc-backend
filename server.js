const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser')

dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ['http://localhost:5173', 'https://c2c-physio-admin.vercel.app', 'https://c2c-physio.vercel.app'],
    allowedHeaders: ['Content-Type', "x-api-key"],
   }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors(
  {
    origin:  ['http://localhost:5173', 'https://c2c-physio-admin.vercel.app', 'https://c2c-physio.vercel.app'],
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());
app.use('/appointments', require('./routes/appointmentRoute')(io));
app.use('/enquiry', require('./routes/enquiryRoute')(io));
app.use('/admin', require('./routes/authRoute'))
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
