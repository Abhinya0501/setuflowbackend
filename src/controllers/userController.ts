import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userModel.js";

export const register = catchAsyncError(
    async (req,res,next)=>{
        try{
const {name , email, phone , password , verificationMethod}=req.body;

if(!name || !email || !phone || !password || !verificationMethod){
    return next(new ErrorHandler("All feilds are required",400));
}

function validatePhoneNumber(phone){
    const phoneRegex = /^\+91\d{10}$/;
    return phoneRegex.test(phone);
}

if(!validatePhoneNumber(phone)){
    return next(new ErrorHandler("Invalid phone number.",400));
}

const existingUser = await User.findOne({
    $or:[
        {email,
            accountVerified:true,
        },
        {
            phone,
            accountVerified:true,
        }
    ]
});

if(existingUser){
    return next(new ErrorHandler("Phone or email is already used.",400));
}

const registerationAttemptsByUser = await User.find({
    $or:[
        {email,
            accountVerified:false,
        },
        {
            phone,
            accountVerified:false,
        }
    ]
});

if(registerationAttemptsByUser.length > 3){
    return next(
        new ErrorHandler("you have exceeded the maximum number of attempts (3). Please try again after an hour.",400)
    )
}

const userData = {
    name,
    email,
    phone,
    password
};

const user = await User.create(userData);
const verificationCode = await user.generateVerificationCode();
await user.save();

sendVerificationCode(
    verificationMethod,
    verificationCode,
    name,
    email,
    phone
    
);
res.status(200).json({
    success:true,
})

        }catch(error){
            next(error);
        }
    }
)