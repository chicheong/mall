package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.MyAccountDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity MyAccount and its DTO MyAccountDTO.
 */
@Mapper(componentModel = "spring", uses = {CompanyMapper.class, DepartmentMapper.class, OfficeMapper.class, ShopMapper.class})
public interface MyAccountMapper extends EntityMapper<MyAccountDTO, MyAccount> {

    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "company.code", target = "companyCode")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.code", target = "departmentCode")
    @Mapping(source = "office.id", target = "officeId")
    @Mapping(source = "office.code", target = "officeCode")
    MyAccountDTO toDto(MyAccount myAccount); 

    @Mapping(target = "delegations", ignore = true)
    @Mapping(source = "companyId", target = "company")
    @Mapping(source = "departmentId", target = "department")
    @Mapping(source = "officeId", target = "office")
    @Mapping(target = "userInfos", ignore = true)
    MyAccount toEntity(MyAccountDTO myAccountDTO);

    default MyAccount fromId(Long id) {
        if (id == null) {
            return null;
        }
        MyAccount myAccount = new MyAccount();
        myAccount.setId(id);
        return myAccount;
    }
}
