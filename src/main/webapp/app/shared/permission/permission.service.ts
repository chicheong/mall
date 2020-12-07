import { Injectable } from '@angular/core';

export const enum PermissionConstants {
    CREATE = 'C',
    READ = 'R',
    UPDATE = 'U',
    DELETE = 'D',
    ALL = 'CRUD',
}
@Injectable({ providedIn: 'root' })
export class PermissionService {
    constructor() { }

    isCreatable(permissionCode: string): boolean {
        if (permissionCode && permissionCode.includes(PermissionConstants.CREATE)) {
            return true;
        }
        return false;
    }

    isReadable(permissionCode: string): boolean {
        if (permissionCode && permissionCode.includes(PermissionConstants.READ)) {
            return true;
        }
        return false;
    }

    isUpdatable(permissionCode: string): boolean {
        if (permissionCode && permissionCode.includes(PermissionConstants.UPDATE)) {
            return true;
        }
        return false;
    }

    isDeletable(permissionCode: string): boolean {
        if (permissionCode && permissionCode.includes(PermissionConstants.DELETE)) {
            return true;
        }
        return false;
    }
}
