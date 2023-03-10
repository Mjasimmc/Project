const mongoose = require('mongoose');
const order = mongoose.Schema({
    user: {
        type: String
    },
    product: {
        type: String,
        ref: 'product'
    },
    orderid: {
        type: String
    },
    orederdate: {
        type: String
    },
    payement: {
        type: String
    },
    orderstatus: [
        String
    ],
}
)
module.exports = mongoose.model('user', order)