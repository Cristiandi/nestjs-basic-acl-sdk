import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  BasicACLOptions,
  BasicACLAsyncOptions,
  BasicACLOptionsFactory,
} from './basic-acl.interfaces';

import { BASIC_ACL_CONFIG_TOKEN } from './basic-acl.constants';

import { BasicAclService } from './basic-acl.service';

@Module({})
export class BasicAclModule {
  public static register(options: BasicACLOptions): DynamicModule {
    console.log('register', options);
    return {
      module: BasicAclModule,
      providers: [
        BasicAclService,
        {
          provide: BASIC_ACL_CONFIG_TOKEN,
          useValue: options,
        },
      ],
      exports: [BasicAclService],
    };
  }

  public static registerAsync(options: BasicACLAsyncOptions): DynamicModule {
    return {
      module: BasicAclModule,
      providers: [...this.createProviders(options)],
    };
  }

  private static createProviders(options: BasicACLAsyncOptions): Provider[] {
    if (options.useFactory) {
      return [this.createOptionsProvider(options)];
    }

    return [
      this.createOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createOptionsProvider(
    options: BasicACLAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: BASIC_ACL_CONFIG_TOKEN,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    // For useExisting...
    return {
      provide: BASIC_ACL_CONFIG_TOKEN,
      useFactory: async (optionsFactory: BasicACLOptionsFactory) =>
        await optionsFactory.createOptions(),
      inject: [options.useClass],
    };
  }
}
