const mongoose = require('mongoose');
      Schema = mongoose.Schema

const filmRatingSchema = new Schema({
    netflixTitle: {
        type: String,
        unique: true,
    },
    netflixImg: String,
    imdbTitle: String,
    imdbRating: String,
    imdbYear: String,
    imdbId: String,
    timeStamp : { 
        type : Date, 
        default: Date.now
    },
    genre: String
})

const FilmRatingModel = mongoose.model('FilmRating', filmRatingSchema)

module.exports = FilmRatingModel