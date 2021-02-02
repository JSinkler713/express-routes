const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')


// MiddleWare
// this will help us use our layout file
app.use(expressLayouts)
app.use(express.urlencoded({extended: false}));

// for views use .ejs files
app.set('view engine', 'ejs')

// ROUTES
app.get('/', (req, res)=> {
    res.send('Hi there')
})

// Index View
// this url: localhost:8000/dinosaurs
app.get('/dinosaurs', (req, res)=> {
    let dinos = fs.readFileSync('./dinosaurs.json')
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    console.log(req.query.nameFilter)
    let nameToFilterBy = req.query.nameFilter
    // array method filter
    console.log(nameToFilterBy)
    
    // if there is no submit of the form
    // this will be undefined, and we will returnb all dinos
    if (nameToFilterBy) {
        const newFilteredArray = dinos.filter((dinosaurObj) => {
            if (dinosaurObj.name.toLowerCase() === nameToFilterBy.toLowerCase()) {
                return true
            }
        })
        dinos = newFilteredArray
    }
    // console.log(dinos)
    // in our views folder render this page
    res.render('dinosaurs/index', {dinos: dinos} )
})

// NEW View
// Most specific to least specific url path
app.get('/dinosaurs/new', (req, res)=> {
    res.render('dinosaurs/new')
  })

// SHOW View
app.get('/dinosaurs/:index', (req, res)=> {
    let dinos = fs.readFileSync('./dinosaurs.json')
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    // get the dino that's asked for
    // req.params.index
    const dino = dinos[req.params.index]
    res.render('dinosaurs/show', { dino })
})



// POST route, doesn't have a view
app.post('/dinosaurs', (req, res)=> {
    let dinos = fs.readFileSync('./dinosaurs.json')
    // take our data and put it in a more readable format
    dinos = JSON.parse(dinos)
    // construct a new dino with our req.body values
    const newDino = {
        name: req.body.name,
        type: req.body.type
    }
    // updates dinos with new dino
    dinos.push(newDino)
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinos))

    let lastIndex  = dinos.length -1
    // get a request to /dinosaurs
    res.redirect(`/dinosaurs/${lastIndex}`)
    // this is coming from our form submit
    // we are going to look at the req.body
    // console.log(req.body)
})


const PORT = process.env.PORT || 8000
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})