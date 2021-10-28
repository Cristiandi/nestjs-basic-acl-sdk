import { SetMetadata, CustomDecorator } from '@nestjs/common';

export const PERMISSION_NAME_KEY = 'permissionName';

export const PermissionName = (name: string): CustomDecorator<string> =>
  SetMetadata(PERMISSION_NAME_KEY, name);
