import express from 'express'
import {
    // loginUser, 
    // registerUser, 
    // logoutUser,
    updateUserProfile, 
    deleteUserProfile, 
    changeUserPassword, 
    deleteLikedMovie, 
    addLikedMovie, 
    getLikedMovie,
    getAdminpage, 
    getUsers, 
    deleteUSer,

    } from '../Controllers/UserController.js';

import { protect, admin } from '../middlewares/Auth.js';

const router = express.Router();

//********** PUBLIC ROUTES **********
// router.post('/', registerUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser)

//********** PRIVATE ROUTES **********
router.put("/", protect, updateUserProfile);
router.delete("/", protect, deleteUserProfile);
router.put("/password", protect, changeUserPassword);
router.get('/favorites', protect, getLikedMovie);
router.post('/favorites', protect, addLikedMovie);
router.delete("/favorites", protect, deleteLikedMovie)

//********** ADMIN ROUTES **********
router.get('/admin', protect, admin, getAdminpage);
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUSer);
export default router;