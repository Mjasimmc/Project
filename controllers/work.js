const userModify = require('../models/user')
const productView = require('../models/product')

const serviceid = "";


const load_phone = async (req, res) => {
    try {
        const users = await userModify.findOne({_id:"64098e92bb3761ea793fa729"}).populate("cart.product")

        console.log(users)
        res.render('checkout',{users})
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
    const { userlogin } = req.session;
    try {
        const { newusermobile } = req.body;
        console.log("here is find user");
        const findUser = await signup.findOne({ phone: newusermobile });
        if (!findUser) {
            console.log(findUser, "this is findUser");
            console.log(newusermobile);
            req.session.newusermobile = newusermobile;

            await client.verify.v2
                .services(serviceid)
                .verifications.create({
                    to: `+91${newusermobile}`,
                    channel: "sms",
                })
                .then((verification) => {
                    res.redirect("/otp");
                });
        } else {
            console.log("here is all ready exisits");
            req.flash("message", "m");
            res.redirect("/phone");
        }
    } catch (error) {
        console.log(error.message);

        res.render("user404");
    }
};
const verifyOtp = async (req, res) => {
    console.log("this verifypage");
    const { newusermobile } = req.session;
    console.log(newusermobile);
  
    try {
      const { enteredotp } = req.body;
      console.log(enteredotp, "this enter otp");
      await client.verify.v2
        .services(serviceid)
        .verificationChecks.create({
          to: `+91${newusermobile}`,
          code: enteredotp,
        })
        .then((verification_check) => {
          console.log("verifid");
          if (verification_check.status == "approved") {
            res.redirect("/signup");
          } else {
            req.flash("message", "a");
            res.redirect("/otp");
          }
        });
    } catch (error) {
      console.log(error, "otp");
      res.render("user404");
    }
  };

module.exports = {
    load_phone,
    load_otp,
    postNumber,
    verifyOtp
}