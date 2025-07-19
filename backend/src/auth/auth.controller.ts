import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '@/user/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string }> {
    return this.authService.register(registerDto);
  }

  // @Post('login')
  // @HttpCode(HttpStatus.OK)
  // async login(
  //   @Body() loginDto: LoginDto,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<{ message: string }> {
  //   const { accessToken } = await this.authService.login(loginDto);
  //   res.cookie('access_token', accessToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV === 'production',
  //     maxAge: 24 * 60 * 60 * 1000,
  //   });
  //   return { message: 'Login successful' };
  // }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.authService.login(loginDto);

    // Đặt HttpOnly Cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Không thể truy cập bằng JavaScript phía client
      secure: process.env.NODE_ENV === 'production', // Chỉ gửi qua HTTPS trong môi trường production
      sameSite: 'strict', // Ngăn chặn tấn công CSRF (Cross-Site Request Forgery)
      maxAge: 24 * 60 * 60 * 1000, // Thời gian sống của cookie: 1 ngày (tính bằng miliseconds)
      // domain: 'your-domain.com', // Cần đặt nếu FE và BE khác domain, thường không cần với localhost
      // path: '/', // Đường dẫn mà cookie này hợp lệ
    });

    return { message: 'Đăng nhập thành công!' }; // Trả về thông báo thành công thay vì token
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: AuthenticatedRequest) {
    const { password, ...result } = req.user.toObject();
    console.log('lay profile', result);
    return result;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    console.log('dang xuat thanh cong');
    return { message: 'Đăng xuất thành công!' };
  }
}
