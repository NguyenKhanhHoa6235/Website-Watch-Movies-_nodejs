import {MoviesData} from '../Data/MoviesData.js'
import asyncHandler from 'express-async-handler'
import Movie from "../Models/MoviesModel.js"

//********** PUBLIC CONTROLLER **********
//import movies
//route POST /api/movies/import
//access public
const importMovies = asyncHandler(async(req, res)=>{
    //first we make sure our movies table is empty by delete all documents
    await Movie.deleteMany({});
    //then we insert all movies from MoviesData
    const movies = await Movie.insertMany(MoviesData)
    res.status(201).json(movies);
});

//get all movies
//route GET /api/movies
//access public
const getMovies = asyncHandler(async(req, res)=>{
    try{
        const movies = await Movie.find({}).lean();
        res.render('movie_list_client', {movies});
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//get movies by id
//route GET /api/movies/:id
//access public
const getMovieById = asyncHandler(async(req, res)=>{
    try{
        //find movie by id in db
        const movies = await Movie.findById(req.params.id).lean();
        //if the movie if found, send it to the client
        if(movies){
            // res.json(movies);
            res.render('moviedetail', {movies});
        }
        //if the movie if not found, send error
        else{
            res.status(404);
            throw new Error("Movie not found");
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//get all movies admin
//route GET /api/movies
//access public
const getMoviesAdmin = asyncHandler(async(req, res)=>{
    try{
        const movies = await Movie.find({}).lean();
        res.render('movie_list', {movies});
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//get movies by id
//route GET /api/movies/:id
//access public
const getMovieByIdAdmin = asyncHandler(async(req, res)=>{
    try{
        //find movie by id in db
        const movies = await Movie.findById(req.params.id).lean();
        //if the movie if found, send it to the client
        if(movies){
            // res.json(movies);
            res.render('movies', {movies});
        }
        //if the movie if not found, send error
        else{
            res.status(404);
            throw new Error("Movie not found");
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//get movies by id
//route GET /api/movies/watch/:id
//access public
const getWatchMovie = asyncHandler(async(req, res)=>{
    try{
        //find movie by id in db
        const movies = await Movie.findById(req.params.id).lean();
        //if the movie if found, send it to the client
        if(movies){
            // res.json(movies);
            res.render('watch', {movies});
        }
        //if the movie if not found, send error
        else{
            res.status(404);
            throw new Error("Movie not found");
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});



//get top rated movies
//route GET /api/movies/rate/top
//access public
const getTopRatedMovies = asyncHandler(async(req, res)=>{
    try{
        //find top rated movies
        const movies = await Movie.find({}).sort({rate: -1});
        //send top rated movies to the client
        res.json(movies);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//get random movies
//route GET /api/movies/random/all
//access public
const getRandomMovies = asyncHandler(async(req, res)=>{
    try{
        //find random movies
        const movies = await Movie.aggregate([{$sample: {size: 8} }]);
        //send random movies to the client
        res.json(movies);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//********** PRIVATE CONTROLLER **********

//create movie review
//route POST /api/movies/:id/reviews
//access private
const createMoviesReview = asyncHandler(async(req, res)=>{
    const {rating, comment} = req.body;
    try{
        //find movie by id in db
        const movie = await Movie.findById(req.params.id);
        
        if(movie){
            //check if the user already reviewed this movie
            const alreadyReviewed = movie.reviews.find(
                (r) => r.userId.toString() === req.user._id.toString()
            );
            //if the user already reviewed this movie, send 400 err
            if(alreadyReviewed){
                res.status(400);
                throw new Error("Your already reviewed this movie");
            }
            //else create a new review
            const review = {
                userName: req.user.username,
                userId: req.user._id,
                userImage: req.user.profilePicture,
                rating: Number(rating),
                comment,
            }
            //push the new review to the reviews array
            movie.reviews.push(review);
            //increment the number of reviews
            movie.numberOfReviews = movie.reviews.length;

            //calculate the new rate
            movie.rate = movie.reviews.reduceRight((acc, item) => item.rating + acc, 0) / movie.reviews.length; 

            //save the movie in db
            await movie.save();
            //send the new movie to the client
            res.render('watch/' +userId, {movie});    
        }
        else{
            res.status(404);
            throw new Error("Movie not found")
        }
        res.json(movie);
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//********** ADMIN CONTROLLER **********

//update movie
//route PUT /api/movies/:id
//access private/admin
const updateMovie = asyncHandler(async(req, res)=>{
    try{
        //get data from request body
        const {name, desc, tilteImage, image, rate, numberOfReviews, category, time, language, year, video, casts }= req.body;

        //find movie by id in db
        const movie = await Movie.findById(req.params.id);
        
        if(movie){
            //update movie data
            movie.name = name || movie.name;
            movie.desc = desc || movie.desc;
            movie.tilteImage = tilteImage || movie.tilteImage;
            movie.image = image || movie.image;
            movie.rate = rate || movie.rate;
            movie.numberOfReviews = numberOfReviews || movie.numberOfReviews;
            movie.category = category || movie.category;
            movie.time = time || movie.time;
            movie.language = language || movie.language;
            movie.year = year || movie.year;
            movie.video = video || movie.video;
            movie.casts = casts || movie.casts;

            //save the movie in db

            const updateMovie = await movie.save();
            //send the updated movie to the client
            res.status(201).json(updateMovie);
        }else{
            res.status(404);
            throw new Error("Movie not found")
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//delete a movie by id
//route DELETE /api/movies/:id
//access private/admin
const deleteMovie = asyncHandler(async(req, res)=>{
    try{
        //find movie by id in db
        const movie = await Movie.findById(req.params.id);
        //if the movie is found, delete it
        if(movie){
            await movie.deleteOne();
            res.json({message: "Movie removed"})
        }
        //if the movie is not found, 404 error
        else{
            res.status(404);
            throw new Error("Movie not found");
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//delete all movie
//route DELETE /api/movies
//access private/admin
const deleteAllMovie = asyncHandler(async(req, res)=>{
    try{
        //delete all movies
        await Movie.deleteMany({});
        res.json({message: "All movies removed"})
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//create a movie
//route GET /api/movies/new_movie
//access private/admin
const getAddMoviePage = asyncHandler(async(req, res)=>{
    try{
        //delete all movies
        res.render('new_movie')
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

//create a movie
//route POST /api/movies/
//access private/admin
const createMovie = asyncHandler(async(req, res)=>{
    try{
        //get data from request body
        const {name, desc, tilteImage, image, rate, category, time, language, year, video}= req.body;

        //create a new movie
        const movie = new Movie({
            name,
            desc,
            image,
            tilteImage,
            rate,
            category,
            time,
            language,
            year,
            video,
            userId: req.user._id,
        })
        //save the movie in db
        if(movie){
            const createdMovie = await movie.save();
            res.render('/movie_list',{createMovie})
        }else{
            res.status(400);
            throw new Error("Invalid movie data");
        }
    }catch(error){
        res.status(400).json({message: error.message});
    }
});

export {
    importMovies,
    getMovies,
    getMovieById,
    getTopRatedMovies,
    getRandomMovies,
    createMoviesReview,
    updateMovie,
    deleteMovie,
    deleteAllMovie,
    createMovie,
    getWatchMovie,
    getMoviesAdmin,
    getMovieByIdAdmin,
    getAddMoviePage,
};