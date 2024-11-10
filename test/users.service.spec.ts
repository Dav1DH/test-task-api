import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../src/users/users.service';
import { PrismaService } from '../src/prisma.service';
import { User } from '@prisma/client';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const userArray: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
    },
  ];

  const oneUser = userArray[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockImplementation((data) => {
                const newUser = { id: 2, ...data.data };
                return Promise.resolve(newUser);
              }),
              findMany: jest.fn().mockResolvedValue(userArray),
              findUnique: jest
                .fn()
                .mockImplementation(({ where: { id, email } }) => {
                  if (id) {
                    return userArray.find((user) => user.id === id) || null;
                  }
                  if (email) {
                    return (
                      userArray.find((user) => user.email === email) || null
                    );
                  }
                  return null;
                }),
              update: jest.fn().mockResolvedValue(oneUser),
              delete: jest.fn().mockResolvedValue(undefined),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };
    const expectedUser = { id: 2, ...createUserDto };

    await expect(service.create(createUserDto)).resolves.toEqual(expectedUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
    expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
  });

  it('should throw a ConflictException when email already exists', async () => {
    const createUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    await expect(service.create(createUserDto)).rejects.toThrow(
      ConflictException,
    );

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: createUserDto.email },
    });
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('should throw a NotFoundException when user not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(
      new NotFoundException(`User with ID 999 not found.`),
    );
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
  });
});
