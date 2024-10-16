const router= require('express').Router();
const TM=require('../../models/TaskManager');


router.get('/getAssignments', async (req,res)=>{
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

router.post('/addAssignments', async (req,res)=>{
    console.log("API Endpoint Called")
    const {assignment_topic,assignment_subject,assignment_details,assignment_due,assignment_reminder1,assignment_reminder2,assignment_reminder3,group_mates}=req.body;
    const tm=new TM();

    try{
        const result=await tm.addAssignments(assignment_topic,assignment_subject,assignment_details,assignment_due,assignment_reminder1,assignment_reminder2,assignment_reminder3,group_mates);

        if(result.taskAdded){
            res.json({taskAdded:true, message:"Task Added Successfully"})
        }

        res.json({taskAdded:false, message:"Task Added Successfully"})

    } catch(error){
        console.log("Internal Server Error")
        res.status(500).send("Internal Server Error")
    }

})

module.exports=router;


