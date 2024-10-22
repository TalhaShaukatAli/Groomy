export type existingUser = {
    _id: object,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export type newUser = {
    firstName: string,
    lastName: string,
    email: string
    password: string
}

export type cookie = {
    id: string,
    cookie: string
}

export type data = {
    user: user[],
    cookie : cookie[]
}