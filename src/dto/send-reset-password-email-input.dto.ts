export class SendResetPasswordEmailInput {
  readonly email: string;

  readonly emailTemplateParams?: Record<string, string>;
}
