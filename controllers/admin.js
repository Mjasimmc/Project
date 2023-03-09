const UserModify = require('../models/user');
const productModidy = require('../models/product')
const adminDB = require('../models/admin')
const categorydata = require('../models/catogory')


const path = require('path')
require('dotenv').config({ path: __dirname + '../config/.env' })
const postlogin = async (req, res, next) => {
    try {
        const admindata = await adminDB.findOne()
        const email = admindata.email
        const password = admindata.password
        const useremail = req.body.email
        const userpassword = req.body.password
        if (email == useremail) {
            if (password == userpassword) {
                req.session.adminlogin = true
                res.redirect('/admin/home')
            } else {
                req.session.adminloginmessage = "password incorrect"
                res.redirect('/admin')
            }
        } else {
            req.session.adminloginmessage = "user Not found"
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadSignIn = async (req, res, next) => {
    try {
        alertMessage = req.session.adminloginmessage;
        req.session.adminloginmessage = ""
        res.render('signin', { alertMessage })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadHome = async (req, res, next) => {
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const logout = async (req, res, next) => {
    try {
        req.session.adminlogin = false
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const userlist = async (req, res, next) => {
    try {
        const users = await UserModify.find({}).sort({ name: 1 })
        res.render('userlist', { users })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const block = async (req, res, next) => {
    try {
        const userid = req.params.id
        await UserModify.findOneAndUpdate({ _id: userid }, { $set: { blockuser: false } })
        res.redirect('/admin/userlist')

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const unblock = async (req, res, next) => {
    try {
        const userid = req.params.id
        await UserModify.findOneAndUpdate({ _id: userid }, { $set: { blockuser: true } })
        res.redirect('/admin/userlist')

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadinsertproduct = async (req, res,next) => {
    try {
        const category = await categorydata.find({ delete: 0 })
        console.log(category)
        req.session.category = category._id;
        res.render('addproduct', { category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadcategory = async (req, res, next) => {
    try {
        res.render('addcategory')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const insertProduct = async (req, res, next) => {
    try {
        const product = new productModidy({
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image: req.files.map(file => file.filename),
            category: req.body.fruits,
            stock: req.body.stock
        })
        const categoryid = req.session.category;
        await categorydata.findOneAndUpdate({ user_id: categoryid }, { $inc: { products: 1 } })
        const productdata = await product.save()
        if (productdata) {
            console.log(productdata)
        } else {
            console.log("product failed")
        }
        res.redirect('/admin/productlist')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const insertCategory = async (req, res,next) => {
    try {
        const category = req.body.name;
        const product = new categorydata({
            category: category
        })
        const existdata = await categorydata.findOne({ category: category })
        if (existdata != null) {
            req.session.categorymessage = "Your category is already exist"
        } else {
            console.log("hello")
            const categorysave = await product.save()
            if (categorysave) {
                req.session.categorymessage = "category saved sucessfully"
            } else {
                req.session.categorymessage = "error occured on category submition"
            }
        }
        res.redirect('/admin/categorylist')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const productlist = async (req, res, next) => {
    try {
        let products = await productModidy.find({ delete: 0 })
        res.render('productlist', { products })

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const deleteproduct = async (req, res, next) => {

    try {
        const userid = req.params.id
        await productModidy.findOneAndUpdate({ _id: userid }, { $set: { delete: 1 } })
        res.redirect('/admin/productlist')

    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const loadprofile = async (req, res, next) => {
    try {
        res.render('profile')
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const categorylist = async (req, res, next) => {
    try {
        alertMessage = req.session.categorymessage
        req.session.categorymessage = ""
        const category = await categorydata.find({ delete: 0 })
        res.render('categorylist', { category })
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
module.exports = {
    loadSignIn,
    loadHome,
    logout,
    postlogin,


    userlist,
    block,
    unblock,

    loadinsertproduct,
    insertProduct,
    productlist,
    deleteproduct,

    loadprofile,

    loadcategory,
    insertCategory,
    categorylist

}