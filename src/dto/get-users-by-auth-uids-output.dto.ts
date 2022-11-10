class Role {
  readonly id: number;
  readonly uid: string;
  readonly code: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

class AssignRole {
  role: Role;
}

export class GetUsersByAuthUidsOutput {
  readonly id: number;
  readonly authUid: string;
  readonly email: string;
  readonly phone: string;

  readonly assignedRoles: AssignRole[];
}
