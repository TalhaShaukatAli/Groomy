export type user = {
    id: string,
    email: string,
    password: string,
    mongoID: string
}

export type cookie = {
    id: string,
    cookie: string
}

export type data = {
    user: user[],
    cookie : cookie[]
}