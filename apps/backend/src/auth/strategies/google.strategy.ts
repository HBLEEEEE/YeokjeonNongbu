import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile']
    });
  }

  async validate(
    profile: { emails?: { value: string }[]; displayName: string },
    done: VerifyCallback
  ): Promise<void> {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    const user = { email, name };
    done(null, user);
  }
}
