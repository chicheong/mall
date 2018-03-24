package com.wongs.service.dto;


import java.time.ZonedDateTime;
import java.io.Serializable;
import java.util.Objects;

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
        return Objects.equals(getId(), urlDTO.getId());
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
