import { User, UserDocument } from '@/user/schemas/user.schema';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          // Lấy token từ cookie có tên 'access_token'
          // req.cookies sẽ có sẵn sau khi cookie-parser được áp dụng
          if (
            req &&
            req.cookies &&
            typeof req.cookies.access_token === 'string'
          ) {
            return req.cookies.access_token;
          }
          return null; // Nếu không tìm thấy cookie, trả về null
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Invalid token or user not found');
    }
    return user;
  }
}
