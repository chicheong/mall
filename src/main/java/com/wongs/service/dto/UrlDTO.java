package com.wongs.service.dto;


import java.io.File;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.wongs.domain.Url;

/**
 * A DTO for the Url entity.
 */
public class UrlDTO implements Serializable {

    private Long id;

    private String entityType;

    private Long entityId;

    private String path;

    private String description;

    private String createdBy;

    private ZonedDateTime createdDate;

    private String lastModifiedBy;

    private ZonedDateTime lastModifiedDate;
    
    private String fileName;

    public UrlDTO() {
        // Empty constructor needed for Jackson.
    }
    
    public UrlDTO(Url url) {
        this.id = url.getId();
    	this.entityType = url.getEntityType();
    	this.entityId = url.getEntityId();
    	this.path = url.getPath();
    	this.description = url.getDescription();
    	this.createdBy = url.getCreatedBy();
    	this.createdDate = url.getCreatedDate();
    	this.lastModifiedBy = url.getLastModifiedBy();
    	this.lastModifiedDate = url.getLastModifiedDate();
    }
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public ZonedDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(ZonedDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public ZonedDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(ZonedDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        UrlDTO urlDTO = (UrlDTO) o;
        if(urlDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), urlDTO.getId()) &&
        		Objects.equals(getEntityType(), urlDTO.getEntityType()) &&
        		Objects.equals(getEntityId(), urlDTO.getEntityId()) &&
        		Objects.equals(getPath(), urlDTO.getPath()) &&
        		Objects.equals(getDescription(), urlDTO.getDescription());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UrlDTO{" +
            "id=" + getId() +
            ", entityType='" + getEntityType() + "'" +
            ", entityId=" + getEntityId() +
            ", path='" + getPath() + "'" +
            ", description='" + getDescription() + "'" +
            ", createdBy='" + getCreatedBy() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", lastModifiedBy='" + getLastModifiedBy() + "'" +
            ", lastModifiedDate='" + getLastModifiedDate() + "'" +
            "}";
    }
}
