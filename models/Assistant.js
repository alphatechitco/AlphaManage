/*
node-corn
node-schedule
bull
*/

const supabase = require("../database/dbconfig")
const cron=require('node-cron');
const nodemailer=require('nodemailer');
const { error } = require("winston");

class Assistant{
    constructor(){

    }

    async triggerReminder(){

        try{
            const {data,error}=await supabase

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

                if(error) throw new Error(error);

                const now = new Date();

                data.forEach(user=>{
                    user.classes.class_assignments.assignments.forEach(assignment=>{

                        const reminders = [
                            new Date(assignment.assignment_reminder1),
                            new Date(assignment.assignment_reminder2),
                            new Date(assignment.assignment_reminder3)
                        ];

                        reminders.forEach(reminder=>{
                            const timeDiff=reminder-now;
                            const timeDiffInMinutes=timeDiff/(1000*60);

                            if(timeDiffInMinutes<=60 && timeDiffInMinutes>0){
                                this.sendEmailNotifications(email,assignment)
                            }
                        })

                        
                    })
                })


        } catch(error){
            console.log("Error While Connecting To/Querying Database!")
            throw new Error("Error While Connecting To Database..")
        }
    }


    async sendEmailNotifications(email, assignment){

        const transporter= nodemailer.createTransport({
            service:'gmail',
            auth: {
                user: 'alphamange',
                pass: ''
            }
        });

        const mailOptions={
            from:'',
            to:'',
            subject:`Reminder For ${assignment.assignment_topic}`,
            text: `You have an upcomming reminder for assignment "${assignment.assignment_topic}"`
        };

        await transporter.sendMail(mailOptions, (error,info)=>{
            if (error){
                console.error("Error sending email:", error)
            } else{
                console.log("Email Sent: ", info.response)
            }
        })
    }

}

cron.schedule('* * * * *', ()=>{
    console.log('Running scheduled task to check reminders');
    const assistant = new Assistant();
    assistant.triggerReminder();
})