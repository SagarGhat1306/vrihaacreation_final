const userModel = require('../models/UserModel')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const createToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRETE_KEY)
}

const bcrypt = require('bcrypt')

const loginUser = async (req , res) => {
  try{
    const {email , password} = req.body;
    
    const user = await userModel.findOne({email});
    if (!user) {
      return res.json({success : false , message : "user doesn't exists"})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(isMatch) {
      const token = createToken(user._id)
      res.json({success : true,token})
    }
    else{
     return res.json({success : false , message : "Invalid credentials"})
    }
  } 
  catch(error){
    console.log(error)
     res.json({success : false , message:error.message})
  }
}

const registerUser = async (req , res) => {

  try{
    const { name , email  , password } =  req.body;
    const exist = await userModel.findOne({email})

    if(exist){
      return res.json({success : false , message : "user alredy exists"})
    }

    if(!validator.isEmail(email)) {
        return res.json({success : false , message : "user alredy exists"})
    }

    if(password.length < 8) {
        return res.json({success : false , message : "password must atleast 8 character"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedpassword = await bcrypt.hash(password , salt)

    const newUser = new userModel({
      name,
      email,
      password : hashedpassword
    })

    const user = await newUser.save()

    const token = createToken(user._id)

    res.json({success : true,token})

  }
  catch (error){
    console.log(error)
    res.json({success : false , message:error.message})
  }
  res.json({msg : "register api working"})
}

const adminLogin = async (req,res) => {
  try{
    const {email,password} = req.body;
    if ( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ){
      const token  = jwt.sign(email+password , process.env.JWT_SECRETE_KEY);
      res.json({success : true,token})
    }
    else{
      res.json({success : false , message:"Invialde Credential"})
    }
  }
  catch(error){
    console.log(error)
  }
}

module.exports = {
  loginUser,
  registerUser,
  adminLogin
};