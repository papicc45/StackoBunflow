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
    tag : t.String(),
})

export const commentDTO = t.Object({
    content : t.String(),
    questionId : t.Integer(),
})
export const answerDTO = t.Object({
    content : t.String(),
    questionId : t.Integer(),
})

export const headerDTO = t.Object({
    auth : t.String(),
})