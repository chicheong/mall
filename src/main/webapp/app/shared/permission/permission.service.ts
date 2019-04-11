import { Injectable } from '@angular/core';

export const enum PermissionsConstants {
    CREATE = 'C',
    READ = 'R',
    UPDATE = 'U',
    DELETE = 'D',
    ALL = 'CRUD',
}
@Injectable()
export class PermissionService  {
    constructor() { }

    isCreatable(permissionCode: string): boolean {
        return false;
    }

    isReadable(permissionCode: string): boolean {
        return false;
    }

    isUpdatable(permissionCode: string): boolean {
        return false;
    }

    isDeletable(permissionCode: string): boolean {
        return false;
    }
}
