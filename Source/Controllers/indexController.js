import asyncHandler from 'express-async-handler'
import Movie from "../Models/MoviesModel.js"
import User from "../Models/UserModel.js"
import Categories from '../Models/CategoriesModel.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../middlewares/Auth.js';
import {MoviesData} from '../Data/MoviesData.js'
import {UsersData} from '../Data/UsersData.js'
import {CategoriesData} from '../Data/CategoriesData.js'

//get movie to homepage
const getMoviesClient = asyncHandler(async (req, res) => {
    // await Movie.deleteMany({});
    // //then we insert all movies from MoviesData
    // const movies = await Movie.insertMany(MoviesData)

    // await User.deleteMany({});
    // //then we insert all users from MoviesData
    // const users = await Movie.insertMany(UsersData)

    // await Categories.deleteMany({});
    // //then we insert all users from MoviesData
    // const categories = await Movie.insertMany(CategoriesData)
    try {
        const movies = await Movie.find({}).lean();
        // res.json(movies);
        res.render('home', { movies });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//Registring a User Page
//route GET /api/users/
//access public
const registerUserPage = asyncHandler(async (req, res) => {
    res.render('register');
});

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, confirmPassword, profilePicture } = req.body;
    try {
        const userExists = await User.findOne({ email });
        // check if user exists
        if (userExists) {
            res.render('register', { message: 'Email người dùng đã tồn tại' })
        }
        // if (userExists.username == username) {
        //   res.render('register',{message: 'Username already exists'})
        // }
        else if (password != confirmPassword) {
            res.render('register', { message: 'Mật khẩu không trùng khớp' })
        }
        else if (password < 6) {
            res.render('register', { message: 'Mật khẩu phải lớn hơn 6 kí tự' })
        }
        else {
            //hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // else create user in DB
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                profilePicture,
            });
            //if user created successfully send user data and token to client
            if (user) {
                res.render('login', { messagesuccess: 'Đăng kí thành công' });
            }
        }
    } catch (error) {
        res.render('register', { message: 'Something wrong, try again' })
    }
});

//login User
//route POST /api/users/login
//access public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).lean();
        const movies = await Movie.find({}).lean();
        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate JWT token with user's ID as the payload
            const token = generateToken(user._id);
            req.session.token = token;
            req.session.loggedIn = true;
            // res.json({ success: true, token });
            // res.status(200).redirect('/')
            res.render('home', {movies, user});
        } else {
            res.render('login', { message: 'Sai tên đăng nhập hoặc mật khẩu!' })
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const loginUserPage = asyncHandler(async (req, res) => {
    res.render('login');
});

const logoutUser = asyncHandler(async (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.status(200).redirect('/');
    });
});
export { getMoviesClient, registerUserPage ,registerUser, loginUserPage ,loginUser, logoutUser };