# Nestjs Basic ACL SDK

# Table of Contents
- [Nestjs Basic ACL SDK](#nestjs-basic-acl-sdk)
- [Table of Contents](#table-of-contents)
- [Description](#description)
- [Motivation](#motivation)
- [Requirements](#requirements)
- [Usage](#usage)
    - [Install](#install)
    - [Module Initialization](#module-initialization)
    - [Decorators](#decorators)
    - [Guard](#guard)
    - [Users synchronization](#users-synchronization)

# Description
This nestjs module offers a simple way to use some functionalities from the [basic-acl-api](https://github.com/Cristiandi/basic-acl-api).

# Motivation
Making a direct fully working integration with [basic-acl-api](https://github.com/Cristiandi/basic-acl-api) could be easy, but, this is an intent to make that process even easier and standar.

# Requirements
1. Have a firebase project.
2. The service account json from firebase. [more info](https://firebase.google.com/support/guides/service-accounts)
3. The firebase json config. [more info](https://firebase.google.com/docs/web/setup)
4. A created account in the [Basic ACL Project](https://basic-acl-web-dev.herokuapp.com/)

# Usage
## Install
`npm i nestjs-basic-acl-sdk -S`

OR

`yarn add nestjs-basic-acl-sdk`

## Module Initialization
Import and add `BasicAclModule` it to the imports array of module for which you would like to discover handlers. It may make sense for your application to do this in a shared module or to re-export it so it can be used across modules more easily.
You can check this [docs](https://docs.nestjs.com/modules) in order to get more information about modules.

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { BasicAclModule } from 'nestjs-basic-acl-sdk';

import appConfig from '../config/app.config';

import { AuthorizationGuard } from './guards/authorization.guard';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    BasicAclModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          companyUid: configService.get<string>('config.acl.companyUid'),
          accessKey: configService.get<string>('config.acl.accessKey'),
        };
      }
    })
   ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class CommonModule { }
```

_In the axample we're using the `registerAsync` method but you can also use the `register` method._

## Decorators
One important part it's the ability to indicate the name of the resource (to accomplish a resource check) or if the resource is public (to pass by without resource checking).

```typescript
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { PermissionName, Public } from 'nestjs-basic-acl-sdk';

import { User } from './user.entity';

import { UsersService } from './users.service';

import { CreateUserInput } from './dto/create-user-input';
import { GetUserByAuthUidInput } from './dto/get-uset-by-auth-uid-input.dto';
import { ResetUserPasswordInput } from './dto/reset-user-password-input.dto';
import { UpdateUserInput } from './dto/update-user-input.dto';
import { ChangeUserEmailInput } from './dto/change-user-email-input.dto';
import { ChangeUserPasswordInput } from './dto/change-user-password-input.dto';
import { ChangeUserPhoneInput } from './dto/change-user-phone-input.dto';
import { CreateUserFromAuthUidInput } from './dto/create.user-from-auth-uid.input.dto';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @Public()
  @Mutation(() => User, { name: 'createUser' })
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.service.create(createUserInput);
  }

  @Public()
  @Mutation(() => User, { name: 'createUserFromAuthUid' })
  createUserFromAuthUid(
    @Args('createUserFromAuthUidInput') createUserFromAuthUidInput: CreateUserFromAuthUidInput
  ): Promise<User> {
    return this.service.createFromAuthUid(createUserFromAuthUidInput);
  }

  @PermissionName('users:handle')
  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.service.update(updateUserInput);
  }

  @PermissionName('users:handle')
  @Mutation(() => User, { name: 'changeUserEmail' })
  changeUserEmail(
    @Args('changeUserEmailInput') changeUserEmailInput: ChangeUserEmailInput,
  ): Promise<User> {
    return this.service.changeEmail(changeUserEmailInput);
  }

  @PermissionName('users:handle')
  @Mutation(() => User, { name: 'changeUserPassword' })
  changeUserPassword(
    @Args('changeUserPasswordInput')
    changeUserPasswordInput: ChangeUserPasswordInput,
  ): Promise<User> {
    return this.service.changePassword(changeUserPasswordInput);
  }

  @PermissionName('users:handle')
  @Mutation(() => User, { name: 'changeUserPhone' })
  changeUserPhone(
    @Args('changeUserPhoneInput') changeUserPhoneInput: ChangeUserPhoneInput,
  ): Promise<User> {
    return this.service.changePhone(changeUserPhoneInput);
  }

  @PermissionName('users:read')
  @Query(() => User, { name: 'getUserByAuthUid' })
  getUserByAuthUid(
    @Args('getUserByAuthUidInput') getUserByAuthUidInput: GetUserByAuthUidInput,
  ): Promise<User> {
    return this.service.getByAuthuid(getUserByAuthUidInput);
  }

  @Public()
  @Mutation(() => String, { name: 'resetUserPassword' })
  resetUserPassword(
    @Args('resetUserPasswordInput')
    resetUserPasswordInput: ResetUserPasswordInput,
  ): Promise<string> {
    return this.service.resetPassword(resetUserPasswordInput);
  }
}
```

_as you can see we're using `PermissionName` decorator to indicate the name of the resource and the `Public` decorator to indicate that resource it's public_

## Guard
The other important aspect it's the custom implementation of a guard, in favor of the permission check.

You can check this [docs](https://docs.nestjs.com/guards) in order to get more information about guards.

```typescript
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  Logger,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BasicAclService } from 'nestjs-basic-acl-sdk';

import appConfig from '../../config/app.config';

import { IS_PUBLIC_KEY } from 'nestjs-basic-acl-sdk';
import { PERMISSION_NAME_KEY } from 'nestjs-basic-acl-sdk';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    private readonly basicAclService: BasicAclService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<string>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) return true;

    const ctx = GqlExecutionContext.create(context);
    const { req: request } = ctx.getContext();

    const authorizationHeader: string = request.headers['Authorization'] || request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('authorization header not found.');
    }

    const tokenArray = authorizationHeader.split(' ');
    if (tokenArray.length !== 2) {
      throw new UnauthorizedException('invalid token format.');
    }

    const token = tokenArray[1];

    if (!token) {
      throw new UnauthorizedException('token not found.');
    }

    const permissionName = this.reflector.get<string>(PERMISSION_NAME_KEY, context.getHandler());

    if (!permissionName) {
      throw new InternalServerErrorException('acl slug not found.');
    }

    try {
      await this.basicAclService.checkPermission({
        token,
        permissionName,
      });

      return true;
    } catch (error) {
      Logger.error(`permission check error ${error.message}.`, AuthorizationGuard.name);
      throw new UnauthorizedException(error.message);
    }
  }
}
```

_so in that guard implementation we're getting the information from the decorators and also we're trying to get the token to make the permission check, using the `BasicAclService` (it's also included in the sdk)._

## Users synchronization
You probably noticed, the basic ACL is a system that needs to be well synchronized with the users in your own system to accomplish the permission verifications  and some other things, that why `BasicAclService` includes functions to create and get, update a user.

### Creating a user
```typescript
public async create(createUserInput: CreateUserInput): Promise<User> {
    const { phone, email, fullName, password } = createUserInput;

    const existingByPhone = await this.getByOneField({
      field: 'phone',
      value: phone,
      checkExisting: false,
    });

    if (existingByPhone) {
      throw new PreconditionFailedException(`already exist an user with the phone ${phone}.`);
    }

    const existingByEmail = await this.getByOneField({
      field: 'email',
      value: email,
      checkExisting: false,
    });

    if (existingByEmail) {
      throw new PreconditionFailedException(`already exist an user with the email ${email}.`);
    }

    const aclUser = await this.basicAclService.createUser({
      email,
      password,
      phone: `+57${phone}`,
      roleCode: '02U', // TODO: use a parameter
      sendEmail: true,
      emailTemplateParams: {
        fullName,
      }
    });

    try {
      const { authUid } = aclUser;

      const created = this.repository.create({
        email,
        fullName,
        phone,
        authUid,
      });

      const saved = await this.repository.save(created);

      return saved;
    } catch (error) {
      await this.basicAclService.deleteUser({
        authUid: aclUser.authUid,
      });

      throw error;
    }
  }
```

Maybe it's possible the user was previously created at the front, using other provider like google, github and so on...
that's why you can use the `createUser` in this way:

```typescript
public async createFromAuthUid(
  createUserFromAuthUidInput: CreateUserFromAuthUidInput
): Promise<User> {
  const { authUid, email, fullName = 'No assigned', phone } = createUserFromAuthUidInput;

  const existing = await this.getByOneField({
    field: 'authUid',
    value: authUid,
    checkExisting: false
  });

  if (existing) {
    throw new PreconditionFailedException(`the user with authUid ${authUid} already exist.`);
  }

  const aclUser = await this.basicAclService.createUser({
    authUid,
    roleCode: '02U',// TODO: use a parameter
    sendEmail: true,
    emailTemplateParams: {
      fullName,
    }
  });

  try {
    const { authUid } = aclUser;

    const created = this.repository.create({
      email,
      fullName,
      phone,
      authUid,
    });

    const saved = await this.repository.save(created);

    return saved;
  } catch (error) {
    await this.basicAclService.deleteUser({
      authUid: aclUser.authUid,
    });

    throw error;
  }
}
```

_In these examples we're also using the `deleteUser` function when something goes wrong, but, it is up to you the way you implement the logic._

# Contribute
Please feel free to contribute, just open a issue or pr I'll be happy to review it.