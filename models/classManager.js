const supabase = require("../database/dbconfig");
const { use } = require("../routes/userRoutes/registerRoute");


class classManager{
    
    constructor(){

    }

    async getClass(){
        const classname="BSCS 5 B";

        try{
            const {data,error}= await supabase
            .from('classes')
            .select('*')
            
            
            if(error){
                throw new Error("Error: ",error)
            }
            console.log("Model Process: ",data);

            return data;
        } catch(error){
            throw new Error("Error While Connecting To Database!")
        }
    }

    async joinClass(class_id, user_id){
        console.log("Models Assigned: ", class_id, user_id)
        try{
            const {data,error}= await supabase
            .from('class_users')
            .insert([
                {user_id,class_id}
            ])

            if(error){
                console.log("Error In Quering To Database: ", error);
                throw new Error("Error", error)
            }

            return {join:true, message:"Joined Successfully"}
        } catch(error){
            throw new Error("Error while connecting To Database...")
        }
    }
}

module.exports=classManager;