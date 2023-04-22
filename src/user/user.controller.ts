import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, NotFoundException, ConflictException, Query } from '@nestjs/common';
import { Prisma, User as UserModel } from '@prisma/client';
import { UserService } from './user.service';
import { Response } from '../response.interface';
import { UserData } from './user.interface';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async create(@Body() userData: { firstName?: string, lastName?: string, email: string, password: string }): Promise<Response<UserData>> {
    // Unpack values from the userData object and assign them.
    const { firstName, lastName, email, password } = userData;

    // Query the database to check if the email address is already in use.
    const emailExists = await this.userService.findOne({ email: email });

    // Check if the constant emailExists is null.
    if (emailExists) {
      throw new ConflictException('Email address already in use');
    }

    // Store the result from creating the user.
    const data = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Return the response.
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: data,
    }
  }

  @Get()
  async findAll(): Promise<Response<UserData[]>> {
    // Query the database to find all users and store the result.
    const data = await this.userService.findAll({
      where: {}
    });

    // Return the response.
    return {
      statusCode: HttpStatus.OK,
      message: 'Users found successfully',
      data: data,
    }
  }

  @Get('/byEmail')
  async findEmail(@Query('email') email: string): Promise<Response<UserData | null>> {
    // Query the database to find the user using their email and store the result.
    const data = await this.userService.findOne(
      { email: email });

    // Check if the result is null.
    if (!data) {
      throw new NotFoundException('User not found')
    }

    const { password, token, ...user } = data;

    // Return the response.
    return {
      statusCode: HttpStatus.OK,
      message: "User found successfully",
      data: user,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<UserData | null>> {
    // Query the database to find the user using their id and store the result.
    const data = await this.userService.findOne(
      { id: +id });

    // Check if the result is null.
    if (!data) {
      throw new NotFoundException('User not found')
    }

    const { password, token, ...user } = data;

    // Return the response.
    return {
      statusCode: HttpStatus.OK,
      message: "User found successfully",
      data: user,
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userUpdateInput: Prisma.UserUpdateInput): Promise<Response<UserData>> {
    // Query the database to check if a user with that id is present.
    const userExists = await this.userService.findOne({ id: +id });

    // Check if the constant userExists is null.
    if (!userExists) {
      throw new NotFoundException('User not found')
    }

    // Query the database, then update the fields.
    const data = await this.userService.update({
      where: { id: +id },
      data: userUpdateInput,
    });

    // Return the response.
    return {
      statusCode: HttpStatus.OK,
      message: "User updated successfully",
      data: data,
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<UserData>> {
    // Query the database to check if a user with that id is present.
    const userExists = await this.userService.findOne({ id: +id });

    // Check if the constant userExists is null.
    if (!userExists) {
      throw new NotFoundException('User not found')
    }

    // Query the database, then delete the row.
    const data = await this.userService.remove({
      id: +id,
    });

    // Return the response.
    return {
      statusCode: HttpStatus.OK,
      message: "User deleted successfully",
      data: data,
    }
  }
}
