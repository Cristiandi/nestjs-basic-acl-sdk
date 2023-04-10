import { Inject, Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

import {
  BASIC_ACL_CONFIG_TOKEN,
  BASIC_ACL_API_BASE_URL,
} from './basic-acl.constants';

import { BasicACLOptions } from './basic-acl.interfaces';

import { CreateUserInput } from './dto/create-user-input.dto';
import { CreateUserOutput } from './dto/create-user-output.dto';
import { GetUserInput } from './dto/get-user-uid-input.dto';
import { GetUserOutput } from './dto/get-user-output.dto';
import { SendResetPasswordEmailInput } from './dto/send-reset-password-email-input.dto';
import { SendResetPasswordOutput } from './dto/send-reset-password-output.dto';
import { ChangeEmailInput } from './dto/change-email-input.dto';
import { ChangeEmailOutput } from './dto/change-email-output.dto';
import { ChangePasswordInput } from './dto/change-password-input.dto';
import { ChangePasswordOutput } from './dto/change-password-output.dto';
import { ChangePhoneInput } from './dto/change-phone-input.dto';
import { ChangePhoneOutput } from './dto/change-phone-output.dto';
import { DeleteUserOutput } from './dto/delete-user-output.dto';
import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CheckPermissionOutput } from './dto/check-permission-output.dto';
import { AssignRoleInput } from './dto/assign-user-role-input.dto';
import { AssignRoleOutput } from './dto/assign-role-output.dto';
import { UnassignRoleInput } from './dto/unassign-user-role-input.dto';
import { UnassignUserRoleOutput } from './dto/unassign-user-role-output.dto';
import { GetUsersByAuthUidsInput } from './dto/get-users-by-auth-uids-input.dto';
import { GetUsersByAuthUidsOutput } from './dto/get-users-by-auth-uids-output.dto';

@Injectable()
export class BasicAclService {
  private graphQLClient: GraphQLClient;

  constructor(
    @Inject(BASIC_ACL_CONFIG_TOKEN) private readonly options: BasicACLOptions,
  ) {
    this.graphQLClient = this.initGraphQLClient();
  }

  private initGraphQLClient() {
    const { accessKey } = this.options;

    const graphQLClient = new GraphQLClient(
      BASIC_ACL_API_BASE_URL + 'graphql',
      {
        headers: {
          'access-key': accessKey,
        },
      },
    );

    return graphQLClient;
  }

  public async createUser(input: CreateUserInput): Promise<CreateUserOutput> {
    const mutation = gql`
      mutation createUser(
        $companyUid: String!
        $authUid: String
        $email: String
        $phone: String
        $password: String
        $roleCode: String
        $sendEmail: Boolean
        $emailTemplateParams: JSONObject
      ) {
        createUser(
          createUserInput: {
            companyUid: $companyUid
            authUid: $authUid
            email: $email
            phone: $phone
            password: $password
            roleCode: $roleCode
            sendEmail: $sendEmail
            emailTemplateParams: $emailTemplateParams
          }
        ) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const { companyUid } = this.options;

    const {
      authUid,
      email,
      password,
      phone,
      roleCode,
      sendEmail,
      emailTemplateParams,
    } = input;

    const variables = {
      companyUid,
      authUid,
      email,
      phone,
      password,
      roleCode,
      sendEmail,
      emailTemplateParams,
    };

    const { createUser } = await this.graphQLClient.request<any>(
      mutation,
      variables,
    );

    return createUser;
  }

  public async getUser(input: GetUserInput): Promise<GetUserOutput> {
    const query = gql`
      query getOneUser($authUid: String!) {
        getOneUser(getOneUserInput: { authUid: $authUid }) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
          assignedRoles {
            role {
              code
              name
            }
          }
        }
      }
    `;

    const { authUid } = input;

    const variables = {
      authUid,
    };

    const data = await this.graphQLClient.request<any>(query, variables);

    const { getOneUser } = data;

    return getOneUser;
  }

  public async sendResetPasswordEmail(
    input: SendResetPasswordEmailInput,
  ): Promise<SendResetPasswordOutput> {
    const mutation = gql`
      mutation sendResetPasswordEmail(
        $companyUid: String!
        $email: String!
        $emailTemplateParams: JSONObject
      ) {
        sendResetUserPasswordEmail(
          sendResetUserPasswordEmailInput: {
            companyUid: $companyUid
            email: $email
            emailTemplateParams: $emailTemplateParams
          }
        ) {
          message
        }
      }
    `;

    const { companyUid } = this.options;
    const { email, emailTemplateParams } = input;

    const variables = {
      companyUid,
      email,
      emailTemplateParams,
    };

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { sendResetUserPasswordEmail } = data;

    return sendResetUserPasswordEmail;
  }

  public async changeEmail(
    input: ChangeEmailInput,
  ): Promise<ChangeEmailOutput> {
    const mutation = gql`
      mutation changeUserEmail(
        $authUid: String!
        $email: String!
        $emailTemplateParams: JSONObject
      ) {
        changeUserEmail(
          changeUserEmailInput: {
            authUid: $authUid
            email: $email
            emailTemplateParams: $emailTemplateParams
          }
        ) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const { authUid, email, emailTemplateParams } = input;

    const variables = {
      authUid,
      email,
      emailTemplateParams,
    };

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { changeUserEmail } = data;

    return changeUserEmail;
  }

  public async changePassword(
    input: ChangePasswordInput,
  ): Promise<ChangePasswordOutput> {
    const mutation = gql`
      mutation changeUserPassword(
        $authUid: String!
        $oldPassword: String!
        $newPassword: String!
        $emailTemplateParams: JSONObject
      ) {
        changeUserPassword(
          changeUserPasswordInput: {
            authUid: $authUid
            oldPassword: $oldPassword
            newPassword: $newPassword
            emailTemplateParams: $emailTemplateParams
          }
        ) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const { authUid, oldPassword, newPassword, emailTemplateParams } = input;

    const variables = {
      authUid,
      oldPassword,
      newPassword,
      emailTemplateParams,
    };

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { changeUserPassword } = data;

    return changeUserPassword;
  }

  public async changePhone(
    input: ChangePhoneInput,
  ): Promise<ChangePhoneOutput> {
    const mutation = gql`
      mutation changeUserPhone($authUid: String!, $phone: String!) {
        changeUserPhone(
          changeUserPhoneInput: { authUid: $authUid, phone: $phone }
        ) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const { authUid, phone } = input;

    const variables = {
      authUid,
      phone,
    };

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { changeUserPhone } = data;

    return changeUserPhone;
  }

  public async deleteUser(input: GetUserInput): Promise<DeleteUserOutput> {
    const mutation = gql`
      mutation deleteUser($authUid: String!) {
        deleteUser(getOneUserInput: { authUid: $authUid }) {
          id
          authUid
          email
          phone
          createdAt
          updatedAt
        }
      }
    `;

    const { authUid } = input;

    const variables = {
      authUid,
    };

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { deleteUser } = data;

    return deleteUser;
  }

  public async checkPermission(
    input: CheckPermissionInput,
  ): Promise<CheckPermissionOutput> {
    const query = gql`
      query checkPermission(
        $companyUid: String!
        $permissionName: String!
        $token: String
        $apiKey: String
      ) {
        checkPermission(
          checkPermissionInput: {
            companyUid: $companyUid
            permissionName: $permissionName
            token: $token
            apiKey: $apiKey
          }
        ) {
          id
          uid
          name
          allowed
        }
      }
    `;

    const { companyUid } = this.options;
    const { permissionName, token, apiKey } = input;

    const variables = {
      companyUid,
      permissionName,
      token,
      apiKey,
    };

    const data = await this.graphQLClient.request<any>(query, variables);

    const { checkPermission } = data;

    return checkPermission;
  }

  public async assignRole(input: AssignRoleInput): Promise<AssignRoleOutput> {
    const { companyUid } = this.options;
    const { authUid, roleUid, roleCode } = input;

    if ((!roleUid && !roleCode) || (roleUid && roleCode)) {
      throw new Error('you must provide roleUid OR roleCode');
    }

    const mutation = gql`
      mutation assignUserRole(
        $userAuthUid: String!
        $roleUid: String
        $companyUid: String
        $roleCode: String
      ) {
        assignUserRole(
          assignUserRoleInput: {
            userAuthUid: $userAuthUid
            roleUid: $roleUid
            companyUid: $companyUid
            roleCode: $roleCode
          }
        ) {
          id
        }
      }
    `;

    let variables;

    if (roleUid) {
      variables = {
        userAuthUid: authUid,
        roleUid,
      };
    } else {
      variables = {
        userAuthUid: authUid,
        companyUid,
        roleCode,
      };
    }

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { assignUserRole } = data;

    return assignUserRole;
  }

  public async unassignRole(
    input: UnassignRoleInput,
  ): Promise<UnassignUserRoleOutput> {
    const { companyUid } = this.options;
    const { authUid, roleUid, roleCode } = input;

    if ((!roleUid && !roleCode) || (roleUid && roleCode)) {
      throw new Error('you must provide roleUid OR roleCode');
    }

    const mutation = gql`
      mutation unassignUserRole(
        $userAuthUid: String!
        $roleUid: String
        $companyUid: String
        $roleCode: String
      ) {
        unassignUserRole(
          unassignUserRoleInput: {
            userAuthUid: $userAuthUid
            roleUid: $roleUid
            companyUid: $companyUid
            roleCode: $roleCode
          }
        ) {
          id
        }
      }
    `;

    let variables;

    if (roleUid) {
      variables = {
        userAuthUid: authUid,
        roleUid,
      };
    } else {
      variables = {
        userAuthUid: authUid,
        companyUid,
        roleCode,
      };
    }

    const data = await this.graphQLClient.request<any>(mutation, variables);

    const { unassignUserRole } = data;

    return unassignUserRole;
  }

  public async getUsersByAuthUids(
    input: GetUsersByAuthUidsInput,
  ): Promise<GetUsersByAuthUidsOutput[]> {
    const query = gql`
      query getUsersByAuthUids($authUids: [String!]!) {
        getUsersByAuthUids(getUsersByAuthUidsInput: { authUids: $authUids }) {
          id
          authUid
          email
          phone
          assignedRoles {
            role {
              id
              uid
              code
              name
              createdAt
              updatedAt
            }
          }
        }
      }
    `;

    const { authUids } = input;

    const variables = {
      authUids,
    };

    const data = await this.graphQLClient.request<any>(query, variables);

    const { getUsersByAuthUids } = data;

    return getUsersByAuthUids;
  }
}
