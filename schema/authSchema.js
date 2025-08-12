const mongoose = require('mongoose')

const admin = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false   
    },
    otp:{
        type: String
    },
    otpExpiresAt: {
        type: Date,
      }
    }, {
      timestamps: true
})
module.exports = mongoose.model('Admin', admin)
