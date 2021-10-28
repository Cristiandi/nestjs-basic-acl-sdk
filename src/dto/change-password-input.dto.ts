export class ChangePasswordInput {
  readonly authUid: string;

  readonly oldPassword: string;

  readonly newPassword: string;

  readonly emailTemplateParams?: Record<string, string>;
}
