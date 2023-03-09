
const load_otp = (req,res)=>{
    try {
        res.render('otp-page')
    } catch (error) {
        console.log(error)
    }
}
const load_phone = (req,res)=>{
    try {
        res.render('phone-number')
    } catch (error) {
        console.log(error)
    }
}


module.exports = {
load_phone,
load_otp
}