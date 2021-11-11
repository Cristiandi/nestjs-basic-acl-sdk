import { DynamicModule } from '@nestjs/common';
import { BasicACLOptions, BasicACLAsyncOptions } from './basic-acl.interfaces';
export declare class BasicAclModule {
    static register(options: BasicACLOptions): DynamicModule;
    static registerAsync(options: BasicACLAsyncOptions): DynamicModule;
    private static createProviders;
    private static createOptionsProvider;
}
