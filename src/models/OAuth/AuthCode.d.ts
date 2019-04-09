
import mongoose from "mongoose";
export default interface AuthCode extends mongoose.Document {
    clientId: string;
    userId: string;
    userName: string;
    redirectUri: string;
}