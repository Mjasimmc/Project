const result = ((req,res,next)=>{
    try {
        if(req.session.login){
            res.redirect('/home')
        }else{
            next()
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
})
const homeallow = async (req,res,next)=>{
    try {
        if(req.session.login){
            next()
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.log(error.message)
        next(error)
    }
}
const phonecheck = async(req,res,next)=>{
    try {
        if(req.session.mobile){
            next()
        }else{
            res.redirect('/register')
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    result,
    homeallow,
    phonecheck
}