declare namespace Express {
    interface Request {
        session: { [property: string]: any }
    }
}
