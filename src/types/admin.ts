export interface admin{
    id:number;
    name:string;
    password:string;
}
export interface adminData{
    name:string;
    password:string;
}
export interface AuthResponse{
    success: boolean;
    message: String;
    admin?: admin [];
    token?: string;
}