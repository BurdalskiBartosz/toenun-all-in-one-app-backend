import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from '@auth/core/adapters';
import type { AuthService } from './auth.service';
import { Public } from 'src/decorators/Public';
import { AUTH_SERVICE } from './di-tokens';

@Public()
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() user: AdapterUser & { password?: string }) {
    return await this.authService.createUser(user);
  }

  @Get()
  async getUserByEmail(@Query('email') email: string) {
    return await this.authService.getUserByEmail(email);
  }

  @Get('account/:provider/:id')
  async getUserByAccount(
    @Param('id') id: string,
    @Param('provider') provider: string,
  ) {
    return await this.authService.getUserByAccount(id, provider);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.authService.getUser(id);
  }

  @Patch()
  async updateUser(
    @Body() user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>,
  ) {
    return await this.authService.updateUser(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.authService.deleteUser(id);
  }

  @Post('account')
  async linkAccount(@Body() account: AdapterAccount) {
    return await this.authService.linkAccount(account);
  }

  @Delete('account/:provider/:id')
  async unlinkAccount(
    @Param('id') id: string,
    @Param('provider') provider: string,
  ) {
    return await this.authService.unlinkAccount(id, provider);
  }

  @Post('session')
  async createSession(
    @Body() session: { sessionToken: string; userId: string; expires: Date },
  ) {
    return await this.authService.createSession(session);
  }

  @Get('session/:sessionToken')
  async getSessionAndUser(@Param('sessionToken') sessionToken: string) {
    return await this.authService.getSessionAndUser(sessionToken);
  }

  @Patch('session')
  async updateSession(
    @Body()
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    return await this.authService.updateSession(session);
  }

  @Delete('session/:sessionToken')
  async deleteSession(@Param('sessionToken') sessionToken: string) {
    return await this.authService.deleteSession(sessionToken);
  }

  @Post('verification')
  async createVerificationToken(@Body() verificationToken: VerificationToken) {
    return await this.authService.createVerificationToken(verificationToken);
  }

  @Patch('verification')
  async useVerificationToken(
    @Body() params: { identifier: string; token: string },
  ) {
    return await this.authService.useVerificationToken(params);
  }
}
