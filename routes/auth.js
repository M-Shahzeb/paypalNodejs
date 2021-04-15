const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth');

router.post('login', (req,res,next)=>{
    res.render('login',{
        name:'MyName'
    });

});




module.exports = router;
