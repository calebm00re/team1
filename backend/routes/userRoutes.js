const { application } = require('express');
const express = require('express');
const users = require('../models/users.js');


/**
 * https://expressjs.com/en/guide/routing.html#express-router
 *
 * A router is a special Express object that can be used to define how to route and manage
 * requests. We configure a router here to handle a few routes specific to students
 */
const router = express.Router();

//get user by id
router.get('/get_info/:id', async(req, res, next) => {
    try{
        const id = req.params.id;
        console.log("Id is: " + id);
        const result = await users.getUserById(id);
        //console.log("Result is: " + result.json);
        if(result.length > 0) {
            res.status(200).json(result);
        } else{
            res.status(404).json({
                message: "User not found"
            });
        }
    }catch(err){
        console.error('Failed to get user info:', err);
        res.status(500).json({ message: err.toString() });
    }
    next();
});

router.post('/register', async (req, res, next) => {
    try {
        const body = req.body;
        console.log(body);
    //    const result = await req.models.user.createNewUser(body.email, body.password);
       // const result = await req.models.createNewUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password
      //calls the createNewUser function in the users.js file of the models folder and return the result
        const result = await users.createNewUser(body.firstName, body.lastName, body.email, body.password);
        console.log("Result of createNewUser: ", result);
        if(result.error === "Invalid email"){
            console.log("Invalid email");
            res.status(400).json({message: "Invalid email"});
        } else if(result.error === "User already exists"){
            console.log("User already exists");
            res.status(400).json({message: "User already exists"});
        } else {
            console.log("User created");
            res.status(201).json(result);
        }

    } catch (err) {
        console.error('Failed to create new user:', err);
        res.status(500).json({ message: err.toString() });
    }

    next();
})

module.exports = router;