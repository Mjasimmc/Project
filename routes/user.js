const express = require('express');
const path = require('path');
const router = express();

router.set('views',path.join(__dirname,'../views/user'))

const userController = require('../controllers/user')
const sessioncheck = require('../middleware/userSession')
const search = require('../middleware/search')
const block = require('../middleware/block')

// welcoming pages
router.get('/',sessioncheck.result,userController.load_landing)
router.get('/product/:id',sessioncheck.result,userController.l_browse_Product)
router.get('/login',sessioncheck.result,userController.load_SignIn)



router.get('/register',sessioncheck.result,userController.loadPhoneNumber)
router.post('/verify',sessioncheck.result,userController.postNumber)
router.get('/signUp',sessioncheck.phonecheck,userController.load_SignUp)
router.get('/lshop',sessioncheck.result,search.search_result,userController.view_shop_before)

router.post('/verifyOtp',sessioncheck.result,userController.verifyOtp)

// adding welcomers and resigning
router.post('/register',sessioncheck.result,userController.post_SignUp)
router.post('/login',sessioncheck.result,userController.post_SignIn)
router.get('/logout',userController.logout)


// user activities
router.get('/home',sessioncheck.homeallow,block,userController.load_Home)
router.get('/profile',sessioncheck.homeallow,block,userController.load_profile)
router.get('/product-home/:id',sessioncheck.homeallow,block,userController.h_browse_product)
router.get('/edit-profile/:id',sessioncheck.homeallow,block,userController.edit_user)
router.get('/profile/:id',sessioncheck.homeallow,block,userController.load_profile)
router.post('/profile',sessioncheck.homeallow,block,userController.update_profile)




// address
router.get('/add-address',sessioncheck.homeallow,block,userController.add_address)
router.post('/add-address',sessioncheck.homeallow,block,userController.insert_address)
router.get('/address-list',sessioncheck.homeallow,block,userController.load_address)
router.get('/delete-address/:id',sessioncheck.homeallow,block,userController.delete_address)

// cart
router.get('/view-cart',sessioncheck.homeallow,block,userController.view_cart)
router.post('/add-cart',sessioncheck.homeallow,block,userController.add_to_cart)
router.post('/remove-cart',sessioncheck.homeallow,block,userController.remove_cart)

// shop
router.get('/shop',sessioncheck.homeallow,block,search.search_result,userController.view_shop_after)

// checkout
router.get('/checkout',sessioncheck.homeallow,block,userController.load_checkout)
router.post('/post-order',sessioncheck.homeallow,block,userController.post_order)
router.get('/orderConfirmed',sessioncheck.homeallow,block,userController.load_confirmation)


module.exports = router;
