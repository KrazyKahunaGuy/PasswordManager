import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Password, Prisma } from '@prisma/client'

@Injectable()
export class PasswordService {
  constructor(private readonly prisma: PrismaService) { }

  async create(data: Prisma.PasswordCreateInput) {
    // Query the database to check if url and username is already in use.
    const urlUsernameUserIdExists = await this.prisma.password.findUnique({
      where: {
        url_username_userId: {
          url: String(data.url),
          username: String(data.username),
          userId: Number(data.user.connect?.id)
        }
      }
    })
  
    if (urlUsernameUserIdExists) {
      throw new ConflictException('Login already exists');
    }

    return await this.prisma.password.create({
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
    const password = await this.prisma.password.findUnique({
      where: passwordWhereUniqueInput
    });

    // Check if result is null
    if (!password) {
      throw new NotFoundException('Password not found');
    }

    return password;
  }

  async update(params: {
    where: Prisma.PasswordWhereUniqueInput;
    data: Prisma.PasswordUpdateInput;
  }): Promise<Password> {
    const { where, data } = params;
    // Query the database to check if a password with that id exists.
    const passwordExists = await this.findOne({ id: where.id });

    // Check if passwordExists is null
    if (!passwordExists) {
      throw new NotFoundException('Password not found');
    }
    const password = await this.prisma.password.update({
      where,
      data,
    });

    // Check if the constant passwordExists is null.
    if (!password) {
      throw new NotFoundException('Password not Found');
    }

    return password;
  }

  async remove(where: Prisma.PasswordWhereUniqueInput): Promise<Password> {
    // Query the database to check if a password with that id exists.
    const passwordExists = await this.findOne({ id: where.id });

    // Check if the constant passwordExists is null.
    if (!passwordExists) {
      throw new NotFoundException('Password not Found');
    }

    const password = await this.prisma.password.delete({
      where,
    });

    return password;
  }
}
