
// Usage: sendOTP('+1234567890');


const load_phone = async (req, res) => {
    try {
        res.render('phone-number')
    } catch (error) {
        console.log(error)
    }
}


const load_otp = (req, res) => {
    try {
        res.render('otp-page')
    } catch (error) {
        console.log(error)
    }
}

const postNumber = async (req, res) => {
    console.log("hhhhhhhhhhhh");

    try {
        const { newusermobile } = req.body;
        const mobile = "+91"+newusermobile
        const otp = Math.floor((Math.random() * 1000000) + 1)
        req.session.otp = otp ; 
        console.log("here is find user");
        sendOTP(mobile,otp)
        res.redirect('/working/otp')
        

    } catch (error) {
        console.log(error.message);
    }
};
const verifyOtp = async (req, res) => {
    console.log("this verifypage");
    
    try {
        const userotp = req.body.post
        if( req.session.otp == userotp){
            res.send("success")
        }else{
            res.send("nnot")
        }
        console.log(enteredotp, "this enter otp");

    } catch (error) {
        console.log(error, "otp");
    }
};

module.exports = {
    load_phone,
    load_otp,
    postNumber,
    verifyOtp,


}