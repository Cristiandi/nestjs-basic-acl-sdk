import { ModuleMetadata, Type } from '@nestjs/common';
export interface BasicACLOptions {
    companyUid: string;
    accessKey: string;
}
export interface BasicACLOptionsFactory {
    createOptions(): Promise<BasicACLOptions> | BasicACLOptions;
}
export interface BasicACLAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<BasicACLOptionsFactory>;
    useClass?: Type<BasicACLOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<BasicACLOptions> | BasicACLOptions;
    inject?: any[];
}
