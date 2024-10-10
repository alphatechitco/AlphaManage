const express=require('express');
const router=express.Router();
const classManager=require('../../models/classManager');

router.post('/getClasses', async (req,res)=>{
    const cm=new classManager()
    console.log("API Called...")
    try{

        const data=await cm.getClass();

        res.json(data)

    } catch(error){
        res.status(500).json("Error While Reaching Server")
    }
})

router.post('/joinClass', async (req,res)=>{
    const {class_id, user_id}=req.body;
    console.log("Router Catch:", class_id,user_id)
    const cm=new classManager();

    try{
        const data=await cm.joinClass(class_id,user_id);

        if(data.join){
            res.json({join:true, message:"SuccessFully Joined"})
        }
        res.status(409).json("Error Joining Class!")
    }  catch(error){
        res.status(500).json("Internal Server Error!")
        throw new Error("Internal Server Error!")
    }
})

module.exports=router;