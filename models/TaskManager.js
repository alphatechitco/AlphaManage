const supabase=require('../database/dbconfig');

class TasksManager{
    constructor(){

    }


   async add_assignments(user_id,assignmentdue,){

    try{
        const {data,error}=supabase
        .from('assignments')
        .insert({
            []
        })
    }
   }
}