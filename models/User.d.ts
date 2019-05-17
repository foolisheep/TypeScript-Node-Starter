export type Gender = "male" | "female" | "other";
export default interface User {
    email: string;
    password?: string;
    name: string;
    gender: Gender;
    avatarUrl: string;
    address?: string;
    website?: string;
}