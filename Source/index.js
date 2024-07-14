import express from 'express';
const app = express();
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import indexRouter from './Routes/indexRouter.js'
import userRouter from './Routes/UserRouter.js'
import moviesRouter from './Routes/MoviesRouter.js'
import categoriesRouter from './Routes/CategoriesRouter.js'
import bodyParser from 'body-parser';
import { errorHandler } from './middlewares/errorMiddleware.js';
import expressHandlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(cors());
app.use(express.json());

app.engine('handlebars', expressHandlebars.engine({

    defaultLayout: 'main',

}));
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '/public')));

//connect DB
connectDB();


app.use(bodyParser.json());

app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: false,
}));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//other routes
app.use("/", indexRouter);
app.use("/api/users", userRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/categories", categoriesRouter);

//error handling middleware
app.use(errorHandler);

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
  });