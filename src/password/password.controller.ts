import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Prisma, Password as PasswordModel } from '@prisma/client';
import { PasswordService } from './password.service';
import { Response } from '../response.interface';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) { }

  @Post()
  async create(@Body() passwordData: { url: string; username: string; password: string; userId: number; }): Promise<Response<PasswordModel>> {
    // Unpack values from the passwordData object and assign them.
    const { url, username, password, userId } = passwordData;

    // Query the database to check if url and username is already in use.
    const urlUsernameExists = await this.passwordService.findUnique({url, username});

    // Check if the constant urlUsernameExists is null.
    if (urlUsernameExists) {
      throw new ConflictException('Login already exists')
    }

    // Store the result from creating the user.
    const data = await this.passwordService.create({
      url,
      username,
      password,
      user: {
        connect: { id: userId },
      }
    });

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password created successfully',
      data: data,
    }
  }

  @Get()
  async findAll(): Promise<Response<PasswordModel[]>> {
    // Query the database to find all the stored passwords.
    const data = await this.passwordService.findAll({
      where: {}
    });

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Passwords found successfully',
      data: data,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<PasswordModel | null>> {
    // Query the database to find the password using their id.
    const data = await this.passwordService.findOne(
      { id: +id });

    // Check if the result is null.
    if (!data) {
      throw new NotFoundException('Password not found')
    }

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Password found successfully',
      data: data,
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() passwordUpdateInput: Prisma.PasswordUpdateInput): Promise<Response<PasswordModel>> {
    // Query the database to check if a password with that id exists.
    const passwordExists = await this.passwordService.findOne({ id: +id });

    // Check if the constant passwordExists is null.
    if (!passwordExists) {
      throw new NotFoundException('Password not Found');
    }

    // Query the database, then update the fields.
    const data = await this.passwordService.update({
      where: { id: +id },
      data: passwordUpdateInput,
    });

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User updated successfully',
      data: data,
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<PasswordModel>> {
    // Query the database to check if a password with that id exists.
    const passwordExists = await this.passwordService.findOne({ id: +id });

    // Check if the constant passwordExists is null.
    if (!passwordExists) {
      throw new NotFoundException('Password not Found');
    }

    // Query the database, then delete the row.
    const data = await this.passwordService.remove({
      id: +id,
    });

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User deleted successfully',
      data: data,
    }
  }
}
