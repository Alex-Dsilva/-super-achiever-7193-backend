const cookie = require('cookie')

const checkRole=(req,res,next)=>{

        const cookieString = req.headers.cookie;
        const {role} = cookieString ? cookie.parse(cookieString) : null;
        console.log(role, "djfklj")
        if(role==="admin"){
            next()
        }else{
            res.send("You are not authorize to perform this opretion")
        }

}

module.exports={checkRole}