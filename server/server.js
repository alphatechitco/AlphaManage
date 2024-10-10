const express=require('express');
const path=require('path')
const registerRoute=require('../routes/userRoutes/registerRoute');
const classesRoute=require('../routes/classRoutes/classControl')

const app=express();


app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));


app.use('/users',registerRoute);
app.use('/classes', classesRoute)

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("App Started at: ", PORT);
})



