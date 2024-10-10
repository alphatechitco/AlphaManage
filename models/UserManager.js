const supabase = require('../database/dbconfig');
const bcrypt = require('bcryptjs');
const validator=require('validator');
const zxcvbn=require('zxcvbn');

class Register {
    constructor() {}

    async registerUser(name, university, department, semester, email, phone, password) {

        console.log(name, university, department, semester, email, phone, password)
        try {
            // Hash password (await to handle async)
            const password_hash = await bcrypt.hash(password, 10);
            const user_id=1234

            // Insert user data into the 'users' table
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        name,
                        university,
                        department,
                        semester,
                        email,
                        phone,
                        password_hash // Use password_hash for the insert
                    }
                ]);

            // Handle Supabase insert error
            if (error) {
                console.log(error)
                throw new Error("Error While Registering Account!");
            }

            // Retrieve user ID for the newly inserted user
            const userID = await this.getUserID(email);

            return { success: true, message: "Registration Success!", userID };

        } catch (error) {
            throw new Error("Error While Connecting To Server! " + error.message);
        }
    }

    // Async function responsible for email validation
    async validateEmail(email) {
    // Validate email using validator library
    const isValidEmail = validator.isEmail(email);

    // Tailor the response based on validation result
    if (!isValidEmail) {
        console.log("Email validation result: NO"); // Debugging log
        return {
            success: false,
            message: "Invalid Email!"
        };
    }

    console.log("Email validation result: YES"); // Debugging log
    return {
        success: true,
        message: "Valid Email!"
    };
  }

    async getUserID(email) {
        try {
            // Query user ID by email
            const { data, error } = await supabase
                .from('users')
                .select('user_id')
                .eq('email', email)
                .single();
    

                console.log("Fetched: ",data)

            if (error || !data || data.length === 0) {
                console.log("Error in result")
                throw new Error("Error: UserID Not Found!");
            }

            const userID = data[0].user_id;

            return userID;
        } catch (error) {
            throw new Error("Error Connecting To Server! " + error.message);
        }
    }

    async Login(email, password) {
        console.log(email);
        console.log(password);
        try {

            // Query user by email
            const { data, error } = await supabase
           .from('users')
           .select('password_hash, user_id')
           .eq('email', email);

console.log("Supabase Response - Data:", data);
console.log("Supabase Response - Error:", error);

            if (error || !data || data.length === 0) {
                throw new Error("Invalid Email");
            }

            console.log("P", data[0].password_hash);
            console.log("U", data[0].user_id)
            // Compare the hashed password (await to handle async)
            const isMatch = await bcrypt.compare(password, data[0].password_hash);

            if (!isMatch) {
                throw new Error("Invalid Password!");
            }

            const userID = data[0].user_id;

            return { success: true, userID, message: "Login Successful" };
        } catch (error) {
            throw new Error("Error Connecting To Server! " + error.message);
        }
    }
}

module.exports = Register;
