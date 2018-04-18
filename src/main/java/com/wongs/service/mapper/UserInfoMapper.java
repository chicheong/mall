package com.wongs.service.mapper;

import com.wongs.domain.*;
import com.wongs.service.dto.UserInfoDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity UserInfo and its DTO UserInfoDTO.
 */
@Mapper(componentModel = "spring", uses = {UserMapper.class, MyAccountMapper.class})
public interface UserInfoMapper extends EntityMapper<UserInfoDTO, UserInfo> {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.login", target = "userLogin")
    @Mapping(source = "defaultAccount.id", target = "defaultAccountId")
    UserInfoDTO toDto(UserInfo userInfo);

    @Mapping(source = "userId", target = "user")
    @Mapping(source = "defaultAccountId", target = "defaultAccount")
    UserInfo toEntity(UserInfoDTO userInfoDTO);

    default UserInfo fromId(Long id) {
        if (id == null) {
            return null;
        }
        UserInfo userInfo = new UserInfo();
        userInfo.setId(id);
        return userInfo;
    }
}
