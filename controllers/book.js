const axios = require('axios')
require('dotenv').config()

class BookController{
    static book(req, res, next){
        let rating
        let title
        axios({
            url: `https://www.goodreads.com/book/review_counts.json?isbns=9781430259442&key=${process.env.SECRETKEY}`,
            method: 'GET'
        })
        .then(response=>{
            rating = response.data.books[0].average_rating
            return axios({
                url: `https://openlibrary.org/works/OL19547553W.json`,
                method: 'GET'
            })
        })
        .then(response=>{
            title = response.data.title
            return axios({
                url: `https://api.itbook.store/1.0/books/9781430259442`,
                method: 'GET'
            })
        })
        .then(response=>{
            return ({
                title: title,
                authors: response.data.authors,
                isbn: response.data.isbn13,
                desc: response.data.desc,
                image: response.data.image, 
                rating: rating
            })
        })
        .then(response=>{
            res.status(200).json(response)
        })
        .catch(err=>{
            next(err)
        })
    }
}

module.exports = BookController