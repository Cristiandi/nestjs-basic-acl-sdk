declare class AssignRole {
    readonly role: {
        readonly code: string;
        readonly name: string;
    };
}
export declare class GetUserOutput {
    readonly id: number;
    readonly authUid: string;
    readonly email: string;
    readonly phone: string;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly roles: AssignRole[];
}
export {};
