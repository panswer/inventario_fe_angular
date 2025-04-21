export interface AuthServiceSignInInput {
    email: string;
    password: string;
}

export interface AuthServiceSignInOutput {
    authorization?: string;
    message?: string;
}