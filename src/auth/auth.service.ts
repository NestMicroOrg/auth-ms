import { Injectable, Logger } from '@nestjs/common';
import { prisma } from 'src/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import * as bycript from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from 'src/config';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async signJWT(payload: JwtPayload) {
        return this.jwtService.sign(payload);
    }

    async registerUser(registerUserDto: RegisterUserDto) {

        const { email, password, name } = registerUserDto;

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })

            if (user) {
                throw new RpcException({
                    statusCode: 400,
                    message: 'User already exists'
                })
            }
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: bycript.hashSync(password, 10),
                    name
                }
            })

            const { password: _, ...result } = newUser;

            return {
                user: result,
                token: await this.signJWT(result)
            }

        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message
            })
        }
    }

    async loginUser(loginUserDto: LoginUserDto) {

        const { email, password } = loginUserDto;

        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })

            if (!user) {
                throw new RpcException({
                    statusCode: 400,
                    message: 'Invalid credentials'
                })
            }

            const isPasswordValid = bycript.compareSync(password, user.password);

            if (!isPasswordValid) {
                throw new RpcException({
                    statusCode: 400,
                    message: 'Invalid credentials'
                })
            }

            const { password: _, ...result } = user;

            return {
                user: result,
                token: await this.signJWT(result)
            }

        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message
            })
        }
    }

    async verifyToken(token: string) {
        try {

            const { sub, iat, exp, ...rest } = await this.jwtService.verify(token, {
                secret: envs.JWT_SECRET
            });

            console.log('returning', {
                user: rest,
                token: await this.signJWT(rest)
            })

            return {
                user: rest,
                token: await this.signJWT(rest)
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new RpcException({
                statusCode: 401,
                message: 'Invalid token'
            })
        }
    }

}
