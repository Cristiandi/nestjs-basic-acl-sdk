"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAclService = void 0;
const common_1 = require("@nestjs/common");
const graphql_request_1 = require("graphql-request");
const basic_acl_constants_1 = require("./basic-acl.constants");
let BasicAclService = class BasicAclService {
    constructor(options) {
        this.options = options;
        this.graphQLClient = this.initGraphQLClient();
    }
    initGraphQLClient() {
        const { accessKey } = this.options;
        const graphQLClient = new graphql_request_1.GraphQLClient(basic_acl_constants_1.BASIC_ACL_API_BASE_URL + 'graphql', {
            headers: {
                'access-key': accessKey,
            },
        });
        return graphQLClient;
    }
    async createUser(input) {
        const mutation = (0, graphql_request_1.gql) `
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
        const { authUid, email, password, phone, roleCode, sendEmail, emailTemplateParams, } = input;
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
        const { createUser } = await this.graphQLClient.request(mutation, variables);
        return createUser;
    }
    async getUser(input) {
        const query = (0, graphql_request_1.gql) `
      query getOneUser($authUid: String!) {
        getOneUser(getOneUserInput: { authUid: $authUid }) {
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
        const data = await this.graphQLClient.request(query, variables);
        const { getOneUser } = data;
        return getOneUser;
    }
    async sendResetPasswordEmail(input) {
        const mutation = (0, graphql_request_1.gql) `
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
    async changeEmail(input) {
        const mutation = (0, graphql_request_1.gql) `
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
    async changePassword(input) {
        const mutation = (0, graphql_request_1.gql) `
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
    async changePhone(input) {
        const mutation = (0, graphql_request_1.gql) `
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
    async checkPermission(input) {
        const query = (0, graphql_request_1.gql) `
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
};
BasicAclService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(basic_acl_constants_1.BASIC_ACL_CONFIG_TOKEN)),
    __metadata("design:paramtypes", [Object])
], BasicAclService);
exports.BasicAclService = BasicAclService;
//# sourceMappingURL=basic-acl.service.js.map