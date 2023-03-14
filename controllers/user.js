const userModify = require('../models/user')
const productView = require('../models/product')
const orderPlace = require('../models/orders')
const categorySearch = require('../models/catogory')
const bcrypt = require('bcrypt');
const accountSid = 'ACc70528d5f66cd5624544f806314b2fba';
const authToken = 'a4481afde430d52d964827509ee0407b';
const client = require('twilio')(accountSid, authToken);
const serviceSid = 'MG1fef30fecfb4a5ac567e1daf55baa7dd';
const sendOTP = (toNumber, otp) => {
    client.messages.create({
        to: toNumber,
        messagingServiceSid: serviceSid,
        body: `Your Otp Is ${otp}`
    }).then(message => console.log(message.sid))
        .catch(error => console.log(error));
}
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(err.message)
        res.redirect('/')
    }
}
const load_landing = async (req, res, next) => {
    try {
        const category = await categorySearch.find({});
        const products = await productView.find({ delete: 0 })
        console.log(products)
        res.render('landing', { products, category })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const loadPhoneNumber = async (req, res, next) => {
    try {
        alertMessage = req.session.loginmessage
        req.session.loginmessage = ""
        res.render('phoneNumber', { alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const postNumber = async (req, res, next) => {
    try {
        const sendMobile = "+91" + req.body.mobile
        req.session.mobile = sendMobile
        const otpSend = Math.floor((Math.random() * 1000000) + 1)
        console.log(otpSend)
        req.session.sendOtp = otpSend
        sendOTP(sendMobile, otpSend)
        res.render('otpChecking')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const verifyOtp = async (req, res, next) => {
    try {
        const otp = req.session.sendOtp
        const userOtp = req.body.post
        if (otp == userOtp) {
            res.redirect('/signUp')
        } else {
            res.redirect('/register')
        }
    } catch (error) {
        console.log(error.message)
        next(error)

    }
}
const load_SignUp = async (req, res, next) => {
    try {
        mobile = req.session.mobile
        let alertMessage = req.session.signupmessage
        req.session.signupmessage = ""
        res.render('signup', { alertMessage, mobile })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const load_SignIn = async (req, res, next) => {
    try {

        let alertMessage = req.session.loginmessage
        req.session.loginmessage = ""
        res.render('signin', { alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const post_SignIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        let userdata = await userModify.findOne({ email: email });
        console.log(userdata)
        if (userdata) {
            const pass = await bcrypt.compare(password, userdata.password)
            if (pass) {
                req.session.login = userdata
                console.log("logged")
                res.redirect('/home');
            } else {
                req.session.loginmessage = "incorrect password"
                console.log("not logged")
                res.redirect('/login')
            }
        } else {
            req.session.loginmessage = "user not found"
            res.redirect('/login')

        };
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const post_SignUp = async (req, res, next) => {
    try {

        const { mobile, name, email } = req.body

        let password = await securePassword(req.body.password)
        const userdata = await userModify.findOne({ email: email })
        console.log(userdata)

        const userinsert = new userModify({
            name: name,
            email: email,
            mobile: mobile,
            password: password
        })



        if (userdata != null) {
            req.session.signupmessage = "you already have an account"
            res.redirect('/register')
        } else {
            const result = await userinsert.save()
            if (result) {

                req.session.login = result
                res.redirect('/home')
                console.log(result)
            } else {
                req.session.signupmessage = "err occured on saving"
                res.redirect('/register')
            }
        }
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const load_Home = async (req, res, next) => {
    try {
        console.log(req.session)
        const user = req.session.login
        const category = await categorySearch.find({});
        var products = await productView.find({ delete: 0 })
        res.render('home', { products, user, category })


    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const logout = async (req, res, next) => {
    try {

        req.session.login = false;
        res.redirect('/')
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const l_browse_Product = async (req, res, next) => {
    try {
        hhgfrd
        const prid = req.params.id
        const prdetails = await productView.findOne({ _id: prid });
        const category = prdetails.category
        console.log(category)
        const products = await productView.find({ delete: 0, category: category })
        res.render('before-pdt-view', { prdetails, products })

    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const h_browse_product = async (req, res, next) => {
    try {
        const prid = req.params.id
        const user = req.session.login
        const prdetails = await productView.findOne({ _id: prid })
        const category = prdetails.category
        const products = await productView.find({ delete: 0, category: category }).limit(4)
        res.render('after-pdt-views', { prdetails, user, products })

    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const load_profile = async (req, res, next) => {
    try {
        const user = req.session.login
        const userdata = req.session.login
        res.render('profile', { userdata, user })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const add_address = async (req, res, next) => {
    try {
        let alertMessage = req.session.addmessage
        req.session.addmessage = ""
        const user = req.session.login
        res.render('add-address', { user, alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const edit_user = async (req, res, next) => {
    try {
        req.session.cart = false
        const userdata = req.session.login
        const user = req.session.login
        res.render('edit-profile', { user, userdata })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const insert_address = async (req, res, next) => {
    try {
        const id = req.session.login
        const { house, city, district, state, post } = req.body
        const userdata = req.session.login
        if (userdata.address != [] || userdata.address != null) {
            const datatoinsert = {
                house: house,
                post: post,
                city: city,
                state: state,
                district: district
            }
            await userModify.findOneAndUpdate({ _id: id }, {
                $push: {
                    address: [datatoinsert]
                }
            }, { new: true }).then(() => req.session.addmessage = 'address added succfuly');
        } else {
            const datatoinsert = {
                house,
                post,
                city,
                state,
                district
            }
            const address = userModify.findOneAndUpdate({ _id: id }, {
                $push: {
                    address: [datatoinsert]
                }
            }, { new: true }).then(() => req.session.addmessage = 'address added succfuly');
        }


        res.redirect('/address-list')
    } catch (err) {
        console.log(err.message);
        next(err)
    }
}
const load_address = async (req, res, next) => {
    try {
        alertMessage = req.session.addmessage
        req.session.addmessage = ""
        const user = req.session.login
        const userdata = await userModify.findOne({ _id: user })
        res.render('list-address', { userdata, user, alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
const delete_address = async (req, res, next) => {
    try {
        const addr_id = req.params.id
        id = req.session.login._id
        const result = await userModify.findByIdAndUpdate({ _id: id }, {
            $pull: {
                address: { _id: addr_id }
            }
        }).then(() => req.session.addmessage = 'address removed')
        res.redirect('/address-list')

    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
const update_profile = async (req, res, next) => {
    try {
        const userid = req.session.login._id
        const { name, email, mobile } = req.body
        await userModify.findOneAndUpdate({ _id: userid }, {
            $set: {
                name: name,
                email: email,
                mobile: mobile
            }
        })
        res.redirect(`/profile/${userid}`)
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
const view_cart = async (req, res, next) => {
    try {
        req.session.cart = true
        const user = req.session.login
        const cartdata = await userModify.findOne({ _id: user }).populate("cart.product")
        res.render('after-cart', { user, cartdata })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const add_to_cart = async (req, res, next) => {
    try {
        const { pdt_id } = req.body
        const id = req.session.login._id


        const prdtcheck = async (id) => await userModify.findOne({ "cart.product": id })
        const check = await prdtcheck(pdt_id)
        if (check == [] || check == null) {
            const quantity = 1
            const datatoinsert = {
                product: pdt_id,
                quantity: quantity,
            }
            await userModify.findOneAndUpdate({ _id: id }, {
                $push: {
                    cart: [datatoinsert]
                }
            }, { upsert: true })
                .then(() => res.json(
                    {
                        status: true,
                        increment: true
                    }))
                .catch(() => console.log('not inserted'))
        } else {
            await userModify.findOneAndUpdate(
                { _id: id, "cart.product": pdt_id },
                { $inc: { "cart.$.quantity": 1 } }
            ).then(() => {
                res.json(
                    {
                        status: true,
                        increment: false
                    })
            })
        }
    } catch (err) {
        console.log(err.message);
        next(err)
    }
}
const remove_cart = async (req, res, next) => {
    try {
        const { pdt_id } = req.body
        console.log(pdt_id)
        const id = req.session.login._id
        await userModify.findOneAndUpdate(
            { _id: id, "cart.product": pdt_id },
            { $inc: { "cart.$.quantity": -1 } }
        ).catch((err) => console.log(err))
        await userModify.findOneAndUpdate(
            { _id: id, "cart.product": pdt_id },
            { $pull: { cart: { product: pdt_id, quantity: 0 } } }
        ).catch((err) => console.log(err))
        res.json({ status: true })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const view_shop_after = async (req, res, next) => {
    try {
        const category = await categorySearch.find({});
        const user = req.session.login
        const { products } = req.session
        res.render('shop-after', { products, user, category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const view_shop_before = async (req, res, next) => {
    try {
        const category = await categorySearch.find({});
        const { products } = req.session
        console.log(category)
        res.render('shop-before', { products, category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const load_checkout = async (req, res, next) => {
    try {
        const user = req.session.login
        const users = await userModify.findOne({ _id: user }).populate("cart.product")
        res.render('after-checkout', { user, users })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const post_order = async (req, res, next) => {
    try {
        const { name, house, post, city, state, district, totalprice, mobile } = req.body
        const user = req.session.login
        const users = req.session.login._id
        const payement = req.body.payement
        const userdata = await userModify.findOne({ _id: user })
        let products = userdata.cart
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        const currentDateAndTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
        const newOrder = new orderPlace({
            user: users,
            product: products,
            orderdate: currentDateAndTime,
            payement: payement,
            orderstatus: "order received",
            orderaddress: {
                name: name,
                mobile: mobile,
                house: house,
                post: post,
                city: city,
                state: state,
                district: district
            },
            totalprice: totalprice
        })
        console.log(newOrder)
        const result = await newOrder.save()
        if (result) {
            const usercart = await userModify.findOneAndUpdate({ _id: user }, { $unset: { cart: 1 } }, { new: true })
            console.log(result)
            res.render('order-placed', { user })
        } else {
            res.redirect('/checkout')
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}


module.exports = {

    load_SignUp,
    loadPhoneNumber,
    postNumber,
    verifyOtp,

    post_order,
    load_checkout,


    view_shop_after,
    view_shop_before,

    view_cart,
    add_to_cart,
    remove_cart,

    load_landing,
    load_SignIn,

    load_profile,
    load_Home,

    edit_user,
    update_profile,

    insert_address,
    delete_address,
    add_address,
    load_address,

    logout,

    post_SignIn,
    post_SignUp,

    l_browse_Product,
    h_browse_product
}