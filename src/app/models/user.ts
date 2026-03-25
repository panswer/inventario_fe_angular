import { User as UserInterface } from "../interfaces/user";

export class User implements UserInterface {
    _id: string;
    username: string;
    role: string;
    createdAt: number;
    updatedAt: number;

    constructor(params: UserInterface) {
        this._id = params._id;
        this.username = params.username;
        this.role = params.role;
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;
    }
}
