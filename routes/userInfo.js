const express = require('express');
const router = express.Router();

router.post('/',(req,res =>{


    res.send('data received');
}))

module.exports = router;
