export class CreateUserInput {
  readonly authUid?: string;

  readonly email?: string;

  readonly password?: string;

  readonly phone?: string;

  readonly emailTemplateParams?: Record<string, string>;

  readonly sendEmail?: boolean;

  readonly roleCode?: string;
}
