export class ChangeEmailInput {
  readonly authUid: string;

  readonly email: string;

  readonly emailTemplateParams?: Record<string, string>;
}
