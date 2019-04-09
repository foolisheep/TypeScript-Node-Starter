import mongoose from "mongoose";
export interface OAuthToken {
  provider: string;
  token: string;
}
export default interface User extends mongoose.Document {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  facebook: string;
  tokens: OAuthToken[];
  profile: {
    name: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };
  comparePassword: ComparePasswordFunction;
  gravatar: (size: number) => string;
  updateToken: (provider: string, token: string) => void;
}
export type ComparePasswordFunction = (
  candidatePassword: string,
  cb: (err: mongoose.Error, isMatch: boolean) => void
) => void;
