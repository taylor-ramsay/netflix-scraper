
const puppeteer = require('puppeteer');
const CREDS = require('./creds');
const axios = require('axios')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nfScraperDB')
const db = mongoose.connection

db.on('open', () => {
    console.log('connected to mongodb!')
});

const FilmRating = require('./models/FilmRating')

async function run() {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    // dom element selectors
    const USERNAME_SELECTOR = '#email';
    const PASSWORD_SELECTOR = '#password';
    const BUTTON_SELECTOR = '#appMountPoint > div > div.login-body > div > div > form:nth-child(2) > button';
    const WHOS_WATCHING_SELECTOR = CREDS.whosWatching;
    const MOVIE_TITLE_SELECTOR = '#title-card-ROW-COL > div > a > div > div > div'
    const MOVIE_IMG_SELECTOR = '#title-card-ROW-COL > div > a > div > img'
    const LIST_LENGTH_SELECTOR_CLASS = 'fallback-text'
    const ROW_LENGTH_SELECTOR_CLASS = 'rowContainer'
    const GRID_VIEW_SELECTOR = '#appMountPoint > div > div > div > div.pinning-header > div > div.sub-header > div:nth-child(2) > div > div > div.aro-genre-details > div > div.aro-grid'

    const genreUrls = {
        actionAndAdverture: 'https://www.netflix.com/browse/genre/1365',
        anime: 'https://www.netflix.com/browse/genre/3063',
        canadian: 'https://www.netflix.com/browse/genre/56181?bc=34399',
        childrenAndFamily: 'https://www.netflix.com/browse/genre/783',
        classics: 'https://www.netflix.com/browse/genre/31574?bc=34399',
        comedies: 'https://www.netflix.com/browse/genre/6548?bc=34399',
        documentaries: 'https://www.netflix.com/browse/genre/2243108',
        dramas: 'https://www.netflix.com/browse/genre/5763?bc=34399',
        faithAndSpirituality: 'https://www.netflix.com/browse/genre/26835',
        horror: 'https://www.netflix.com/browse/genre/8711',
        independent: 'https://www.netflix.com/browse/genre/7077',
        international: 'https://www.netflix.com/browse/genre/78367',
        lgbtq: 'https://www.netflix.com/browse/genre/5977?bc=34399',
        musicAndMusicals: 'https://www.netflix.com/browse/genre/52852?bc=34399',
        romanace: 'https://www.netflix.com/browse/genre/8883?bc=34399',
        sciFi: 'https://www.netflix.com/browse/genre/1492',
        sports: 'https://www.netflix.com/browse/genre/4370',
        standUpComedy: 'https://www.netflix.com/browse/genre/11559',
        summerOfLove: 'https://www.netflix.com/browse/genre/2777752?bc=34399',
        thrillers: 'https://www.netflix.com/browse/genre/8933?bc=34399'
    }

    const omdbApi = `http://www.omdbapi.com/?apikey=${CREDS.omdbKey}`

    await page.goto('https://www.netflix.com/ca/login');

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);

    await page.click(BUTTON_SELECTOR);

    await page.waitForNavigation();

    await page.click(WHOS_WATCHING_SELECTOR);

    await page.waitForNavigation();

    for (genreName in genreUrls) {

        await page.goto(genreUrls[genreName]);

        await page.waitForNavigation({ timeout: 3000 })
            .then(() => { }, () => { })
            .catch((error) => { console.log(error) })

        await page.click(GRID_VIEW_SELECTOR);

        await page.waitForNavigation({ timeout: 3000 })
            .then(() => { }, () => { })
            .catch((error) => { console.log(error) })

        let listLength = await page.evaluate((sel) => {
            return document.getElementsByClassName(sel).length;
        }, LIST_LENGTH_SELECTOR_CLASS);

        let rowLength = await page.evaluate((sel) => {
            return document.getElementsByClassName(sel).length;
        }, ROW_LENGTH_SELECTOR_CLASS);

        for (let i = 0; i <= rowLength; i++) {
            let col = 0
            for (let j = 0; j <= listLength; j++) {
                if (col < 3) {
                    let movieTitleSelector = `#title-card-${i}-${col} > div > a > div > div > div`
                    let movieImgSelector = `#title-card-${i}-${col} > div > a > div > img`
                    let movieName = await page.evaluate((sel) => {
                        return document.querySelector(sel) ? document.querySelector(sel).innerText : null
                    }, movieTitleSelector);
                    let movieImage = await page.evaluate((sel) => {
                        return document.querySelector(sel) ? document.querySelector(sel).src : null
                    }, movieImgSelector);
                    axios.get(omdbApi + '&t=' + encodeURI(movieName))
                        .then((response) => {
                            let rating = FilmRating({
                                netflixTitle: movieName,
                                netflixImg: movieImage,
                                imdbTitle: response.data.Title,
                                imdbRating: response.data.imdbRating,
                                imdbYear: response.data.Year,
                                imdbId: response.data.imdbID,
                                genre: genreName
                            })
                            rating.save()
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    col += 1
                }
                else {
                    break
                }
            }
        }
    }

    browser.close();
}

run();