import passport from "passport";
import User from "../models/User/User";
import UserCollection from "../models/User/UserCollection";

passport.serializeUser<any, any>((user: User, done: (err: any, id?: any) => void) => {
    done(undefined, user.id);
});

passport.deserializeUser((id: any, done: (err: Error, user: User) => void) => {
    UserCollection.findById(id, (err: Error, user: User) => {
        done(err, user);
    });
});

export default passport;