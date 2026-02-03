import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-super-secret-key-change-this-in-production',
    });
  }

  async validate(payload: any) {
    console.log('🔵 STRATEGY: Validating token payload:', payload);
    return { userId: payload.sub, email: payload.email };
  }
}