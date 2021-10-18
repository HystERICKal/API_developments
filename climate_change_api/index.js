//Write code to create server here
//Install cheerio package to pick out html elements on a webpage
//Install express Js. Which is a backend framework for node js
//Install axios. Which is used to get, post, put and delete data
//GO to scripts in package .json and change it to nodemon

//Define the port you want to open the server on
const PORT = 8000

//Initialise express
const express = require('express')

//Use axios
const axios = require('axios')

//Use cheerio
const cheerio = require('cheerio')
const { response } = require('express')

//calls express and put it in app variable
const app = express()

//Array of newspapers
const newspapers = [
    {
        name: 'thetimes',
        address: "https://www.thetimes.co.uk/environment/climate-change",
        base: ''

    },

    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: ''
    },

    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        //base is added cause the telegraph url comes back without the first part
        base: 'https://www.telegraph.co.uk'
    }
]


const articles = []

//LOOP
newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    //Once the above url returns a promise, then do the actions below
        .then(response => {
            //save the response as html
            const html = response.data
            // console.log(html)
            const $ = cheerio.load(html)

            $('a:contains("climate")', html).each(function () {
                 //Grab title of article
                const title =  $(this).text()
                 //Grab url of article
                const url = $(this).attr('href')

                //Push title and url into an array and add source
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })


        }).catch((err) => console.log)
})

//ROUTING
app.get('/', (req,res) => {
    res.json('Welcome to my Climate Change News API')
})



app.get('/news', (req,res) => {
    res.json(articles)
})


//Get news from specific newspaper (thetimes, guardian, telegraph)
app.get('/news/:newspaperId', async (req,res) =>{
    // console.log(req)
    //newspaperId can be viewd in the console log under params
    // console.log(req.params.newspaperId)

    const newspaperId  = req.params.newspaperId

    //return the object of the specific newspaper
    const newspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)

    //get the url of the specific newspaper
    const newspaperAddress = newspaper[0].address

    //get the base (if any of the specific newspaper url)
    const newspaperBase = newspapers[0].base

    // console.log(newspaper)
    // console.log(newspaperAddress)

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            const specificNewspaperArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                specificNewspaperArticles.push({
                    title,
                    url: newspaperBase + url
                    
                })
            })

            res.json(specificNewspaperArticles)
        })

})


//Use a callback ()=> to see if server is running
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))


//TUTORIAL FROM
//https://www.youtube.com/watch?v=GK4Pl-GmPHk&ab_channel=CodewithAniaKub%C3%B3w




