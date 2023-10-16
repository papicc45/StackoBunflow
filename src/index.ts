import { Elysia, t } from "elysia";
import {PrismaClient, User} from "@prisma/client";
import {jwt, JWTPayloadSpec} from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import { cors } from '@elysiajs/cors'
import {
    userDTO,
    jwtUserDTO,
    updateUserDTO,
    questionDTO,
    commentDTO,
    answerDTO,
    headerDTO
} from '../requestDTO/requestDTO';

const client = new PrismaClient();
const setup = ( app : Elysia ) => app.decorate('db', client);

const app = new Elysia()
    .use(setup)
    .use(cors())
    .use(jwt({ name : 'jwt', secret : 'elysiaApplicationSecretKey' }))
    .use(cookie())
    .decorate('getUserInfo',  (userid : string) => client.user.findUnique({ where : { userid, status : "Y" } }))
    .group('/user', (app) => {
        return app
            //회원가입
            .post('/signup', async ({body, db})=> {
                let {userid, password, nickname} = body;
                password = await Bun.password.hash(password);
                await db.user.create({
                    data : { userid, password, nickname, status : 'Y', }
                })
                return { result : true };
            }, {
                body : userDTO,
            })
            //로그인
            .post('/signin', async ({body, db, getUserInfo, jwt, setCookie, cookie }) => {
                let {userid, password} = body;
                const user = await getUserInfo(userid);

                if(user != null) {
                    if(await Bun.password.verify(password, user.password)) {
                        const accessToken = await jwt.sign({ userid : String(user.id) });
                        setCookie('auth', accessToken, { maxAge : 1800, httpOnly : true });
                        return { result : true, user : user, cookie : cookie.auth };
                    } else {
                        return { result : false };
                    }
                } else {
                    return { result : false };
                }
            }, {
                body : jwtUserDTO
            })
            //회원정보 수정
            .patch('/update', async ({ body, jwt,  db, headers : { auth } })=> {
                const obj = await jwt.verify(auth);
                if(!obj) {
                    return { result : false };
                } else {
                    let {password, nickname} = body;
                    password = await Bun.password.hash(password);
                    const updateUsers = await db.user.update({
                        where: { id: Number(obj.userid), },
                        data: { password, nickname },
                    })
                    if(updateUsers != null) return { result : true };
                    else return { result : false };
                }
            }, {
                body : updateUserDTO,
                headers : headerDTO
            })
            //회원정보 삭제(프론트 만들고 쿠키 확인)
            .delete('/delete', async ({ db, jwt, headers : { auth }, removeCookie })=> {
                const obj = await jwt.verify(auth);

                if(!obj) {
                    return { result : false };
                } else {
                    const updateStatus = await db.user.update({
                        where : { id : Number(obj.userid) }, data : { status : "N" }
                    })

                    if(updateStatus != null) {
                        removeCookie(auth);
                        return { result : true };
                    }
                    else return { result : false };
                }
            }, {
                headers : headerDTO
            })
            //로그아웃
            .post('/logout', ({ jwt, headers : { auth }, removeCookie })=> {
                const obj = jwt.verify(auth);

                if(!obj) {
                    return { result : false };
                } else {
                    removeCookie('auth');
                    return { result : true };
                }
            }, {
                headers : headerDTO
            })
    })
    .group('/question', (app)=> {
        return app
            //질문 상세
            .get('/:id', async ({ params, db })=> {
                const question = await db.question.findUnique({
                    where : { id : Number(params.id) },
                    include : {
                        answer : {
                            include : {
                                user : { select : { nickname : true } },
                                recommended : true
                            }
                        }}
                })

                if(question == null) return { result : false };
                else{
                    //조회수 업데이트
                    await db.question.update({
                        where : { id : Number(params.id) }, data : { count : question.count + 1 }
                    })
                    return { result : true, question };
                }
            })
            //질문 전체 가져오기
            .get('/all', async ({ db })=> {
                const questionList = await db.question.findMany({
                    orderBy : [ { createdAt : 'desc' } ],
                    include : { user : { select : { nickname : true } } }
                });
                if(questionList.length === 0) return { result : false };

                return { result : true, questionList };
            })
            //질문 작성
            .post('', async ({ body, db, jwt, headers : { auth } })=> {
                const obj  = await jwt.verify(auth);

                if(!obj) {
                    return { result : false };
                } else {
                    const {title, content, tag} = body;
                    const result = await db.question.create({
                        data : { title, content, tag, userId : Number(obj.userid) }
                    });
                    if(result != null) return { result : true };
                    else return { result : false };
                }
            }, {
                body : questionDTO,
                headers : headerDTO

            })
            //댓글 작성
            .post('/comment', async ({ body, db, jwt, headers : { auth } })=> {
                const obj = await jwt.verify(auth);
                if(!obj) {
                    return { result : false };
                } else {
                    const { content, questionId } = body;
                    const result = await db.comment.create({
                        data : {content, userId: Number(obj.userid), questionId}
                    });
                    if(result != null) return { result : true };
                    else return { result : false };
                }
            }, {
                body : commentDTO,
                headers : headerDTO
            })
            //답변 작성
            .post('/answer', async ({ body, db, jwt, headers : { auth } })=> {
                const obj = await jwt.verify(auth);

                if(!obj) {
                    return { result : false };
                } else {
                    const { content, questionId } = body;
                    const result = await db.answer.create({
                        data : { content, userId : Number(obj.userid), questionId }
                    });

                    if(result != null) return { result : true };
                    else return { result : false };
                }
            }, {
                body : answerDTO,
                headers : headerDTO
            })
            //답변 추천
            .post('/recommend', async ({ body, db, jwt, headers : { auth } })=> {
                const obj = await jwt.verify(auth);

                if(!obj) {
                    return { result : false };
                } else {
                    const { answerId, count } = body;
                    const findRecoomendedList = await db.recommended.findUnique({
                        where : { userId : Number(obj.userid), answerId }
                    });
                    if(findRecoomendedList === null) {
                        const result = await db.recommended.create({
                            data : { answerId, userId : Number(obj.userid) }
                        });
                        const updateResult = await db.answer.update({
                            where : { id : answerId },
                            data : { recommend: count + 1 }
                        })
                        return { result : true, action : 'create', updateResult };
                    } else {
                        const result = await db.recommended.delete({
                            where : { answerId, userId : Number(obj.userid) }
                        })
                        const updateResult = await db.answer.update({
                            where : { id : answerId },
                            data : { recommend: count - 1 }
                        })
                        return { result : true, action : 'delete', updateResult };
                    }
                }
            }, {
                body : t.Object({ answerId : t.Integer(), count : t.Integer() }),
                headers : headerDTO
            })
            .get('/search', async ({ query, db })=> {
                const {keyword} = query;
                if(keyword === null) {
                    return { result :false };
                } else {
                    const result = await db.question.findMany({
                        orderBy : [ { createdAt : 'desc' } ],
                        include : { user : { select : { nickname : true } } },
                        where : {
                            OR : [
                                { title : { contains : keyword }, },
                                { content : { contains : keyword }, }
                            ]
                        }
                    });

                    return { result : true, questionList : result };
                }
            });
    })
    .listen(8001);

  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
