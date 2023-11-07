import  mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    entryDate:{
        type: String,
        required: true
    },
    position:{
        type: Object,
    },
    error:{
        type: Array,
    }
})

const entryModel = mongoose.model("entries",entrySchema);

export default entryModel;