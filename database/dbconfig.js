const {createClient}=require('@supabase/supabase-js');


const projectAPI='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nd3N1Z3hiZnhtZ3JucG5naGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjcxOTY4NjUsImV4cCI6MjA0Mjc3Mjg2NX0.pDztbkz_jh9MDMCOwkTXwKXgnD4JXMlZqihzY-iJ3Pc'
const projectURL='https://ogwsugxbfxmgrnpnghlp.supabase.co'

const supabase=createClient(projectURL,projectAPI);


module.exports=supabase;


