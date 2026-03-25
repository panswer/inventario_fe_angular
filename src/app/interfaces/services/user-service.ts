import { User } from "../../interfaces/user";

export interface GetUsersOutput {
    users: User[];
}

export interface UpdateUserRoleInput {
    role: string;
}

export interface UpdateUserRoleOutput {
    _id: string;
    username: string;
    role: string;
    createdAt: number;
    updatedAt: number;
}
