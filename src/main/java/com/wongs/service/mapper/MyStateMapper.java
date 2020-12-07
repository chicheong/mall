package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.MyState;
import com.wongs.service.dto.MyStateDTO;

/**
 * Mapper for the entity {@link MyState} and its DTO {@link MyStateDTO}.
 */
@Service
public class MyStateMapper {

	public MyStateDTO toDto(MyState myState) {
    	if (myState == null) return null;
		return new MyStateDTO(myState);
	}
    
    public Set<MyStateDTO> toDto(Set<MyState> myStatees) {
        return myStatees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<MyStateDTO> toDto(List<MyState> myStatees) {
        return myStatees.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public MyState toEntity(MyStateDTO myStateDTO) {
        if (myStateDTO == null) {
            return null;
        } else {
        	MyState myState = new MyState();
        	myState.setId(myStateDTO.getId());
        	myState.setCode(myStateDTO.getCode());
        	myState.setLabel(myStateDTO.getLabel());
        	myState.setName(myStateDTO.getName());
        	myState.setCountry(myStateDTO.getCountry());
        	
            return myState;
        }
    }

    public List<MyState> toEntity(List<MyStateDTO> myStateDTOs) {
        return myStateDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<MyState> toEntity(Set<MyStateDTO> myStateDTOs) {
        return myStateDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public MyState fromId(Long id) {
        if (id == null) {
            return null;
        }
        MyState myState = new MyState();
        myState.setId(id);
        return myState;
    }
}
