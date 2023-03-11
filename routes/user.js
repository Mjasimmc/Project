const express = require('express');
const path = require('path');
const router = express();

router.set('views',path.join(__dirname,'../views/user'))

const userController = require('../controllers/user')
const sessioncheck = require('../middleware/userSession')
const search = require('../middleware/search')

// welcoming pages
router.get('/',sessioncheck.result,userController.load_landing)
router.get('/product/:id',sessioncheck.result,userController.l_browse_Product)
router.get('/login',sessioncheck.result,userController.load_SignIn)
router.get('/register',sessioncheck.result,userController.load_SignUp)
router.get('/lshop',sessioncheck.result,search.search_result,userController.view_shop_before)



// adding welcomers and resigning
router.post('/register',sessioncheck.result,userController.post_SignUp)
router.post('/login',sessioncheck.result,userController.post_SignIn)
router.get('/logout',userController.logout)


// user activities
router.get('/home',sessioncheck.homeallow,userController.load_Home)
router.get('/profile',sessioncheck.homeallow,userController.load_profile)
router.get('/product-home/:id',sessioncheck.homeallow,userController.h_browse_product)
router.get('/edit-profile/:id',sessioncheck.homeallow,userController.edit_user)
router.get('/profile/:id',sessioncheck.homeallow,userController.load_profile)
router.post('/profile',sessioncheck.homeallow,userController.update_profile)




// address
router.get('/add-address',sessioncheck.homeallow,userController.add_address)
router.post('/add-address',sessioncheck.homeallow,userController.insert_address)
router.get('/address-list',sessioncheck.homeallow,userController.load_address)
router.get('/delete-address/:id',sessioncheck.homeallow,userController.delete_address)

// cart
router.get('/view-cart',sessioncheck.homeallow,userController.view_cart)
router.post('/add-cart',sessioncheck.homeallow,userController.add_to_cart)
router.post('/remove-cart',sessioncheck.homeallow,userController.remove_cart)

// shop
router.get('/shop',sessioncheck.homeallow,search.search_result,userController.view_shop_after)

// checkout
router.get('/checkout',sessioncheck.homeallow,userController.load_checkout)
router.get('/payement',sessioncheck.homeallow,userController.load_payement)


module.exports = router;
