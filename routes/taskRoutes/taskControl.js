const router= require('express').Router();
const TM=require('../../models/TaskManager');


router.post('/getAssignments', async (req,res)=>{
    console.log("API Called")
    const user_id=req.body.user_id;
    console.log("Extracted User ID: ", user_id)
    const tm=new TM();

    try{
        const assignments=await tm.getAssignments(user_id)
        console.log("Router Recieved Data: ", assignments)
        res.json(assignments)

    } catch(error){
        console.error("Error in /getAssignments:", error.message);
        res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
})

module.exports=router;


