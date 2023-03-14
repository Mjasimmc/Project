const mongoose = require('mongoose');
const order = mongoose.Schema({
    user: {
        type: String,
        ref: 'user'
    },
    product: [
        {
            _id: {
                type: String,
                ref: 'product'
            },
            quantity: {
                type: Number
            }
        }
    ],
    orderdate: {
        type: String
    },
    payement: {
        type: String
    },
    orderstatus: [
        String
    ],
    orderaddress: {
        name:{type:String},
        mobile:{type:Number},
        house: {type: String},
        post: { type:Number },
        city: {type: String},
        state:{type: String},
        district: {type: String}
    },
    totalprice:{
        type:Number
    }
}
)
module.exports = mongoose.model('order', order)