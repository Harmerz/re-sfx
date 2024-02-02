const dotenv = require("dotenv");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const connectDB = require("./config/db.js");
const multer = require('multer');
const cors = require('cors');
const uuid = require('uuid');
const azureStorage = require('./api/function/azureStorage.js');
const Sounds = require("./api/models/Sounds.js");
const { BlobServiceClient } = require('@azure/storage-blob');
const cookieParser = require('cookie-parser');

app.use(cors());

// Use dotenv to load environment variables
dotenv.config({ path: "./.env" });


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


// Set up static file serving
app.use(express.static("public"));

// Set up session middleware
app.use(
  session({
    secret: process.env.JWT_SECRET, // Replace with a secure secret key
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Connect to MongoDB (or your database)
connectDB();

// Start the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

// Import and use your routes
const UserRouter = require("./api/routes/User.js");
const verificationRouter = require("./api/routes/tokenVerification.js");
const SoundsRouter = require("./api/routes/Sounds.js")
const FavouritesROuter = require("./api/routes/Favourites.js")
app.use("/", verificationRouter);
app.use("/user", UserRouter);
app.use("/sounds", SoundsRouter);
app.use("/fav", FavouritesROuter);
