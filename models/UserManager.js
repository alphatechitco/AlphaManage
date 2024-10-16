const supabase = require('../database/dbconfig');
const bcrypt = require('bcryptjs');
const validator=require('validator');
const zxcvbn=require('zxcvbn');

class Register {
    constructor() {}

    async registerUser(name, university, department, semester, role, role_id, email, phone, password) {

        console.log(name, university, department, semester, email, phone, password)
        try {
            // Hash password (await to handle async)
            const password_hash = await bcrypt.hash(password, 10);
            const user_id=1234

            const roleStatus=await this.clearRole(role_id);

            if(!roleStatus.clear){
                role='student';
            }

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
                        password_hash, // Use password_hash for the insert
                        role
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

    async clearRole(role_id){
        console.log(role_id)
        
        try{

            const {data, error}=await supabase
            .from('rolepass')
            .select('*')
            .eq('role_id', role_id)

            if(error || !data){
                console.log("Error While Getting Role Clarification!")
                return {clear:false, message:"Role is Unidentified!"}
            }


            return {clear:true, message:"Role is Identified!"}
    

        } catch(error){
            console.log("Error: ", error)
            throw new Error("Error While Quering Database")
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

    async getClassID(user_id){

        try{
            const {data,error} = await supabase
            .from('class_users')
            .select('class_id')
            .eq('user_id', user_id)

            if(error){
                console.log("Error While Fetching Class ID, ", error)
                return {user_id:null}
            }

            return data[0].class_id;
        }  catch(error) {
            throw new Error("Error Connecting To Server!" + error.message)
        }

    }

    async Login(email, password) {
        console.log(email);
        console.log(password);
        try {

            // Query user by email
            const { data, error } = await supabase
           .from('users')
           .select('password_hash, user_id, role')
           .eq('email', email);

console.log("Supabase Response - Data:", data);
console.log("Supabase Response - Error:", error);

            if (error || !data || data.length === 0) {
                throw new Error("Invalid Email");
            }

            console.log("P", data[0].password_hash);
            console.log("U", data[0].user_id)
            console.log("R", data[0].role)
            // Compare the hashed password (await to handle async)
            const isMatch = await bcrypt.compare(password, data[0].password_hash);

            if (!isMatch) {
                throw new Error("Invalid Password!");
            }

            const userID = data[0].user_id;
            const role=data[0].role;
            const class_id=await this.getClassID(userID)

            return { success: true, userID, class_id, role, message: "Login Successful" };
        } catch (error) {
            throw new Error("Error Connecting To Server! " + error.message);
        }
    }
}

module.exports = Register;
