import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken';
import User from "../Models/UserModel.js"
import bcrypt from 'bcryptjs'
import session from 'express-session';
import { generateToken } from '../middlewares/Auth.js';

//********** PUBLIC CONTROLLER **********

// //Registring a User
// //route POST /api/users/
// //access public
// const registerUser = asyncHandler(async (req, res) => {
//   const { username, email, password, confirmPassword, profilePicture } = req.body;
//   try {
//     const userExists = await User.findOne({ email});
//     // check if user exists
//     if (userExists) {
//       res.render('register',{message: 'Email người dùng đã tồn tại'})
//     }
//     // if (userExists.username == username) {
//     //   res.render('register',{message: 'Username already exists'})
//     // }
//     else if (password != confirmPassword) {
//       res.render('register', {message: 'Mật khẩu không trùng khớp'})
//     }
//     else if (password < 6) {
//       res.render('register', {message: 'Mật khẩu phải lớn hơn 6 kí tự'})
//     }
//     else{
//       //hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       // else create user in DB
//       const user = await User.create({
//         username,
//         email,
//         password: hashedPassword,
//         profilePicture,
//       });
//       //if user created successfully send user data and token to client
//       if (user) {
//         res.render('login', {messagesuccess: 'Đăng kí thành công'});
//       }
//     }
//   } catch (error) {
//     res.render('register', {message: 'Something wrong, try again'})
//   }
// });

// //login User
// //route POST /api/users/login
// //access public
// const loginUser = asyncHandler(async (req, res) => {
//   const {username, password } = req.body;
//   try {
//     const user = await User.findOne({ username});
//     if (user && (await bcrypt.compare(password, user.password))) {
//       // Generate JWT token with user's ID as the payload
//       const token = generateToken(user._id);
//       req.session.token = token;
//       req.session.loggedIn = true;
//       // res.json({ success: true, token });
//       res.render('home', {user})
//     }else{
//       res.render('login', {message: 'Sai tên đăng nhập hoặc mật khẩu!'})
//     }
//   } catch (error) { 
//     res.status(400).json({ message: error.message });
//   }
// });

// const logoutUser = asyncHandler(async (req, res, next) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error(err);
//     }
//     res.redirect('/login');
//   });
// });


//********** PRIVATE CONTROLLER **********

//Update user profile
//route PUT /api/users
//access private
const updateUserProfile = asyncHandler(async(req, res)=>{
  const {username, email, profilePicture} = req.body;
  try{
    const user = await User.findById(req.user._id);
    if(user){
      user.username = username || user.username;
      user.email = email || user.email;
      user.profilePicture = profilePicture || user.profilePicture;
      
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        username: updateUser.username,
        email: updateUser.email,
        profilePicture: updateUser.profilePicture,
        isAdmin: user.isAdmin,
        token: generateToken(updateUser._id),
      });
    }else{
      res.status(404);
      throw new Error("User not found");
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//delete user profile
//route DELETE /api/users
//access private
const deleteUserProfile = asyncHandler(async(req, res)=>{
  try{
    //find user in DB
    const user = await User.findById(req.user._id);
    //if user exists, delete user from db
    if(user){
      //if user is admin throw error message
      if(user.isAdmin){
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      // else delete user from db
      await user.deleteOne();
      res.json({message: "User deleted successfully"});
    }
    //else send err msg
    else{
      res.status(404);
      throw new Error("User not found");
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//change user password
//route PUT /api/users/password
//access private
const changeUserPassword = asyncHandler(async(req, res)=>{
  const {oldPassword, newPassword} = req.body;
  try{
    //find user in db
    const user = await User.findById(req.user._id);
    //if user exists, compare old pass with hashed pass
    if(user && (await bcrypt.compare(oldPassword, user.password))){
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
      await user.save();
      res.json({message: "Password changed!"});
    }
    //else send err msg
    else{
      res.status(401);
      throw new Error("Invalid old password");
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//get favorites movie
//route get /api/users/favorites
//access private
const getLikedMovie = asyncHandler(async(req, res)=>{
  try{
    //find user in db
    const user = await User.findById(req.user._id).populate("likedMovies");
    //if user exists, send like movies to client
    if(user){
      res.json(user.likedMovies);
    }
    //else send err msg
    else{
      res.status(404);
      throw new Error("User not found");
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//bookmard favorites movie
//route POST /api/users/favorites
//access private
const addLikedMovie = asyncHandler(async(req, res)=>{
  const{movieId} = req.body;
  try{
    //find user in db
    const user = await User.findById(req.user._id);
    //if user exists, add movie to liked movies and save it in db
    if(user){
      //check if movie already liked
      //if movie already liked send err msg
      if(user.likedMovies.includes(movieId)){
        res.status(400);
        throw new Error("Movie already liked"); 
      }
      //else add movie to liked movies and save it in db
      user.likedMovies.push(movieId);
      await user.save();
      res.json(user.likedMovies);
    }
    //else send err msg
    else{
      res.status(404);
      throw new Error("Movie not found");
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//delete bookmark favorites movie
//route delete /api/users/favorites
//access private
const deleteLikedMovie = asyncHandler(async(req, res)=>{
  try{
    //find user in db
    const user = await User.findById(req.user._id);
    //if user exists, delete all liked movies and save it in db,
    if(user){
      user.likedMovies = [];
      await user.save();
      res.json({message: "All favorites movies deleted successfully"});
  
    }
    //else send err msg
    else{
      res.status(404);
      throw new Error("User not found");
    }
  }catch(eror){
    res.status(400).json({message: error.message});
  }

});


//********** ADMIN CONTROLLER **********
const getAdminpage = asyncHandler(async(req, res)=>{
  res.render('admin')
});

//get all user
//route get /api/users/
//access private/admin
const getUsers = asyncHandler(async(req, res)=>{
  try{
    //find all users in db
    const users = await User.find({}).lean();
    res.render('user', {users})
  }catch(error){
    res.status(400).json({message: error.message});
  }
});

//delete users
//route DELETE /api/users/:id
//access private/admin
const deleteUSer = asyncHandler(async(req, res)=>{
  try{
    //find user in db
    const user = await User.findById(req.params.id);
    //if user exists, delete user from db
    if(user){
      //if user is admin, throw error message
      if(user.isAdmin){
        res.status(400);
        throw new Error("Can't delete admin user");
      }
      //else delete user from db
      await user.deleteOne();
      res.json({message: "User deleted successfully"});
    }
  }catch(error){
    res.status(400).json({message: error.message});
  }
});



export { 
    // registerUser, 
    // loginUser, 
    // logoutUser,
    updateUserProfile, 
    deleteUserProfile, 
    changeUserPassword,
    getLikedMovie,
    addLikedMovie, 
    deleteLikedMovie,
    getAdminpage,
    getUsers,
    deleteUSer,

  };

