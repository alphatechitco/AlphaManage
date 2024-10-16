const supabase=require('../database/dbconfig');

class TasksManager {
    constructor(user_id,class_id) {
        this.user_id=user_id;
        this.class_id=class_id;
    }

    async getAssignments(user_id) {
        console.log("Module Rec: ", user_id);
    
        try {
            const { data, error } = await supabase
                .from('class_users')
                .select(`
                    class_id,
                    classes:class_id (
                        class_name,
                        created_at,
                        class_assignments (
                            assignments:assignment_id (
                                assignment_id,
                                assignment_topic,
                                assignment_due,
                                assignment_reminder1,
                                assignment_reminder2,
                                assignment_reminder3,
                                group_mates,
                                assignment_notes,
                                ai_notes,
                                ai_prompts
                            )
                        )
                    )
                `)
                .eq('user_id', user_id);
    
            if (error) {
                console.error("Error fetching assignments:", error);
                throw new Error("Error Getting Details!");
            }
    
            const assignments = data
                .flatMap(classUser =>
                    classUser.classes?.class_assignments?.map(assignment => assignment.assignments)
                )
                .flat();
    
            console.log("Fetched Data Module: ", assignments);
            return assignments;
        } catch (error) {
            console.error("Error in getAssignments:", error.message);
            throw new Error(`Error Getting Assignments: ${error.message}`);
        }
    }
    
    async formAssignmentMaterial(){

    }

    async addAssignments(assignment_topic,assignment_subject,assignment_details,assignment_due,assignment_reminder1,assignment_reminder2,assignment_reminder3,group_mates){
        console.log("Module Function Triggered")

        try{
            const {data,error}=await supabase
            .from('assignments')
            .insert([
                {
                  assignment_topic,
                  assignment_details,
                  assignment_subject,
                  assignment_due,
                  assignment_reminder1,
                  assignment_reminder2,
                  assignment_reminder3,
                  group_mates,
                }
            ])
            .select();

            if(error){
                console.log("Error While Inserting Assignmnet!", error.message)
                return {taskAdded:false, message:"Task Addition Failed"}
            }

            const wholeClass=await this.assignToClass(this.class_id,data[0].assignment_id)
            return {taskAdded:true, message:"Task Addition Success!"}

        } catch(error){
            console.log("Error While Connecting/Querying Database!, "+ error.message)
            throw new Error("Error While Connecting Database!")
        }

    }

    async assignToClass(class_id,assignment_id){

        try{
            const {data, error} = await supabase
            .from('class_assignments')
            .insert([
                {
                    assignment_id,
                    class_id
                }
            ])

            if(error){
                console.error(error)
                throw new Error(error)
            }

            return  {assigned:true, message:"Assignment To Class Success"}
        } catch(error){
            console.log("Error, ",error)
            throw new Error(error)
        }
    }
    
}

module.exports = TasksManager;
