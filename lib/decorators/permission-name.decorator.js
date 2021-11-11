"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionName = exports.PERMISSION_NAME_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSION_NAME_KEY = 'permissionName';
const PermissionName = (name) => common_1.SetMetadata(exports.PERMISSION_NAME_KEY, name);
exports.PermissionName = PermissionName;
//# sourceMappingURL=permission-name.decorator.js.map