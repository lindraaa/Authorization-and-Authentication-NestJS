import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/sign-up.dto';
import { BcryptService } from './hashing/bcrypt.service';
import { createResponse } from 'src/shared/utils/response.util';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from './interface/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly usersRespository:Repository<User>,
        private readonly bcryptService:BcryptService,
        private readonly jwtService:JwtService,
        
        @Inject(jwtConfig.KEY)//for env
        private readonly jwtConfiguration:ConfigType<typeof jwtConfig> 
    ){}
   
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
        return await this.generateTokens(user);

    }
    async generateTokens(user: User) {
        const [accessToken, refreshToken] = await Promise.all([
            this.signInToken<Partial<ActiveUserData>>(
            user.id,
            this.jwtConfiguration.accessTokenTTl,
            { email: user.email }),

            this.signInToken(
                user.id, 
                this.jwtConfiguration.refreshTokenTTl
            )
        ]);
        return createResponse("success", 'login successfully', { accessToken: accessToken, refreshToken, user });
    }

    async refreshTokens(refreshTokenDto:RefreshTokenDto){
        try{
        const {sub} =await this.jwtService.verifyAsync<Pick<ActiveUserData,'sub'>>(
            refreshTokenDto.refreshToken,{
                secret:this.jwtConfiguration.secret,
                audience:this.jwtConfiguration.audience,
                issuer:this.jwtConfiguration.issuer
            });
            const user = await this.usersRespository.findOneByOrFail({id:sub})
            return this.generateTokens(user);
        }catch{
            throw new UnauthorizedException();
        }
        }
    private async signInToken<T>(userId:number, expiresIn:number, payload?:T) {
        const payloadToken = {
            sub: userId,
            ...payload
           
        }
        const options = {
            audience: this.jwtConfiguration.audience,
            issuer: this.jwtConfiguration.issuer,
            secret: this.jwtConfiguration.secret,
            expiresIn: this.jwtConfiguration.accessTokenTTl
        };
        const res = await this.jwtService.signAsync(payloadToken, options);
        return res;
    }

    async findUserByEmail(email:string):Promise<User|null>{
        return await this.usersRespository.findOne({where:{email}})
    }
    async validateUser(email:string,password:string):Promise<User>{
        const user = await this.findUserByEmail(email)
        if(!user) throw new UnauthorizedException("Invalid username or password");
        
        const isMatch = await this.bcryptService.compare(password,user.password)
        if(!isMatch) throw new UnauthorizedException("Invalid username or password");
        
        return user;


    }
}
