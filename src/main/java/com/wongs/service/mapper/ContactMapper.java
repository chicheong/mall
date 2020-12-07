package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Contact;
import com.wongs.service.dto.ContactDTO;

/**
 * Mapper for the entity {@link Contact} and its DTO {@link ContactDTO}.
 */
@Service
public class ContactMapper {

	public ContactDTO toDto(Contact Contact) {
    	if (Contact == null) return null;
		return new ContactDTO(Contact);
	}
    
    public Set<ContactDTO> toDto(Set<Contact> Contactes) {
        return Contactes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<ContactDTO> toDto(List<Contact> Contactes) {
        return Contactes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Contact toEntity(ContactDTO ContactDTO) {
        if (ContactDTO == null) {
            return null;
        } else {
        	Contact Contact = new Contact();
        	Contact.setId(ContactDTO.getId());
        	Contact.setName(ContactDTO.getName());
        	Contact.setName2(ContactDTO.getName2());
        	Contact.setPhoneNum(ContactDTO.getPhoneNum());
        	Contact.setPhoneNum2(ContactDTO.getPhoneNum2());
        	Contact.setEmail(ContactDTO.getEmail());
        	Contact.setRemark(ContactDTO.getRemark());
        	Contact.setAddress(ContactDTO.getAddress());
        	
            return Contact;
        }
    }

    public List<Contact> toEntity(List<ContactDTO> ContactDTOs) {
        return ContactDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Contact> toEntity(Set<ContactDTO> ContactDTOs) {
        return ContactDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Contact fromId(Long id) {
        if (id == null) {
            return null;
        }
        Contact Contact = new Contact();
        Contact.setId(id);
        return Contact;
    }
}
