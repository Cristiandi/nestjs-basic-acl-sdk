import { CustomDecorator } from '@nestjs/common';
export declare const PERMISSION_NAME_KEY = "permissionName";
export declare const PermissionName: (name: string) => CustomDecorator<string>;
