export interface AuthServiceSignInInput {
    email: string;
    password: string;
}

export interface AuthServiceSignInOutput {
    authorization?: string;
    message?: string;
}

export interface AuthServiceResetPasswordInput {
    email: string;
}

export interface AuthServiceResetPasswordOutput {
    message: string;
}

export interface AuthServiceResetPasswordVerifyInput {
    email: string;
    token: string;
    password: string;
}

export interface AuthServiceResetPasswordVerifyOutput {
    message?: string;
    code?: number;
}