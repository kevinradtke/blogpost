const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()
const uuidv4 = require('uuid/v4');

app.use(jsonParser)

let postsArray = [
    {
        id: uuidv4(),
        title: "First Post",
        content: "Content of the post.",
        author: "Kevin Radtke",
        publishDate: new Date("March 23 2019 10:00")
    },
    {
        id: uuidv4(),
        title: "Web Class Laboratory",
        content: "New laboratory posted on the website.",
        author: "Alfredo Salazar",
        publishDate: new Date("January 31 2015 12:30")
    },
    {
        id: uuidv4(),
        title: "Last Post",
        content: "Third post to test this app.",
        author: "Kevin Radtke",
        publishDate: new Date("March 23 2019 15:30")
    }
]

app.get('/blog-posts', (req,res) => {
    res.status(200).json({
        message: "Successfully sent all blog posts.",
        status: 200,
        posts: postsArray
    })
})

app.get('/blog-posts/:author*?', (req,res) => {

    //406 IF AUTHOR MISSING IN PATH VARIABLES
    if (!(req.params.author)) {
        res.status(406).json({
            message: `Missing field author in params.`,
            status: 406
        })
    }

    let author = req.params.author

    var match = []
    postsArray.forEach(function(item,index) {
        if (item.author == author) {
            match.push(item)
        }
    })
    if (match === undefined || match.length == 0) {
        res.status(404).json({
            message: `Author '${author}' not found`,
            status: 404
        })
    }
    else {
        res.status(200).json({
            message: `Successfully found blog posts for author ${author}`,
            posts: match
        })
    }
})

app.post('/blog-posts', (req,res) => {
    let requiredFields = ["title", "content", "author", "publishDate"]
    for (rf of requiredFields) {
        if (!(rf in req.body)) {
            res.status(406).json({
                message: `Missing field '${rf}' in body`,
                status: 406
            })
        }
    }
    let objToAdd = {
        id: uuidv4(),
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate)
    }
    postsArray.push(objToAdd)
    res.status(201).json({
        message: `Successfully added the post.`,
        status: 201,
        postAdded: objToAdd
    })
})

app.delete('/blog-posts/:id*?', (req,res) => {

    //406 IF ID MISSING IN PARAMS
    if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field id in params.`,
            status: 406
        })
    }

    if (!("id" in req.body)) {
        res.status(406).json({
            message: `Missing field id in body.`,
            status: 406
        })
    }

    if (req.params.id != req.body.id) {
        return res.status(409).json({
            message: `ID '${req.body.id}' in body different than ID '${req.params.id}' in params.`,
            status: 409
        }).send("Finish")
    }

    let id = req.params.id
    postsArray.forEach(function(item,index) {
        if (id == item.id) {
            postsArray.splice(index,1)
            return res.status(200).json({
                message: `Successfully deleted post with ID ${item.id}.`,
                status: 200
            })
        }
    })

    res.status(404).json({
        message: `Post with id '${id}' not found in the list`,
        status: 404
    })
})

app.put('/blog-posts/:id*?', (req,res) => {

    //STATUS 406 IF ID MISSING IN PARAMS
    if (!(req.params.id)) {
        res.status(406).json({
            message: `Missing field id in params.`,
            status: 406
        })
    }

    let id = req.params.id

    if (req.body.length == 0) {
        res.status(404).json({
            message: `Empty body.`,
            status: 404
        }).send("Finish")
    }

    postsArray.forEach(item => {
        if (item.id == id) {
            empty = true
            for (let key in req.body) {
                if (key == 'title' || key == 'content' || key == 'author') {
                    item[key] = req.body[key]
                    empty = false
                }
                else if (key == 'publishDate') {
                    item[key] = new Date(req.body[key])
                    empty = false
                }
            }
            if (empty) {
                return res.status(404).json({
                    message: `Empty body.`,
                    status: 404
                }).send("Finish")
            }
            else
                res.status(200).json({
                    message: `Post with id '${id}' successfully updated.`,
                    status: 200
                }).send("Finish")
        }
    })

    res.status(404).json({
        message: `Post with id '${id}' not found in the list`,
        status: 404
    })
})

app.listen(8080, () => {
    console.log(`Your app is running in port 8080`)
})
