const cookie = require('cookie')

const auth=(req,res,next)=>{
    const token = cookie.parse(req.headers.cookie || '')
    if(token){

        next()
    }
    else{
        res.send("please login")
    }
}

module.exports={auth}