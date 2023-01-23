const cookie = require('cookie')

const auth=(req,res,next)=>{
    const cookieString = req.headers.cookie;
    const token = cookieString ? cookie.parse(cookieString) : null;
    if(!token){
        res.send("please login")  
    }
    else{
        next()
    }
}

module.exports={auth}