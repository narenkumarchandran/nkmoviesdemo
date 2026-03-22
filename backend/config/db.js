const mongoose = require('mongoose');

const connectdb= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "NkMovies", // tell mongoose which DB to use
        });
        console.log("Connected to database");
    }
    catch(err){
        console.error(err);
        process.exit(1);
    }
}

module.exports=connectdb;