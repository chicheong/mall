import { UserInfo } from './../../entities/user-info';
import { MyAccount } from './../../entities/my-account';
import { Shop } from './../../entities/shop';

export class User {
    public id?: any;
    public login?: string;
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public activated?: Boolean;
    public langKey?: string;
    public authorities?: any[];
    public createdBy?: string;
    public createdDate?: Date;
    public lastModifiedBy?: string;
    public lastModifiedDate?: Date;
    public password?: string;
    public userInfo?: UserInfo;
    public myAccounts?: MyAccount[];
    public shops?: Shop[];
    public shopId?: any;

    constructor(
        id?: any,
        login?: string,
        firstName?: string,
        lastName?: string,
        email?: string,
        activated?: Boolean,
        langKey?: string,
        authorities?: any[],
        createdBy?: string,
        createdDate?: Date,
        lastModifiedBy?: string,
        lastModifiedDate?: Date,
        password?: string,
        userInfo?: UserInfo,
        myAccounts?: MyAccount[],
        shops?: Shop[],
        shopId?: any
    ) {
        this.id = id ? id : null;
        this.login = login ? login : null;
        this.firstName = firstName ? firstName : null;
        this.lastName = lastName ? lastName : null;
        this.email = email ? email : null;
        this.activated = activated ? activated : false;
        this.langKey = langKey ? langKey : null;
        this.authorities = authorities ? authorities : null;
        this.createdBy = createdBy ? createdBy : null;
        this.createdDate = createdDate ? createdDate : null;
        this.lastModifiedBy = lastModifiedBy ? lastModifiedBy : null;
        this.lastModifiedDate = lastModifiedDate ? lastModifiedDate : null;
        this.password = password ? password : null;
        this.userInfo = userInfo ? userInfo : null;
        this.myAccounts = myAccounts ? myAccounts : null;
        this.shops = shops ? shops : null;
        this.shopId = shopId ? shopId : null;
    }
}
