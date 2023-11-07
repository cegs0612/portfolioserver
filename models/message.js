import  mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    messageDate:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    message:{
        type: String,
        required: true
    }
})

const messageModel = mongoose.model("messages",messageSchema);

export default messageModel;