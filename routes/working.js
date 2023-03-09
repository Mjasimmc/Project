const express = require('express');
const path = require('path');
const router = express();

router.set('views',path.join(__dirname,'../views/working'))


const userController = require('../controllers/user')
const sessioncheck = require('../controllers/userSession')

const work = require('../controllers/work');

router.get('/',work.load_phone)
router.post('/',work.load_otp)




module.exports = router;