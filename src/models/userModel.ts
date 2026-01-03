import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

/* =========================
   1️⃣ User Interface
========================= */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  accountVerified: boolean;
  verificationCode?: number;
  verificationCodeExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;

  comparePassword(enteredPassword: string): Promise<boolean>;
  generateVerificationCode(): Promise<any>;
}

/* =========================
   2️⃣ Schema
========================= */
const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Password must have at least 8 characters."],
    maxlength: [32, "Password cannot have more than 32 characters."],
    
  },
  phone: String,
  accountVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: Number,
  verificationCodeExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/* =========================
   3️⃣ Pre-save Hook
========================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});


/* =========================
   4️⃣ Instance Methods
========================= */
userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateVerificationCode = function(){

function generateRandomFiveDigitNumber(){
    const firstDigit = Math.floor(Math.random()*9) + 1;
    const remainingDigits = Math.floor(Math.random()*10000).toString().padStart(4);
    return parseInt(firstDigit + remainingDigits);
}

const verificationCode = generateRandomFiveDigitNumber();
this.verificationCode=verificationCode;
this.verificationCodeExpire= Date.now() + 5*60*1000;

return verificationCode;

}


/* =========================
   5️⃣ Model
========================= */
export const User: Model<IUser> = mongoose.model<IUser>(
  "User",
  userSchema
);
