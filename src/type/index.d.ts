declare global{
    namespace Express{
        interface Request{
            user?:TokenPaylaod
        }

    }
}

export {};