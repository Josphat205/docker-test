import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    password: String,
    email: String,
    name: String,
    role: String,
    created_at: {
        type: Date,
        default: Date.now
    }
    
});

const User = mongoose.model('User', UserSchema);
export default User;