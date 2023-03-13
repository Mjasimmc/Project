const express = require('express');
const path = require('path');
const router = express();

router.set('views',path.join(__dirname,'../views/working'))


const work = require('../controllers/work');

router.get('/',work.load_phone)
router.get('/otp',work.load_otp)

router.post('/phone',work.postNumber)
router.post('/otp',work.verifyOtp)




module.exports = router;