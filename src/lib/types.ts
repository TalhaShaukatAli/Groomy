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
    cookie: string
    expireTime: number
}
