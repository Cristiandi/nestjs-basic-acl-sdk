import { BasicACLConfig } from './basic-acl.interfaces';
import { BasicAclService } from './basic-acl.service';
export declare class BasicAclModule {
    static register(config: BasicACLConfig): {
        module: typeof BasicAclModule;
        providers: (typeof BasicAclService | {
            provide: symbol;
            useValue: BasicACLConfig;
        })[];
        exports: (typeof BasicAclService)[];
    };
}
