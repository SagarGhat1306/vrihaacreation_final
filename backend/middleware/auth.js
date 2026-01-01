// const jwt = require('jsonwebtoken')

// const authuser = async (req,res,next) => {

//     const {token} = req.headers;
//     console.log(token)

//     if(!token){
//         res.json({success : false , message : "Not Authorized Again"})
//     }

//     try{
//         const tokenDecod = jwt.verify(token , process.env.JWT_SECRETE_KEY )

//         req.body.userId = tokenDecod.id

//         next()
//     }
//     catch(error){
//         res.json({success : false , message : error.message})
//     }

// }

// module.exports = authuser


const jwt = require('jsonwebtoken');

const authuser = (req, res, next) => {
    const token = req.headers.token;
    console.log("TOKEN FROM FRONTEND:", req.headers);


    // Token not provided
    if (!token) {
        return res.json({
            success: false,
            message: "Not authorized, login again"
        });
    }

    try {
        // Verify JWT using correct env variable
        const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);

        // Attach userId to request body
        req.body.userId = decoded.id;

        next();

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = authuser;
