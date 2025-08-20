import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://naleeshathanushka:760733708@cluster0.muruu.mongodb.net/food-users').then(()=>console.log("DB connected"));
}