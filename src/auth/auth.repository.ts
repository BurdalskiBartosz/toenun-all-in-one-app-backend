// Moved this code from @auth/prisma-adapter due to error:

// (..)/dist/auth/auth.service.js:15
// const prisma_adapter_1 = require("@auth/prisma-adapter");
//                          ^

// Error [ERR_REQUIRE_ESM]: require() of ES Module (..)/node_modules/@auth/prisma-adapter/index.js from (..)/dist/auth/auth.service.js not supported.
// Instead change the require of index.js in (..)/dist/auth/auth.service.js to a dynamic import() which is available in all CommonJS modules.
//     at Object.<anonymous> ((..)/dist/auth/auth.service.js:15:26) {
//   code: 'ERR_REQUIRE_ESM'
// }

import { Injectable } from '@nestjs/common';
import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from '@auth/core/adapters';

import { PrismaService } from '../prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: PrismaService) {}

  async createUser({ id, ...data }: AdapterUser) {
    return await this.db.user.create({ data });
  }

  async getUser(id: string) {
    return await this.db.user.findUnique({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.db.user.findUnique({ where: { email } });
  }

  async getUserByAccount(provider_providerAccountId: {
    providerAccountId: string;
    provider: string;
  }) {
    const account = await this.db.account.findUnique({
      where: { provider_providerAccountId },
      select: { user: true },
    });
    return (account?.user as AdapterUser) ?? null;
  }

  async updateUser({ id, ...data }) {
    return await this.db.user.update({ where: { id }, data });
  }

  async deleteUser(id: string) {
    return await this.db.user.delete({ where: { id } });
  }

  async linkAccount(data: AdapterAccount) {
    return await this.db.account.create({ data });
  }

  async unlinkAccount(provider_providerAccountId: {
    providerAccountId: string;
    provider: string;
  }) {
    return await this.db.account.delete({
      where: { provider_providerAccountId },
    });
  }

  async getSessionAndUser(sessionToken: string) {
    const userAndSession = await this.db.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });
    if (!userAndSession) return null;
    const { user, ...session } = userAndSession;
    return { user, session } as {
      user: AdapterUser;
      session: AdapterSession;
    };
  }

  async createSession(data: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) {
    return await this.db.session.create({ data });
  }

  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    return await this.db.session.update({
      where: { sessionToken: session.sessionToken },
      data: session,
    });
  }

  async deleteSession(sessionToken: string) {
    return await this.db.session.delete({ where: { sessionToken } });
  }

  async createVerificationToken(data: VerificationToken) {
    const verificationToken = await this.db.verificationToken.create({ data });

    return verificationToken;
  }
  async useVerificationToken(identifier_token: {
    identifier: string;
    token: string;
  }) {
    try {
      const verificationToken = await this.db.verificationToken.delete({
        where: { identifier_token },
      });

      return verificationToken;
    } catch (error) {
      // If token already used/deleted, just return null
      // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
      if ((error as PrismaClientKnownRequestError).code === 'P2025')
        return null;
      throw error;
    }
  }
}
