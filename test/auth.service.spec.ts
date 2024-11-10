import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should throw a ConflictException if email already exists on register', async () => {
    prisma.user.findUnique = jest
      .fn()
      .mockReturnValueOnce({ id: 1, email: 'existing@example.com' });

    await expect(
      service.register({
        email: 'existing@example.com',
        password: 'pass123',
        name: 'Test',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'existing@example.com' },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
