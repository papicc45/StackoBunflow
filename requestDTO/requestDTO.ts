import { Elysia, t } from "elysia";

export const userDTO = t.Object({
    userid : t.String(),
    password : t.String(),
    nickname : t.String(),
})

export const jwtUserDTO = t.Object({
    userid : t.String(),
    password : t.String(),
})

export const updateUserDTO = t.Object({
    password : t.String(),
    nickname : t.String(),
})

export const questionDTO = t.Object({
    title : t.String(),
    content : t.String(),
})

