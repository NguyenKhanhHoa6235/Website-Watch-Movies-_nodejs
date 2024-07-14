import express from 'express'
import { getMoviesClient, registerUser, loginUser, logoutUser, loginUserPage, registerUserPage } from '../Controllers/indexController.js';

const router = express.Router();

router.get('/', getMoviesClient);
router.get('/login', loginUserPage)
router.get('/register', registerUserPage)
router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser)

export default router;