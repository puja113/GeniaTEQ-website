const express = require('express');
require('dotenv').config(); //?
const app = express();
bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');  //used for processing file uploads
const nodemailer = require('nodemailer');
const path = require('path')
const fs = require('fs')
const DB = require('./database');



app.use(cors())
app.use(express.static(path.join(__dirname + "/uploads")))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //Appending extension   , null as the first argument (indicating no error)
    },
}); 

var upload = multer({ storage: storage }).single('file');

//Final
app.post('/Enquiry', (req, res) => {
    // console.log(req.body) name,email,phone,subjecr,message
    try {
        //Company side mail
        DB.query(`Select email_id,password from users where user_code=2`,(error,results)=>{
            if(error){
                console.log(error)
            }
            var transporter = nodemailer.createTransport({
                host: "smtp.yandex.com",
                port: 465,
                secure: true,
                auth: {
                  user: results[0].email_id, 
                  pass: results[0].password
                }
            });
            const GTdetails = {
                //sending male to itself that's why same email is used here
                from: results[0].email_id,
                to: results[0].email_id,
                subject: 'Enquiry from Website',
                text:`Hi Team,\nWe are received below enquiry from website.\n\nName- ${req.body.user_name}\nemail- ${req.body.email_id}\nphone- ${req.body.phone_number}\nsubject- ${req.body.subject}\nmessage- ${req.body.message}\n\nRegards,\nWebsite Mailer.`,
                html: `<p style="margin:0px;padding:0px">Hello Team,</p><br><p style="margin:0px;padding:0px">We are received below enquiry from website.</p><br><p style="margin:0px;padding:0px">Name- ${req.body.user_name}</p><p style="margin:0px;padding:0px">phone- ${req.body.email_id}</p><p style="margin:0px;padding:0px">phone- ${req.body.nation_code}-${req.body.phone_number}</p><p style="margin:0px;padding:0px">subject- ${req.body.subject}</p><p style="margin:0px;padding:0px">message- ${req.body.message}</p><br><p style="margin:0px;padding:0px">Regards,</p><p style="margin:0px;padding:0px">Website Mailer.</p><br>`,
            };

            transporter.sendMail(GTdetails, (err, info) => {
                if (err) {
                    res.status(404).json({
                        status:false, 
                        error:{
                            message: "Failed to Submit your Application",
                            code:"1005"
                        } 
                    });
                }
                else {
                    try {
                            var temp_user_code;
                            DB.query(`SELECT user_code FROM users ORDER BY user_id_pk DESC LIMIT 1;`,(error,results)=>{
                                if(error){

                                };
                                temp_user_code=results[0].user_code
                                const { user_name, phone_number, email_id, subject, message,nation_code} = req.body;
                              
                                DB.query(`insert into users(user_name,phone_number,email_id,user_type,user_code,nation_code) values('${user_name}','${phone_number}','${email_id}','2',${temp_user_code+1},${nation_code});`,(error,results)=>{
                                if(error){

                                };
                               
                                DB.query(`select user_id_pk from users where user_name='${user_name}' AND phone_number='${phone_number}' AND email_id='${email_id}' AND user_type="2" AND user_code=${temp_user_code+1} ;`,(error,result)=>{
                                if(error){ 
                                };
                                
                                let primary=result[0].user_id_pk;
                                
                                DB.query(`insert into enquiry(subject,message,user_id_fk) values("${subject}","${message}",${primary})`,(error,results)=>{
                                    if(error) {

                                    }
    
                                })
                            })
                        })
                            })
                        
                        
                        
                        
                
                    } catch (error) {
                        res.status(404).json({status: false,
                        "error":
                            {
                                message: "Failed to Submit Your Enquiry",
                                code:1005
                            } 
                        })
                    }
                    res.status(200).json({
                        status:true, 
                    });
                }
                
    
            });
            

        });
         
        DB.query(`Select email_id,password from users where user_code=3`,(error,ClientEmail)=>{
            if(error){

            }
            var transporter1 = nodemailer.createTransport({
                host: "smtp.yandex.com",
                port: 465,
                secure: true,
                auth: {
                  user: ClientEmail[0].email_id,
                  pass: ClientEmail[0].password
                }
            });
            const Clientdetails = {
                from: ClientEmail[0].email_id,
                to: req.body.email_id ,
                subject: 'Enquiry from Website',
                text: `Hello ${req.body.user_name},\n\nThanks for the enquiry. Our team will review and contact you shortly.\n\nRegards,\nTeam GeniaTEQ.`,
                html: `<p style="margin:0px;padding:0px">Hello ${req.body.user_name},</p><br><p style="margin:0px;padding:0px">Thanks for the enquiry. Our team will review and contact you shortly.</p><br><p style="margin:0px;padding:0px">Regards,</p><p style="margin:0px;padding:0px">Team GeniaTEQ</p>`,
            }
            transporter1.sendMail(Clientdetails, (err, info) => {
                if (err) {
                    res.status(404).json({
                        status:false, 
                        error:{
                            message: "Failed to Submit your Application",
                            code:1005
                        } 
                    });
                }
                
            });

        });
    }
    catch (error) {
        res.status(404).json({
            status:false, 
            "error":{
                "message": "Failed to Submit Your Enquiry",
                "code":1005
            } 
        });
    }
})


//Final
app.post('/UploadFile/:id', (req, res) => {
    
    upload(req, res, (err) => {
        if (err) {
            
        }
        else {
            const path = req.file.path; // '../uploads/465645646546.jpg'
            try {
                //company side mail
                DB.query(`Select email_id,password from users where user_code=2`,(error,results)=>{
                    if(error){

                    };
                    var transporter = nodemailer.createTransport({
                        host: "smtp.yandex.com",
                        port: 465,
                        secure: true,
                        auth: {
                          user: results[0].email_id,
                          pass: results[0].password
                        }
                    });
                const GTdetails = {
                    from: results[0].email_id,
                    to: results[0].email_id,
                    subject: 'Job Application',
                    text:`Hi Team,\nWe have received a job application for position - '${req.params.id}'.\n\nRegards,\nWebsite Mailer`,
                    html: `<p style="margin:0px;padding:0px">Hello Team,</p><br><p style="margin:0px;padding:0px">We have received a job application for position - '${req.params.id}'.</p><br><p style="margin:0px;padding:0px">Regards,</p><p style="margin:0px;padding:0px">Website Mailer.</p>`,
                    attachments: [
                        {
                            path: path
                        }
                    ]
                };
                transporter.sendMail(GTdetails, (err, info) => {
                    if (err) {
                        
                        res.status(200).json({status: false})
                    }
                    else {
                        
                        fs.unlink(path, (err) => {
                            if (err) {
                                
                            }
                        })
                        res.status(200).json({status: true})
                    }
                });
            });

            }
            catch (error) {
                res.status(404).json({
                    status: false,
	                error:
		            {
                        message: "Failed to Submit Your Application",
                        code:1007
                    } 

                })
            }
        }
        
        
    })
})


//done //working //mysql //admin side
app.post('/AddOpening', (req, res) => {
    try {
        const { experience, role, position_name, key_responsibilities, skills_required, job_overview,job_location } = req.body;
        DB.query(`insert into job_position(position_name,role,experience,job_overview,key_responsibilities, skills_required,job_location, isDisable) values('${position_name}','${role}','${experience}','${job_overview}','${key_responsibilities}','${skills_required}','${job_location}','${false}');`,(error,results)=>{
            if(error){
                console.log(error)
            }
            res.status(200).json({status:true});
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({status: false,
        error:
            {
                message: "Failed to Add Requirement",
                code:1009
            } 
        })
    }

})


//done //working //mysql
app.get('/GetAllActiveOpenings', async (req, res) => {
    // console.log(req.body)
    DB.query("Select * from job_position where isDisable='false'",(error,results)=>{
        if(error){
            console.log(error)
            res.status(404).json({
                status: false,
                error:
                    {
                message: "Failed to send Data",
                code:1008
            } 
                }
            );
        }
        else{
            console.log(results)
            res.status(200).json(results);
        }
    })
    

})

//admin
app.get('/GetAllActiveOpeningsForAdmin', async (req, res) => {
    console.log(req.body)
    DB.query("Select * from job_position;",(error,results)=>{
        if(error){
            res.status(404).json({
                status: false,
                error:
                    {
                message: "Failed to send Data",
                code:1008
            } 
                }
            );
        }
        else{
            res.status(200).json(results);
        }
    })
})
//done //working //mysql  //admin
app.post('/DeleteOpening', async (req, res) => {
    try {
        const { id } = req.body;
        DB.query(`delete from job_position where position_id_pk=${id}`,(error,results)=>{
            if(error){

            }
            res.status(200).json({status:true});
        })
    } catch (error) {
        res.status(500).json({ status: false,
        error:
            {
                message: "Failed to Delete",
                code:1010
    } 
     })
    }
})

//admin
app.post('/DisableOpening',(req,res)=>{
    console.log(req.body)
    try{
    const {position_id_pk,isDisable}=req.body;
    DB.query(`UPDATE job_position SET isDisable='${isDisable}' WHERE position_id_pk='${position_id_pk}';`,(error,results)=>{
        if(error){

        }
        res.status(200).json({status:true});
    })
    }
    catch(error){
        res.status(404).json({
            status: false,
            error: {
                message: "Failed to Disable",
                    code:1013
        } 
            }
        )
    }
})


//done //working //mysql  //admin
app.put('/UpdateOpening', async (req, res) => {
    try {
        const {position_id_pk}=req.body;
        const { experience, role, position_name, key_responsibilities, skills_required, job_overview,job_location } = req.body;
        DB.query(`UPDATE job_position SET position_name='${position_name}',role='${role}',experience='${experience}',job_overview='${job_overview}',key_responsibilities='${key_responsibilities}', skills_required='${skills_required}',job_location='${job_location}',isDisable='${false}' WHERE position_id_pk='${position_id_pk}';`,(error,results)=>{
            if(error){

            }
            res.status(200).json({status:true});
        })
    } catch (error) {
        res.status(404).json({
            status: false,
            error: {
                message: "Failed to Update",
                    code:1011
        } 
            }
        )
    }

       
})


//done //working //mysql
app.post('/AddSubscriber', (req, res) => {
    
    try {
        const { email } = req.body;
        DB.query(`select * from news_letter where email='${email}';`,(error,result)=>{
            if(error){
                
            }
            else{
                if(result.length==0){
                    DB.query(`insert into news_letter(email) values('${email}');`,(error,results)=>{
                        if(error){
                            console.log(error)
                        }
                        try {
                            
                            DB.query(`Select email_id,password from users where user_code=3`,(error,ClientEmail)=>{
                                console.log(ClientEmail)
                                if(error){
                                    console.log(error)
                                };
                                
                            var transporter = nodemailer.createTransport({
                                host: "smtp.yandex.com",
                                port: 465,
                                secure: true,
                                auth: {
                                  user: ClientEmail[0].email_id,
                                  pass: ClientEmail[0].password
                                }
                            });
                            const Clientdetails = {
                                from: ClientEmail[0].email_id,
                                to: req.body.email,
                                subject: 'Newsletter Subscription',
                                html: `<p style="margin:0px;padding:0px">Hi,</p><br><p style="margin:0px;padding:0px">Welcome to GeniaTEQ Family. Thank you for subscribing our Newsletter.</p><br><p style="margin:0px;padding:0px">Regards,</p><p style="margin:0px;padding:0px">Team GeniaTEQ.</p><br>`
                                
                            };
                            transporter.sendMail(Clientdetails, (err, info) => {
                                if(err){
                                    
                                }
                                else{
                                    
                                    
                                    res.status(200).json({status:true});
                                }
                            });
                        })
                        }
                        catch (error) {
                            res.status(404).json({ 
                                status: false,
                                error:
                                {
                                    message: "Failed to Subscribe",
                                    code:1005
                                }  
                            })
                        }
                        
                    })
                }
                else{
                    res.status(200).json({status:false});
                }
            }
        })
        
    } catch (error) {
        res.status(404).json({ 
            status: false,
	        error:
		    {
                message: "Failed to Subscribe",
                code:1005
            } 

         })
    }
    

})

var k; // for otp generation
//done //working //admin
app.post('/ResetPassword', async (req, res) => {
    try {
            const {email_id}=req.body
            DB.query(`select * from users where email_id='${email_id}' AND user_code=1;`, (error,results)=>{
                if(results.length!=0){
                    k=Math.floor(Math.random() * 1000000);
                // company side mail
                DB.query(`Select email_id,password from users where user_code=3`,(error,ClientEmail)=>{
                    if(error){

                    }
                var transporter = nodemailer.createTransport({
                    host: "smtp.yandex.com",
                    port: 465,
                    secure: true,
                    auth: {
                      user: ClientEmail[0].email_id,
                      pass: ClientEmail[0].password
                    }
                });
                    
                const GTdetails = {
                    from: ClientEmail[0].email_id,
                    to: email_id,
                    subject: 'Otp Verfication',
                    text: `Hello Team\nplease don't disclose this otp to anyone\nyour OTP- ${k}\n\nRegards,\nWebsite Mailer.`,
                    html: `<p style="margin:0px;padding:0px">Hello Team,</p><br><p style="margin:0px;padding:0px">please don't disclose this otp to anyone</p><br><p style="margin:0px;padding:0px">your OTP- ${k}</p><br><p style="margin:0px;padding:0px">Regards,</p><p style="margin:0px;padding:0px">Website Mailer.</p>`
                    
                };
                transporter.sendMail(GTdetails, (err, info) => {
                    if (err) {
                        
                    }
                    res.status(200).json({status:true});
        
                });
            })
                res.status(200).json({status:true});
                }
                else{
                    res.status(200).json({status: false,
                    error:
                        {
                        message: "Failed to reset password.",
                        code:1002
                } 
                });
                
                }
            })
        

        
                
    } catch (error) {
        res.status(404).json({ success: true, data: null, message: 'Server Side Error' })
    }
    
})

//done //working //admin
app.post('/login', async (req, res) => {
    try{
        const {email_id,password}=req.body
        // const password=req.body.password
        DB.query(`select * from users where email_id="${email_id}" AND user_code=1 AND password="${password}"`, (error,results)=>{
            if(results.length!=0){
                res.status(200).json({status:true});
            }
            else{
                res.status(200).json({status:false});
            }
        })
    }
    catch (error) {
        
        res.status(404).json({ status: false,
            error:
            {
                message: "Failed to Login",
                code:1001
            }  })
    }
})

//done //chacked  //admin
app.post('/VerifyOTP', async (req, res) => {
    if(k===req.body.otp){
        res.status(200).json({ status: true})
    }
    else{
        res.status(404).json({
            status:true,
            error:
            {
                message: "Failed to send OTP",
                code:1003
            }
        })
    }

})

//done cheaked  //admin
app.post('/UpdatePassword', async (req, res) => {
    try {
        const {password}=req.body;
        DB.query(`UPDATE users SET password='${password}' WHERE user_code=1`,(error,results)=>{
            if(error){

            }
            res.status(200).json({status:true});
        })
    } catch (error) {
        res.status(404).json({ status: false,
            error:
            {
                message: "Failed to reset password.",
                code:1004
            }  })
    }
    
    
})

//done cheacked //mysql  //admin
app.post('/SentMailToSubscribers', async (req, res) => {
    
    DB.query("Select * from news_letter",(error,results)=>{
        if(error) {
            res.status(404).json({
                status:true,
                error:
                {
                    message: "Failed to send Mails",
                    code:1012
                }
            })
        }else{
        DB.query(`Select email_id,password from users where user_code=3`,(error,ClientEmail)=>{
            if(error){

            }
        var transporter = nodemailer.createTransport({
            host: "smtp.yandex.com",
            port: 465,
            secure: true,
            auth: {
              user: ClientEmail[0].email_id,
              pass: ClientEmail[0].password
            }
        });
        for(let i=0;i<results.length;i++){
            const Clientdetails = {
                from: ClientEmail[0].email_id,
                to: results[i].email,
                subject: req.body.subject,
                text: req.body.content
            };
            transporter.sendMail(Clientdetails, (err, info) => {
                if(err){
                    
                }
                else{

                }
            });
            
        }
        res.status(200).json({status:true});
        
    })
    }
    
    
})
})

app.listen(5000);






