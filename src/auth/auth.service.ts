import { Injectable, Logger } from '@nestjs/common';
import { prisma } from 'src/prisma.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import * as bycript from 'bcrypt'

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

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

            return {
                user: newUser,
                token: 'abc'
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
                token: 'abc'
            }

        } catch (error) {
            throw new RpcException({
                statusCode: 400,
                message: error.message
            })
        }
    }

}
