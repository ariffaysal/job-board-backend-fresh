import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🔵 GUARD: Checking authentication...');
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('🔵 GUARD: User:', user);
    console.log('🔵 GUARD: Error:', err);
    console.log('🔵 GUARD: Info:', info);

    if (err || !user) {
      console.error('❌ GUARD: Authentication failed');
      throw err || new UnauthorizedException('Invalid token');
    }

    console.log('✅ GUARD: Authentication successful');
    return user;
  }
}