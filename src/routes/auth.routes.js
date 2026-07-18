const express = require ('express')

const router = express.Router()

const validate = require('../middleware/validate.middleware')
const authmiddleware = require ('../middleware/auth.middleware')
const authorize = require('../middleware/authorize.middleware')
const { 
       registerUser,
       loginUser,
       getProfile } = require('../controllers/auth.controllers');
const { registerSchema, loginSchema } = require('../validators/auth.validators');

router.post('/register' ,validate(registerSchema), registerUser)
router.post('/login', validate(loginSchema), loginUser)

router.get("/profile", authmiddleware,  getProfile)

//to check authorization
router.get("/admin", authmiddleware, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});
  

module.exports = router; 
