const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const fs = require('fs')
const methodOverride = require('method-override');


// for views use .ejs files
app.set('view engine', 'ejs')

// MiddleWare
// this will help us use our layout file
app.use(expressLayouts)
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// ROUTES
app.get('/', (req, res)=> {
    res.send('Hi there')
})

// Index View
// this url: localhost:8000/dinosaurs
app.get('/dinosaurs', (req, res) => {
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

// going to the edit page 😎
app.get('/dinosaurs/edit/:idx', (req, res) => {
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs); 

    let idx = Number(req.params.idx);
    const ourDino = dinosaursArray[idx]; // what datatype is this? (object)

    res.render('dinosaurs/edit', { dino: ourDino, idx });

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

// delete route
app.delete('/dinosaurs/:idx', (req, res) => {
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    // intermediate variable
    let idx = Number(req.params.idx); // what is this datatype? comes in as a string, change to integer
    // remove the dinosaur
    dinosaursArray.splice(idx, 1);
    // save the dinosaurs array into the dinosaurs.json file
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    // redirect back to /dinosaurs route
    res.redirect('/dinosaurs');
});

app.put('/dinosaurs/:idx', (req, res) => {
    // the goal of this route is to udate a dinosaur 
    const dinosaurs = fs.readFileSync('./dinosaurs.json');
    const dinosaursArray = JSON.parse(dinosaurs);
    // set up the index
    let idx = Number(req.params.idx);
    const ourDino = dinosaursArray[idx]; // what datatype is this? object
    // update the dino
    ourDino.name = req.body.name;
    ourDino.type = req.body.type;
    // rewrite file dinosaurs.json
    fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinosaursArray));
    // redirect them back to another page (/dinosaurs)
    res.redirect('/dinosaurs');
});


const PORT = process.env.PORT || 8000
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})