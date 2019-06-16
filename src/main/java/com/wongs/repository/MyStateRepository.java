package com.wongs.repository;

import com.wongs.domain.MyState;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the MyState entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyStateRepository extends JpaRepository<MyState, Long> {

}
