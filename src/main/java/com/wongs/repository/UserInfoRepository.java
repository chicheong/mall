package com.wongs.repository;

import com.wongs.domain.UserInfo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the UserInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {

    @Query(value = "select distinct user_info from UserInfo user_info left join fetch user_info.accounts",
        countQuery = "select count(distinct user_info) from UserInfo user_info")
    Page<UserInfo> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct user_info from UserInfo user_info left join fetch user_info.accounts")
    List<UserInfo> findAllWithEagerRelationships();

    @Query("select user_info from UserInfo user_info left join fetch user_info.accounts where user_info.id =:id")
    Optional<UserInfo> findOneWithEagerRelationships(@Param("id") Long id);
    
    @Query("select user_info from UserInfo user_info left join fetch user_info.accounts where user_info.user.login =:login")
    UserInfo findOneWithAccountsByUserLogin(@Param("login") String login);
    
    /**
    @Query("select myAccount from UserInfo user_info left join user_info.defaultAccount myAccount where user_info.user.login =:login")
    MyAccount findCurrentMyAccountByUserLogin(@Param("login") String login);
    
    @Query("SELECT u.accounts FROM UserInfo u WHERE u.id = :id")
    Set<MyAccount> findByUserInfoId(@Param("id") Long id);
    */
}
