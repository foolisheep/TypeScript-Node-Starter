import mongoose from "mongoose";
export default interface AccessToken extends mongoose.Document {
    clientId: string;
    userId: string;
}