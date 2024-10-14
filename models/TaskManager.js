const supabase=require('../database/dbconfig');

class TasksManager {
    constructor() {}

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
    
}

module.exports = TasksManager;
