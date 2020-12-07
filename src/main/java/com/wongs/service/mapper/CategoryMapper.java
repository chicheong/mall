package com.wongs.service.mapper;


import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.wongs.domain.Category;
import com.wongs.service.dto.CategoryDTO;

/**
 * Mapper for the entity {@link Category} and its DTO {@link CategoryDTO}.
 */
@Service
public class CategoryMapper {

	public CategoryDTO toDto(Category category) {
    	if (category == null) return null;
		return new CategoryDTO(category);
	}
    
    public Set<CategoryDTO> toDto(Set<Category> categoryes) {
        return categoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toSet());
    }

    public List<CategoryDTO> toDto(List<Category> categoryes) {
        return categoryes.stream()
            .filter(Objects::nonNull)
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    public Category toEntity(CategoryDTO categoryDTO) {
        if (categoryDTO == null) {
            return null;
        } else {
        	Category category = new Category();
        	category.setId(categoryDTO.getId());
        	category.setName(categoryDTO.getName());
        	category.setDescription(categoryDTO.getDescription());
        	category.setStatus(categoryDTO.getStatus());
        	category.setCreatedBy(categoryDTO.getCreatedBy());
        	category.setCreatedDate(categoryDTO.getCreatedDate());
        	category.setLastModifiedBy(categoryDTO.getLastModifiedBy());
        	category.setLastModifiedDate(categoryDTO.getLastModifiedDate());
        	category.setParent(categoryDTO.getParent());
//        	category.setProducts(categoryDTO.getProducts());
        	
            return category;
        }
    }

    public List<Category> toEntity(List<CategoryDTO> categoryDTOs) {
        return categoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toList());
    }
    
    public Set<Category> toEntity(Set<CategoryDTO> categoryDTOs) {
        return categoryDTOs.stream()
            .filter(Objects::nonNull)
            .map(this::toEntity)
            .collect(Collectors.toSet());
    }

    public Category fromId(Long id) {
        if (id == null) {
            return null;
        }
        Category category = new Category();
        category.setId(id);
        return category;
    }
}
