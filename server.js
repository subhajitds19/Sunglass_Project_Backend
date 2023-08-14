const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const multer = require('multer')
const flash=require('connect-flash')
const session = require('express-session');
const cookieparser = require('cookie-parser');
const adminauth = require('./middleware/adminAuth');

const app = express();

const port = process.env.PORT || 2100;

const ApiRoute = require('./routes/apiRoute');
const AdminRoute = require('./routes/adminRouter');

const dbLink = "mongodb+srv://subhajit:AAEKaz6muMqEtvZO@cluster0.krtm1ec.mongodb.net/SunglassProject";


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(flash());
app.use(cookieparser());
app.use(session({
    cookie: { maxAge: 5000 },
    secret: 'nodejs',
    resave: false,
    saveUninitialized: false
}))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    }, filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("png") ||
        file.mimetype.includes("jpg") ||
        file.mimetype.includes("webp") ||
        file.mimetype.includes("jpeg")) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
app.use(multer({
    storage: fileStorage, fileFilter: fileFilter, limits: {
        fieldSize: 1024 * 1024 * 5
    }
}).single('image'))


app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(adminauth.adminjwt);

app.use(ApiRoute);
app.use(AdminRoute);

// app.use(auth.veryfyToken)

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(port, () => {
            console.log(`Server Running http://localhost:${port}`);
            console.log("Database Connected");
        })
    })