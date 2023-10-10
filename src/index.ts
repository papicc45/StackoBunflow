import { Elysia, t } from "elysia";
import {PrismaClient, User} from "@prisma/client";
import {jwt, JWTPayloadSpec} from '@elysiajs/jwt';
import { cookie } from '@elysiajs/cookie';
import {userDTO, jwtUserDTO, updateUserDTO, questionDTO} from '../requestDTO/requestDTO';

const client = new PrismaClient();
const setup = (app : Elysia ) => app.decorate('db', client);

const app = new Elysia()
    .use(setup)
    .use(jwt({ name : 'jwt', secret : 'elysiaApplicationSecretKey' }))
    .use(cookie())
    .decorate('getUserInfo',  (userid : string) => client.user.findUnique({ where : { userid } }))
    .group('/user', (app) => {
        return app
            .post('/signup', async ({body, db})=> {
                let {userid, password, nickname} = body;
                password = await Bun.password.hash(password);
                await db.user.create({
                    data : { userid, password, nickname, status : 'Y', }
                })
            }, {
                body : userDTO,
            })
            .post('/signin', async ({body, db, getUserInfo, jwt, setCookie, cookie }) => {
                let {userid, password} = body;
                const user = await getUserInfo(userid);
                console.log(user);
                if(user != null) {
                    if(await Bun.password.verify(password, user.password)) {
                        const accessToken = await jwt.sign({ userid : String(user.id) });
                        setCookie('auth', accessToken, { maxAge : 1800, httpOnly : true });
                        return { result : true, user : user, cookie : cookie.auth };
                    }
                } else {
                    return { result : false };
                }
            }, {
                body : jwtUserDTO
            })
            .patch('/update', async ({ body, set, jwt,  db, cookie : { auth } })=> {
                const obj = await jwt.verify(auth);
                if(!obj) {
                    set.status = 401;
                    return false;
                } else {
                    let {password, nickname} = body;
                    password = await Bun.password.hash(password);
                    const updateUsers = await db.user.update({
                        where: { id: Number(obj.userid), },
                        data: { password, nickname },
                    })
                    return true;
                }
            }, {
                body : updateUserDTO
            })
            //jwt 인증코드
            .post('/jwt', async ({ jwt, set, cookie : { auth } })=> {
                const obj :JWTPayloadSpec | boolean = await jwt.verify(auth);
                console.log('verify result : ', obj);
                if(!obj) {
                    // throw new Unauthorized();
                }
                return `Hello ${obj}`;
            })

    })
    .group('/question', (app)=> {
        return app
            .get('/:id', async ({ params, db })=> {
                console.log('asdasd', params.id);
                const question = await db.question.findUnique({
                    where : { id : Number(params.id) }
                })

                if(question == null)
                    return { result : false };
                else
                    return { result : true, question };
            })
            .get('/all', async ({ db })=> {
                const questionList = await db.question.findMany();
                if(questionList.length === 0)
                    return { result : false };
                return { result : true, questionList };
            })
            .post('', async ({ body, db, jwt, cookie : { auth } })=> {
                const obj  = await jwt.verify(auth);
                if(!obj) {
                    return false;
                } else {
                    const {title, content} = body;
                    const result = await db.question.create({
                        data : { title, content, userId : Number(obj.userid) }
                    });
                    if(result != null)
                        return true;
                    else
                        return false;
                }
            }, {
                body : questionDTO
            })
    })
    .listen(8000);

  console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
