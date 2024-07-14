import express from 'express'
import { protect, admin } from '../middlewares/Auth.js';
import {getAddMoviePage, getMovieByIdAdmin, getMoviesAdmin, createMovie, createMoviesReview, deleteMovie, getMovieById, getMovies, getRandomMovies, getTopRatedMovies, getWatchMovie, importMovies, updateMovie } from '../Controllers/MoviesController.js';

const router = express.Router();

//********** PUBLIC ROUTES **********
router.post('/import', importMovies);
router.get('/', getMovies);
router.get('/detail/:id', getMovieById);
router.get('/movie_list', getMoviesAdmin);
router.get('/new_movie', getAddMoviePage);
router.get('/admin/:id', getMovieByIdAdmin);
router.get('/watch/:id', getWatchMovie);
router.get('/rated/top', getTopRatedMovies);
router.get('/random/all', getRandomMovies);

//********** PRIVATE ROUTES **********
router.post('/:id/reviews', protect, createMoviesReview);

//********** ADMIN ROUTES **********
router.put('/:id', protect, admin, updateMovie);
router.delete('/:id', protect, admin, deleteMovie);
router.delete('/', protect, admin, deleteMovie);
router.post('/new_movie', protect, admin, createMovie);


export default router;