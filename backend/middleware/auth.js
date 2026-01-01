const jwt = require('jsonwebtoken')

const authuser = async (req,res,next) => {

    const {token} = req.headers;
    console.log(token)

    if(!token){
        res.json({success : false , message : "Not Authorized Again"})
    }

    try{
        const tokenDecod = jwt.verify(token , process.env.JWT_SECRETE_KEY )

        req.body.userId = tokenDecod.id

        next()
    }
    catch(error){
        res.json({success : false , message : error.message})
    }

}

module.exports = authuser