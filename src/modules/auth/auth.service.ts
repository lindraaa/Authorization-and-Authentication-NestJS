import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { BcryptService } from './hashing/bcrypt.service';
import { createResponse } from 'src/shared/utils/response.util';
import { SignInDto } from './dto/sign-in.dto';
//Self construct
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly usersRespository:Repository<User>,
        private readonly bcryptService:BcryptService,
    ){}
    
    async findUserByEmail(email:string):Promise<User|null>{
        return this.usersRespository.findOne({where:{email}})
    }
    async validateUser(email:string,password:string):Promise<User>{
        const user = await this.findUserByEmail(email)
        if(!user) throw new UnauthorizedException("Invalid username or password");
        
        const isMatch = await this.bcryptService.compare(password,user.password)
        if(!isMatch) throw new UnauthorizedException("Invalid username or password");
        
        return user;


    }

    async signUp(signUpDto:SignUpDto){
        const existingUser = await this.findUserByEmail(signUpDto.email)
        if(existingUser) throw new ConflictException("Email already exits");

        const user = new User();
        user.email = signUpDto.email;
        user.password = await this.bcryptService.hash(signUpDto.password)
        const res = await this.usersRespository.save(user)
        return createResponse('success','User registered successfully',res)

    }
    async sigIn(signInDto:SignInDto){
        const user = await this.validateUser(signInDto.email,signInDto.password)
        return createResponse("success",'login successfully',user);

    }
}
