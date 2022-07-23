declare namespace Express {    
    export interface Request {
        user: {
            id: number;
            admin: boolean;
            email?: string;
        }
    }
}