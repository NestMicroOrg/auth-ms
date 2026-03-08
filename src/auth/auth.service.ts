import { Injectable, Logger } from '@nestjs/common';
import { prisma } from 'src/prisma.service';
import { RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor() { }

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
                    password,
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

}
