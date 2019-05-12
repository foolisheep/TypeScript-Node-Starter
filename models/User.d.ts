export type Gender = "male" | "female";
export default interface User {
    email: string;
    password?: string;
    name: string;
    gender: Gender;
    avatarUrl: string;
    location?: string;
    website?: string;
}