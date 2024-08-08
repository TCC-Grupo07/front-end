export class AuthTokenError extends Error{
    constructor(){
        super("ERROR with authentication token.")
    }
}