////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

/////////////////////////////////////////
// Create Route
/////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////
// Routes
/////////////////////////////////////////

// The Signup Routes (Get => form, post => submit form)
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});

// router.post("/signup", (req, res) => {
//     res.send("signup")
// })

router.post("/signup", async (req, res) => {
    console.log(req.body, req.session)
    req.body.password = await bcrypt.hash(
        req.body.password,
        await bcrypt.genSalt(10)
    );

    User.create(req.body, (err, user) => {
        res.redirect("/user/login");
    });
});

// The login Routes (Get => form, post => submit form)
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    //can also say req.body.username where we see username
    //same w/ password. we can say req.body.password

    User.findOne({ username }, (err, user) => {
        if (!user) {
            res.send("user doesnt exist");
        } else {
            const result = bcrypt.compareSync(password, user.password);
            if (result) {
                req.session.username = username;
                req.session.loggedIn = true;
                res.redirect("/fruits");
            } else {

                res.render("user/login.ejs", {data: 'wrong pass'});
                // res.send("wrong password");
            }
        }
    });
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router;
