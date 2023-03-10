const productView = require('../models/product')

const search_result = async (req,res,next)=>{
    try {
        const products = await productView.find({delete:0})
        req.session.products = products ;
        next();
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}

module.exports = {
    search_result
}