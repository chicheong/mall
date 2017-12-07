package com.wongs.repository;

import com.wongs.domain.Department;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the Department entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartmentRepository extends JpaRepository<Department,Long> {
    
    @Query("select distinct department from Department department left join fetch department.offices")
    List<Department> findAllWithEagerRelationships();

    @Query("select department from Department department left join fetch department.offices where department.id =:id")
    Department findOneWithEagerRelationships(@Param("id") Long id);
    
}
