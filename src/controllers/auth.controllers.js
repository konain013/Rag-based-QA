const User = require('../models/user.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { success } = require('zod');



const registerUser = async(req,res,next)=>{
    try {
        const {name , email , password } = req.body;

        // check User Already Exist
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(409).json({
                success:false,
                message:'User already exist'
            })
        }

        // Formatted Name
       const formattedName = name
       .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

      // Hash Password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password , salt)

      
      // create User
      const user = await User.create({
        name:formattedName,
        email,
        password:hashedPassword
      })

      return res.status(201).json({
        success:true,
        message:'user register successfully',
        data:{
            id:user._id,
            name:user.name,
            email:user.email
        }
      })

    } catch (error) {
        next(error)
        
    }

}



// ==========================
// User Login
// ==========================

const loginUser = async (req, res, next) => {
  try {
    // Get user credentials
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        role:user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

//=========================
// GETPROFILE
//=========================

const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);

        return res.status(200).json({
            success: true,
            message:"Access Succesfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {registerUser , loginUser , getProfile}