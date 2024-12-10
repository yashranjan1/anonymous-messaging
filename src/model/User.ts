import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document{
    content: string;
    createdAt: Date;
}

export const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}


export const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [128, "Password must be less than 128 characters"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpires: {
        type: Date,
        required: [true, "Verify code expires is required"],
    },
    isVerified: {
        type: Boolean,
        required: [true, "Is verified is required"],
    },
    isAcceptingMessages: {
        type: Boolean,
        required: [true, "Is accepting messages is required"],
        default: true
    },
    messages: [MessageSchema]
});

const UserModel =
    (mongoose.models?.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", UserSchema);

export default UserModel;