import { IsEmail, IsString, IsStrongPassword } from "class-validator";


export class RegisterUserDto {

    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsStrongPassword(
        { minLength: 8, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 },
        { message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols' }
    )
    password: string;
}