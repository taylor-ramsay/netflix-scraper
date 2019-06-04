# Netflix Scraper + IMDB Ratings

Pulls in data from Netflix and OmDB API. Uses IMDBs rating system to find what's rated best on Netflix.

[Get API Key](http://www.omdbapi.com/apikey.aspx)

Install dependencies: `npm install` 

Edit: `creds.js`

Run script with: `node index.js`


Example : 
```JSON
{
    "_id" : "5cf6cd095ff67d6603436918",
    "netflixTitle" : "Peppa Pig",
    "netflixImg" : "https://occ-0-55-56.1.nflxso.net/dnm/api/v6/0DW6CdE4gYtYx8iy3aj8gs9WtXE/AAAABTB46yd_oM9TQPFsw_aFLuyIHtwICrsx8MeyUlpSeMTY3tVbwdX2ehFosA6zFfiEB97RgFgc7RNh3X8eqmwGNy_dEvP4FKgW.webp?r=ebe",
    "imdbTitle" : "Peppa Pig",
    "imdbRating" : "6.3",
    "imdbYear" : "2004",
    "imdbId" : "tt0426769",
    "genre" : "series",
    "timeStamp" : "2019-06-04T22:42:57.307Z",
    "__v" : 0
}
```
