package com.wongs.service.mapper;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.UserInfo;
import com.wongs.service.dto.UserInfoDTO;

/**
 * Mapper for the entity UserInfo and its DTO UserInfoDTO.
 */
@Service
public class UserInfoMapper {

	public UserInfoDTO toDto(UserInfo url) {
    	if (url == null) return null;
		return new UserInfoDTO(url);
	}
    
    public Set<UserInfoDTO> toDto(Set<UserInfo> urls) {
        return urls.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<UserInfoDTO> toDto(List<UserInfo> urls) {
        return urls.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public UserInfo toEntity(UserInfoDTO userInfoDTO) {
        if (userInfoDTO == null) {
            return null;
        } else {
        	UserInfo userInfo = new UserInfo();
        	userInfo.setId(userInfoDTO.getId());
        	userInfo.setAccountId(userInfoDTO.getAccountId());
        	userInfo.setShopId(userInfoDTO.getShopId());
        	userInfo.setUser(userInfoDTO.getUser());
        	userInfo.setDefaultAccount(userInfoDTO.getDefaultAccount());        	
            return userInfo;
        }
    }

    public List<UserInfo> toEntity(List<UserInfoDTO> urlDTOs) {
        return urlDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<UserInfo> toEntity(Set<UserInfoDTO> urlDTOs) {
        return urlDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public UserInfo fromId(Long id) {
        if (id == null) {
            return null;
        }
        UserInfo url = new UserInfo();
        url.setId(id);
        return url;
    }
}
