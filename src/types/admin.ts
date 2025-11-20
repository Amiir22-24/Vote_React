export interface Admin {
    id: number;
    name: String;
    password: String;
}
export interface adminData {
    name: String;
    password: String;
}
export interface AuthResponse {

    success: boolean;
    message: string;
    admin: {
        id: number;
        name: string;
        // created_at: string;
        // updated_at: string;
    };
    token: string;
}
