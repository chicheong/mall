package com.wongs.repository;

import com.wongs.domain.MyAccount;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the MyAccount entity.
 */
@Repository
public interface MyAccountRepository extends JpaRepository<MyAccount, Long> {

    @Query(value = "select distinct myAccount from MyAccount myAccount left join fetch myAccount.shops",
        countQuery = "select count(distinct myAccount) from MyAccount myAccount")
    Page<MyAccount> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct myAccount from MyAccount myAccount left join fetch myAccount.shops")
    List<MyAccount> findAllWithEagerRelationships();

    @Query("select myAccount from MyAccount myAccount left join fetch myAccount.shops where myAccount.id =:id")
    Optional<MyAccount> findOneWithEagerRelationships(@Param("id") Long id);
}
