const {verify}= require("jsonwebtoken")


const validatetoken=(req,res,next)=>{
    const accesstoken=req.header("accesstoken")

    if(!accesstoken){return res.json({error:"user not loged in"})}
    

    try{
        const validation=verify(accesstoken,"secret")
        req.user=validation
        if(validation)
        {
                // console.log("from authmiddleware")
                return next()
        }
    }catch(err){
                return res.json({error:err})
    

    }

    
}

module.exports = validatetoken