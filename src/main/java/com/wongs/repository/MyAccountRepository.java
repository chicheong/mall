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
@SuppressWarnings("unused")
@Repository
public interface MyAccountRepository extends JpaRepository<MyAccount, Long> {

    @Query(value = "select distinct my_account from MyAccount my_account left join fetch my_account.shops",
        countQuery = "select count(distinct my_account) from MyAccount my_account")
    Page<MyAccount> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct my_account from MyAccount my_account left join fetch my_account.shops")
    List<MyAccount> findAllWithEagerRelationships();

    @Query("select my_account from MyAccount my_account left join fetch my_account.shops where my_account.id =:id")
    Optional<MyAccount> findOneWithEagerRelationships(@Param("id") Long id);

}
