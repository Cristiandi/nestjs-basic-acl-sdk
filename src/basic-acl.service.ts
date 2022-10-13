import { Inject, Injectable } from '@nestjs/common';
import { GraphQLClient, gql } from 'graphql-request';

import {
  BASIC_ACL_CONFIG_TOKEN,
  BASIC_ACL_API_BASE_URL,
} from './basic-acl.constants';

import { BasicACLOptions } from './basic-acl.interfaces';
import { AssignRoleInput } from './dto/assign-user-role-input.dto';

import { ChangeEmailInput } from './dto/change-email-input.dto';
import { ChangePasswordInput } from './dto/change-password-input.dto';
import { ChangePhoneInput } from './dto/change-phone-input.dto';
import { CheckPermissionInput } from './dto/check-permission-input.dto';
import { CreateUserInput } from './dto/create-user-input.dto';
import { GetUserInput } from './dto/get-user-uid-input.dto';
import { SendResetPasswordEmailInput } from './dto/send-reset-password-email-input.dto';

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

  public async createUser(input: CreateUserInput) {
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

    const { createUser } = await this.graphQLClient.request(
      mutation,
      variables,
    );

    return createUser;
  }

  public async getUser(input: GetUserInput) {
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

    const data = await this.graphQLClient.request(query, variables);

    const { getOneUser } = data;

    return getOneUser;
  }

  public async sendResetPasswordEmail(input: SendResetPasswordEmailInput) {
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

    const data = await this.graphQLClient.request(mutation, variables);

    const { sendResetUserPasswordEmail } = data;

    return sendResetUserPasswordEmail;
  }

  public async changeEmail(input: ChangeEmailInput) {
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

    const data = await this.graphQLClient.request(mutation, variables);

    const { changeUserEmail } = data;

    return changeUserEmail;
  }

  public async changePassword(input: ChangePasswordInput) {
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
          company {
            id
          }
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

    const data = await this.graphQLClient.request(mutation, variables);

    const { changeUserPassword } = data;

    return changeUserPassword;
  }

  public async changePhone(input: ChangePhoneInput) {
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

    const data = await this.graphQLClient.request(mutation, variables);

    const { changeUserPhone } = data;

    return changeUserPhone;
  }

  public async deleteUser(input: GetUserInput) {
    const mutation = gql`
      mutation deleteUser($authUid: String!) {
        deleteUser(getOneUserInput: { authUid: $authUid }) {
          id
          authUid
          email
          phone
        }
      }
    `;

    const { authUid } = input;

    const variables = {
      authUid,
    };

    const data = await this.graphQLClient.request(mutation, variables);

    const { deleteUser } = data;

    return deleteUser;
  }

  public async checkPermission(input: CheckPermissionInput) {
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

    const data = await this.graphQLClient.request(query, variables);

    const { checkPermission } = data;

    return checkPermission;
  }

  public async assignRole(input: AssignRoleInput) {
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

    const { companyUid } = this.options;
    const { authUid, roleUid, roleCode } = input;

    if ((!roleUid && !roleCode) || (roleUid && roleCode)) {
      throw new Error('you must provide roleUid OR roleCode');
    }

    const variables = {
      authUid,
      roleUid,
      companyUid: roleUid ? companyUid : undefined,
      roleCode,
    };

    const data = await this.graphQLClient.request(mutation, variables);

    const { assignUserRole } = data;

    return assignUserRole;
  }
}
