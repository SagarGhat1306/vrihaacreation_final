const mongoose = require('mongoose')

const  userSchema = new mongoose.Schema({
      name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique : true
    },
    password: {
      type: String,
      required: true,
      unique : true
    },

    cartData :{
        type  :Object , default : {}
    }

},
{
    minimize : false
}
)

const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);

module.exports = userModel;