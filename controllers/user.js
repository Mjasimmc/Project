const userModify = require('../models/user')
const productView = require('../models/product')
const bcrypt = require('bcrypt')


///new.......
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
        req.session.cart = false
        const products = await productView.find({ delete: 0 })
        res.render('landing', { products })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const load_SignIn = async (req, res, next) => {
    try {
        req.session.cart = false
        alertMessage = req.session.loginmessage
        req.session.loginmessage = ""
        res.render('signin', { alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const load_SignUp = async (req, res, next) => {
    try {
        req.session.cart = false
        alertMessage = req.session.signupmessage
        res.render('signup', { alertMessage })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const post_SignIn = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let userdata = await userModify.findOne({ email: email });
        console.log(userdata)
        if (userdata) {
            const pass = await bcrypt.compare(password, userdata.password)
            if (pass) {
                req.session.login = userdata._id
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

        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile
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
                
                req.session.login = result._id
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
        req.session.cart = false
        const user = req.session.login
        const products = await productView.find({ delete: 0 })
        res.render('home', { products, user })
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
        req.session.cart = false
        const user = req.session.login
        const prid = req.params.id
        const prdetails = await productView.findOne({ _id: prid })
        res.render('before-pdt-view', { prdetails, user })

    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const h_browse_product = async (req, res, next) => {
    try {
        req.session.cart = false
        const prid = req.params.id
        const user = req.session.login
        const prdetails = await productView.findOne({ _id: prid })
        res.render('after-pdt-views', { prdetails, user })

    } catch (err) {
        console.log(err.message)
        next(err);
    }
}

const load_profile = async (req, res, next) => {
    try {
        req.session.cart = false
        const user = req.session.login
        const userid = req.params.id
        const userdata = await userModify.findById({ _id: userid })
        const address = userdata.address;
        console.log(address)
        res.render('profile', { userdata, user })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}
const add_address = async (req, res, next) => {
    try {
        alertMessage = ""
        req.session.cart = false
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
        const userid = req.params.id
        const user = await userModify.findById({ _id: userid })
        res.render('edit-profile', { user })
    } catch (err) {
        console.log(err.message)
        next(err);
    }
}

const insert_address = async (req, res, next) => {
    try {
        id = req.session.login
        const { house, city, district, state, post } = req.body
        console.log(house, city, district, state, post)
        const userdata = userModify.findOne({ _id: id })
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
            }, { new: true }).then(() => console.log('address added succfuly'));
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
            }, { new: true }).then(() => console.log('address added succfuly'));
        }


        res.redirect('/address-list')
    } catch (err) {
        console.log(err.message);
        next(err)
    }
}

const load_address = async (req, res, next) => {
    try {
        req.session.cart = false
        const user = req.session.login
        const userdata = await userModify.findOne({ _id: user })
        res.render('list-address', { userdata, user })
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
const delete_address = async (req, res, next) => {
    try {
        const addr_id = req.params.id
        id = req.session.login
        const result = await userModify.findByIdAndUpdate({ _id: id }, {
            $pull: {
                address: { _id: addr_id }
            }
        })
        res.redirect('/address-list')
    } catch (err) {
        console.log(err.message)
        next(err)
    }
}
const update_profile = async (req, res, next) => {
    try {
        const userid = req.session.login;
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
        user = req.session.login
        const cartdata = await userModify.findOne({ _id: user }).populate("cart.product")
        res.render('cart', { user, cartdata })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const add_to_cart = async (req, res, next) => {
    try {
        const pdt_id = req.params.id
        const id = req.session.login
        let product = await productView.findOne({ _id: pdt_id })
        product = product._id

        const prdtcheck = async (id) => await userModify.findOne({ "cart.product": id })
        const check = await prdtcheck(pdt_id)
        console.log(check)
        if (check == [] || check == null) {
            const quantity = 1
            const datatoinsert = {
                product: product,
                quantity: quantity
            }
            await userModify.findOneAndUpdate({ _id: id }, {
                $push: {
                    cart: [datatoinsert]
                }
            }, { upsert: true })
                .catch(() => console.log('not inserted'))

        } else {
            const cartdata = await userModify.findOneAndUpdate(
                { _id: id, "cart.product": pdt_id },
                { $inc: { "cart.$.quantity": 1 } }
            ).catch((err) => console.log(err))
        }
        if (req.session.cart) {
            req.session.cart = false
            res.redirect('/view-cart')
        } else {
            res.redirect('/home')
        }
    } catch (err) {
        console.log(err.message);
        next(err)
    }
}
const remove_cart = async (req, res, next) => {
    try {
        const pdt_id = req.params.id
        const id = req.session.login

        await userModify.findOneAndUpdate(
            { _id: id, "cart.product": pdt_id },
            { $inc: { "cart.$.quantity": -1 } }
        ).catch((err) => console.log(err))
        
        await userModify.findOneAndUpdate(
            { _id: id, "cart.product": pdt_id },
            { $pull: { cart: { product: pdt_id, quantity: 0 } } }
        ).catch((err) => console.log(err))
        res.redirect('/view-cart')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
} 

module.exports = {

    view_cart,
    add_to_cart,
    remove_cart,

    load_landing,
    load_SignIn,
    load_SignUp,

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
// await userModify.findOneAndUpdate(
//     { _id: id, "cart.product": pdt_id },
//     {
//         $pull: { cart: { product: pdt_id, quantity: 1 } }
//     }
// ).then(() => console.log('cart added succfuly'))
//     .catch((err) => console.log(err))
