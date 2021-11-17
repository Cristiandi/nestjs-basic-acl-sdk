import { BasicACLOptions } from './basic-acl.interfaces';
import { ChangeEmailInput } from './dto/change-email-input.dto';
import { ChangePasswordInput } from './dto/change-password-input.dto';
import { ChangePhoneInput } from './dto/change-phone-input.dto';
import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { GetUserInput } from './dto/get-user-uid-input.dto';
import { SendResetPasswordEmailInput } from './dto/send-reset-password-email-input.dto';
export declare class BasicAclService {
    private readonly options;
    private graphQLClient;
    constructor(options: BasicACLOptions);
    private initGraphQLClient;
    createUser(input: CreateUserInput): Promise<any>;
    getUser(input: GetUserInput): Promise<any>;
    sendResetPasswordEmail(input: SendResetPasswordEmailInput): Promise<any>;
    changeEmail(input: ChangeEmailInput): Promise<any>;
    changePassword(input: ChangePasswordInput): Promise<any>;
    changePhone(input: ChangePhoneInput): Promise<any>;
    deleteUser(input: GetUserInput): Promise<any>;
    checkPermission(input: CheckPermissionInput): Promise<any>;
}
