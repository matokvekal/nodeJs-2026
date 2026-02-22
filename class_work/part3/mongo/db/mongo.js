import mongoose from "mongoose";
const dbUrl = "mongodb://127.0.0.1:27017/students";

export const connectStubentsDb = async  () => {
  try{
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  }
  catch(err){
    console.log("Error connecting to database", err);
  }
};

  
