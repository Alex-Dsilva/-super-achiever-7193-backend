const cookie = require('cookie')

const auth=(req,res,next)=>{
    const {token} = cookie.parse(req.headers.cookie )

    if(token==="null"){
        res.send("please login")  
    }
    else{
        next()
        
    }
}

module.exports={auth}