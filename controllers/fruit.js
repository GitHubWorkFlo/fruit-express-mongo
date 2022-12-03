const express = require('express') // bring this in so we can make our router
const Fruit = require('../models/fruit')


/////
// Create Router  variable to attach rooutes
/////

const router = express.Router() // router will have all routes attached to it


//////////////////////////////////////////////
//////// Actual Routes
///////////////////////////////////////////////


router.use((req,res, next) => {
    console.log(req.session)
    if(req.session.loggedIn){
        next();
    }else {
        res.redirect('/user/login')
    }
})

router.get('/', (req, res) => {
    console.log(req.session)
    // Get all fruits from mongo and send them back
    // Fruit.find({})
    Fruit.find({})
    .then((fruits) => {
        // res.json(fruits)
        res.render('fruits/index.ejs', { fruits, user: req.session.username })
    })
    .catch(err => console.log(err))

})

router.get('/new', (req, res) => {
    res.render('fruits/new.ejs')
})

router.post('/', (req, res) => {
   //this is the current req.body 
// {
//     name: 'pear',
//     color: 'peach',
//     readyToEat: 'on'
// }

    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
     //this is the  req.body after this line
    // {
//     name: 'pear',
//     color: 'peach',
//     readyToEat: true
// }

    
    req.body.username = req.session.username;
    //this is the  req.body after this line
        // {
//     name: 'pear',
//     color: 'peach',
//     readyToEat: true,
//     username: <req.session.username> 'user1'
// }


    Fruit.create(req.body, (err, createdFruit) =>{
        console.log('created' , createdFruit, err)
        res.redirect('/fruits')
    })
} )

router.get('/:id/edit', (req, res) => {

    const id = req.params.id
    // Find the fruit and send it to the edit.ejs  to prepopulate the form
    Fruit.findById(id, (err, foundFruit) => {
        // res.json(foundFruit)
        res.render('fruits/edit.ejs', { fruit: foundFruit })
    })
})

router.put('/:id', (req, res) => {
    
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false

    Fruit.findByIdAndUpdate(req.params.id, req.body, {new: true},(err, updatedFruit) => {
        console.log(updatedFruit)

        res.redirect(`/fruits/${req.params.id}`)
        
    })
})

router.get('/:id', (req, res)=>{

    // Go and get fruit from the database
    Fruit.findById(req.params.id)
    .then((fruit)=> {
        res.render('fruits/show.ejs', {fruit})
    })
})

router.delete('/:id', async (req, res) => {

    // Method 1
    // Fruit.findByIdAndDelete(req.params.id, (err, deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })

    // // Method 2
    // Fruit.findByIdAndDelete(req.params.id)
    // .then((deletedFruit) => {
    //     console.log(err, deletedFruit)
    //     res.redirect('/fruits')
    // })
    // .catch(err => console.log(err))


    // Method 3 async await

    const deletedFruit = await Fruit.findByIdAndDelete(req.params.id)

    if(deletedFruit){
        res.redirect('/fruits/')
    }
})

/////////////
///// export this router to use in other files
//////////////
module.exports = router
