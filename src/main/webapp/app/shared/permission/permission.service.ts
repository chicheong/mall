import { Injectable } from '@angular/core';

export const enum PermissionsConstants {
    CREATE = 'C',
    READ = 'R',
    UPDATE = 'U',
    DELETE = 'D',
    ALL = 'CRUD',
}
@Injectable({ providedIn: 'root' })
export class PermissionService  {
    constructor() { }

    isCreatable(permissionCode: string): boolean {
        if (permissionCode.includes(PermissionsConstants.CREATE)) {
            return true;
        }
        return false;
    }

    isReadable(permissionCode: string): boolean {
        if (permissionCode.includes(PermissionsConstants.READ)) {
            return true;
        }
        return false;
    }

    isUpdatable(permissionCode: string): boolean {
        if (permissionCode.includes(PermissionsConstants.UPDATE)) {
            return true;
        }
        return false;
    }

    isDeletable(permissionCode: string): boolean {
        if (permissionCode.includes(PermissionsConstants.DELETE)) {
            return true;
        }
        return false;
    }
}
