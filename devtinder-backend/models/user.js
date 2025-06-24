const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validator(value) {
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validator(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error('Weak Password');
            }
        }
    },
    age: {
        type: Number,
        min: 18,
        max: 65,
    },
    gender:{
        type: String ,
        enum : {
            values: ["Male" , "male", "Female" , "female", "Others","others"],
            message: '{VALUE} is not supported',
        }
    } ,
    about : {
        type: String,
        default: "I am a user"
    },
    skills :{
        type: [String],
        default: []
    },
    photoURL : {
        type: String,
        default : "https://as1.ftcdn.net/v2/jpg/11/28/72/50/1000_F_1128725045_1Xv5xuXLcAEW9Sm0ToMJEeTgYFPOUV1r.jpg"
    },
} , {timestamps: true});

userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({_id : user._id} , process.env.JWT_SECRET , {expiresIn: '7 days'});
    return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUSer) {
    const user = this;
    const passwordHash = user.password
    const ispasswordValid = bcrypt.compare(passwordInputByUSer , passwordHash);
    return ispasswordValid;
}

module.exports = mongoose.model('User', userSchema);