import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserData } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) { }

  async create(data: Prisma.UserCreateInput): Promise<UserData> {
    const passwordHash = await this.hashPassword(data.password)
    data.password = passwordHash
    const newUser = await this.prisma.user.create({
      data,
    });
    const { password, token, ...user } = newUser;
    return user;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<UserData[]> {
    const { skip, take, cursor, where, orderBy } = params;
    const foundUsers = await this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });

    const users = foundUsers.map(({ password, token, ...rest }) => rest);
    return users;
  }

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<UserData | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
    if (foundUser) {
      const { password, token, ...user } = foundUser;
      return user;
    }
    return foundUser;
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<UserData> {
    const { where, data } = params;
    const updatedUser = await this.prisma.user.update({
      data,
      where,
    })

    const { password, token, ...user } = updatedUser;
    return user;
  }

  async remove(where: Prisma.UserWhereUniqueInput): Promise<UserData> {
    const deletedUser = await this.prisma.user.delete({
      where,
    });

    const { password, token, ...user } = deletedUser;
    return user;
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const saltOrRounds = +(this.configService.getOrThrow<number>('SALT_OR_ROUNDS'))
    const salt = await bcrypt.genSalt(saltOrRounds);

    const passwordHash = await bcrypt.hash(plainPassword, salt);
    return passwordHash;
  }
}
