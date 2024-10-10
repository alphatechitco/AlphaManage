const express=require('express');
const path=require('path')
const registerRoute=require('../routes/userRoutes/registerRoute');

const app=express();


app.use(express.json());
app.use(express.static(path.join(__dirname,'..','public')));


app.use('/users',registerRoute);

const PORT=process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("App Started at: ", PORT);
})



