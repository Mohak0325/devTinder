const validator = require('validator');


const validateSignupData = (req) => {

    const {firstName , lastName , email, password} = req.body;
    
    if(!firstName || !lastName || !email || !password){
        throw new Error('Invalid data');
    } else if(firstName.length < 4 || firstName.length > 50){
        throw new Error('Name should be between 3 to 50 characters');
    } else if(!validator.isEmail(email)){
        throw new Error('Email is invalid');
    } else if(!validator.isStrongPassword(password)){
        throw new Error('Password is invalid');
    }
}

const validateEditProfileData = (req) => {
    const allowedEditData = ['firstName' , 'lastName' , 'skills' , 'age' , 'about' , 'gender' , 'photoURL'];

    const isEditAllowed = Object.keys(req.body).every((update) => allowedEditData.includes(update));
    return isEditAllowed;
}

module.exports = {validateSignupData , validateEditProfileData};