package com.wongs.repository;

import com.wongs.domain.MyAccount;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for the MyAccount entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MyAccountRepository extends JpaRepository<MyAccount, Long> {
    @Query("select distinct my_account from MyAccount my_account left join fetch my_account.shops")
    List<MyAccount> findAllWithEagerRelationships();

    @Query("select my_account from MyAccount my_account left join fetch my_account.shops where my_account.id =:id")
    MyAccount findOneWithEagerRelationships(@Param("id") Long id);

}
