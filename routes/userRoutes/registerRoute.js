const express = require('express');
const router = express.Router();
const UM = require('../../models/UserManager');
const jwt = require('jsonwebtoken');

// Ensure JWT secret is properly set
const JWT_Secret = process.env.JWT_SECRET || 'your-secret-key';  // You can load this from environment variables

router.post('/RegisterAM', async (req, res) => {
    const um = new UM();
    const { name, university, department, semester, email, password, phone } = req.body;

    console.log("API Request Received: ", name, university);

    try {
        // Attempt to register the user
        const result = await um.registerUser(name, university, department, semester, email, phone, password);

        if (result.success) {
            const userID = result.userID;

            // Generate JWT token with userID and secret
            const token = jwt.sign({ userID }, JWT_Secret, { expiresIn: '1h' });

            // Respond with success
            return res.json({ success: true, token, userID, message: "Register Success!" });
        }

        // If registration wasn't successful, send conflict error
        return res.status(409).json({ success: false, message: "Error Registering" });

    } catch (error) {
        // Respond with a server error in case of exception
        return res.status(500).json({ success: false, message: error.message });
    }
});

// API to trigger backend email validation functionality
router.post('/checkEmail', async (req, res) => {
    // Object creation of the User functionality class
    const um = new UM();

    // Extract email from request body
    const { email } = req.body;

    // Manual debugging to ensure parameters passing
    console.log("Received email for validation:", email);
    try {
        // Call the validation function and store the response
        const result = await um.validateEmail(email);

        // Send response to frontend based on the validation result
        return res.json({
            success: result.success,
            message: result.message
        });

    } catch (error) {
        console.error("Validation error:", error.message); // Log error message
        return res.status(500).json({
            success: false,
            message: "Server error while connecting for validation."
        });
    }
});

router.post('/LoginAM', async (req,res)=>{
    const {email, password}=req.body;
    console.log("Router: ", email, password);
    const um=new UM();

    try{
        const result=await um.Login(email,password);

        if(result.success){
            const userID=result.userID;

            const token=jwt.sign({userID}, JWT_Secret, {expiresIn:'1h'});

            return res.json({success:true,token,message:"Login Successful"})
        }

        return res.status(409).send({success:false, message:"Invalid Password"})

    } catch(error){
        return res.status(500).json({ success: false, message: error.message });    }
})


module.exports = router;
