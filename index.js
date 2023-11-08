import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import entryModel from "./models/entry.js";
import  messageModel  from "./models/message.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3001;
//, "https://cegs0612.github.io/portfolioOfficial"],
/*const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "POST",
  };*/

const corsOptions = (req) =>{
    const acceptedOrigin = "http://localhost:3000";
    return req.header('origin') === acceptedOrigin? {origin:true}:{origin:false}
}

//app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())
//conection to database

mongoose.connect(process.env.DB_URI)
mongoose.connection.on('connected', () => {
    console.log('successful connection to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('connection error in MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('connection finished from MongoDB');
});


//creates transporter for mailing

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.MAIL_PORT,
    auth:{
        user:process.env.MAIL_ADDRESS_SENDER,
        pass:process.env.MAIL_PASSWORD_SENDER
    }
})

transporter.verify((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });


//mails the data

const sendEmail = async (html,subject) =>{
    const mailOptions = {
        from: process.env.MAIL_ADDRESS_SENDER,
        to: process.env.MAIL_RECIPIENT,
        subject,
        html
    }
    transporter.sendMail(mailOptions,(info,error)=>{
        if(error){
            console.log('error',error);
        } else {
            console.log('mail sent',info.respose);
        }
    })
}

app.post('/',cors(corsOptions), async (req , res) =>{
    const newEntry = new entryModel({
       entryDate: req.body.date,
       position: req.body.position,
       error: req.body.error 
    }); 

    let messageHTML = "";
    if (!newEntry.position){
        messageHTML = "<p>New Entry</p> <br> <table><tr><td>Entry date:</td><td>"+newEntry.entryDate+"</td></tr><tr><td>Position:</td><td>null</td></tr><tr><td>Error:</td><td>"+newEntry.error[0]+"</td></tr><tr><td>"+JSON.stringify(newEntry.error[1])+"</td></tr></table>"
    } else {
        messageHTML = "<p>New Entry</p> <br> <table><tr><td>Entry date:</td><td>"+newEntry.entryDate+"</td></tr><tr><td>Position:</td><td>"+newEntry.position.latitude+","+newEntry.position.longitude+"</td></tr><tr><td>Error:</td><td>"+JSON.stringify(newEntry.error)+"</td></tr></table>";
    };
    
    let messageSubject = "New Entry at portfolio";
    
    await sendEmail(messageHTML,messageSubject);
    await newEntry.save();
    console.log(req.body);
    res.send('data received');
});

app.post('/message', async (req, res) => {
    const newMessage = new messageModel({
        messageDate: req.body.date,
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    });
    
    const messageHTML = "<p>New Message</p> <br> <table><tr><td>Date:</td><td>"+newMessage.messageDate+"</td></tr><tr><td>Name:</td><td>"+newMessage.name+"</td></tr><tr><td>Email:</td><td>"+newMessage.email+"</td></tr><tr><td>Message:</td><td>"+newMessage.message+"</td></tr></table>";
    const messageSubject = 'New Message from portfolio';

    await sendEmail(messageHTML,messageSubject);
    await newMessage.save();
    console.log(req.body);
    res.send('message received')
});

app.listen(PORT, ()=>{
    console.log(`app listening on port ${PORT}`)
})

