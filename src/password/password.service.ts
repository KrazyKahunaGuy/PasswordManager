import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Password, Prisma } from '@prisma/client'

@Injectable()
export class PasswordService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.PasswordCreateInput): Promise<Password> {
    return this.prisma.password.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PasswordWhereUniqueInput;
    where?: Prisma.PasswordWhereInput;
    orderBy?: Prisma.PasswordOrderByWithRelationInput;
  }): Promise<Password[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.password.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(passwordWhereUniqueInput: Prisma.PasswordWhereUniqueInput): Promise<Password | null> {
    return this.prisma.password.findUnique({
      where: passwordWhereUniqueInput
    });
  }

  async findUnique(passwordWhereInput: Prisma.PasswordWhereInput): Promise<Password | null> {
    return this.prisma.password.findFirst({
      where: {
        AND: [
          { url: passwordWhereInput.url },
          { username: passwordWhereInput.username }
        ]
      }
    })
  }

  async update(params: {
    where: Prisma.PasswordWhereUniqueInput;
    data: Prisma.PasswordUpdateInput;
  }): Promise<Password> {
    const { where, data } = params;
    return this.prisma.password.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.PasswordWhereUniqueInput): Promise<Password> {
    return this.prisma.password.delete({
      where,
    });
  }
}
