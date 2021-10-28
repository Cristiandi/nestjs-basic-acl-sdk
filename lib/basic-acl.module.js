"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BasicAclModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicAclModule = void 0;
const common_1 = require("@nestjs/common");
const basic_acl_constants_1 = require("./basic-acl.constants");
const basic_acl_service_1 = require("./basic-acl.service");
let BasicAclModule = BasicAclModule_1 = class BasicAclModule {
    static register(config) {
        return {
            module: BasicAclModule_1,
            providers: [
                basic_acl_service_1.BasicAclService,
                {
                    provide: basic_acl_constants_1.BASIC_ACL_CONFIG_TOKEN,
                    useValue: config,
                },
            ],
            exports: [basic_acl_service_1.BasicAclService],
        };
    }
};
BasicAclModule = BasicAclModule_1 = __decorate([
    (0, common_1.Module)({})
], BasicAclModule);
exports.BasicAclModule = BasicAclModule;
//# sourceMappingURL=basic-acl.module.js.map