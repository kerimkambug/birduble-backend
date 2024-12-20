
const mongoose = require("mongoose");
const connectmongoose = () => {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("connection success")
    })
    .catch(err=>{
        console.error(err);
    })

}
module.exports=connectmongoose;
