import { Injectable } from '@nestjs/common';
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from '@auth/core/adapters';
import { AuthRepository } from './auth.repository';
import { Public } from 'src/decorators/Public';
import * as bcrypt from 'bcrypt';

@Public()
@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async createUser(user: AdapterUser & { password?: string }) {
    let data = user;

    if (user.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);

      data = { ...user, password: hashedPassword };
    }

    return await this.authRepository.createUser(data);
  }

  async getUserByEmail(email: string) {
    return await this.authRepository.getUserByEmail(email);
  }

  async getUserByAccount(id: string, provider: string) {
    return await this.authRepository.getUserByAccount({
      providerAccountId: id,
      provider,
    });
  }

  async getUser(id: string) {
    return await this.authRepository.getUser(id);
  }

  async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
    return await this.authRepository.updateUser(user);
  }

  async deleteUser(userId: string) {
    return await this.authRepository.deleteUser?.(userId);
  }

  async linkAccount(account: AdapterAccount) {
    return await this.authRepository.linkAccount(account);
  }

  async unlinkAccount(id: string, provider: string) {
    return await this.authRepository.unlinkAccount?.({
      providerAccountId: id,
      provider,
    });
  }

  async createSession(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) {
    return await this.authRepository.createSession(session);
  }

  async getSessionAndUser(sessionToken: string) {
    return await this.authRepository.getSessionAndUser(sessionToken);
  }

  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    return await this.authRepository.updateSession(session);
  }

  async deleteSession(sessionToken: string) {
    return await this.authRepository.deleteSession(sessionToken);
  }

  async createVerificationToken(verificationToken: VerificationToken) {
    return await this.authRepository.createVerificationToken?.(
      verificationToken,
    );
  }

  async useVerificationToken({
    identifier,
    token,
  }: {
    identifier: string;
    token: string;
  }) {
    return await this.authRepository.useVerificationToken?.({
      identifier,
      token,
    });
  }
}
