import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { instanceToPlain } from 'class-transformer';
import { SignInDto } from './dto/sign-in.dto';

@Controller('/api/v1/auth')
export class AuthController {
    constructor(private readonly authService:AuthService){}

    @Post('register')
    async signUp(@Body() signUpDto:SignUpDto){
        const response = await this.authService.signUp(signUpDto);
        return instanceToPlain(response);//want to remove password
    }

    @Post("login")
    async logIn(@Body() signInDto:SignInDto){
        const response = await this.authService.sigIn(signInDto)
        return instanceToPlain(response);

    }
}
