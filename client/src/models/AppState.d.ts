import User from "../../../models/User";
export default interface AppState {
    user: User; // If user is undefined then user has not logged in.
}