const mongoose = require("mongoose");
const {Schema } = mongoose;
const bcrypt = require("bcrypt");
const userSchema = new Schema({
    username :{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {    
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});


//instance methods

userSchema.methods.isStudent = function(){
    return this.role == "student";
};


userSchema.methods.isInstructor = function(){
    return this.role == "instructor";
};

userSchema.methods.comparePassword = async function(password, cb){
    try{
        let result = await bcrypt.compare(password,this.password);
        return cb(null, result); 

    } catch(e){
        return cb(e,result);
    };
    
}

userSchema.pre("save",async function (next) {
    //this代表mongoDB內的document
    if(this.isNew || this.isModified("password")){
        //將密碼進行雜湊處理
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;


    } 
    next();
});

module.exports = mongoose.model("User",userSchema);


