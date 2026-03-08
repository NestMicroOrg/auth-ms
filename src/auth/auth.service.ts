import { Injectable, Logger } from '@nestjs/common';
import { prisma } from 'src/prisma.service';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor() { }

}
