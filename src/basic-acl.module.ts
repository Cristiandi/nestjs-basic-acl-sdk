import { Module } from '@nestjs/common';

import { BasicACLConfig } from './basic-acl.interfaces';

import { BASIC_ACL_CONFIG_TOKEN } from './basic-acl.constants';

import { BasicAclService } from './basic-acl.service';

@Module({})
export class BasicAclModule {
  static register(config: BasicACLConfig) {
    return {
      module: BasicAclModule,
      providers: [
        BasicAclService,
        {
          provide: BASIC_ACL_CONFIG_TOKEN,
          useValue: config,
        },
      ],
      exports: [BasicAclService],
    };
  }
}
