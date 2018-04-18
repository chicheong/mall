package com.wongs.repository;

import com.wongs.domain.MyAccount;
import com.wongs.domain.User;
import com.wongs.domain.UserInfo;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Spring Data JPA repository for the UserInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    @Query("select distinct user_info from UserInfo user_info left join fetch user_info.accounts")
    List<UserInfo> findAllWithEagerRelationships();

    @Query("select user_info from UserInfo user_info left join fetch user_info.accounts where user_info.id =:id")
    UserInfo findOneWithEagerRelationships(@Param("id") Long id);
    
    @Query("select user_info from UserInfo user_info left join fetch user_info.accounts where user_info.user.login =:login")
    UserInfo findOneWithAccountsByUserLogin(@Param("login") String login);
    
    @Query("select myAccount from UserInfo user_info left join user_info.defaultAccount myAccount where user_info.user.login =:login")
    MyAccount findCurrentMyAccountByUserLogin(@Param("login") String login);
    
    @Query("SELECT u.accounts FROM UserInfo u WHERE u.id = :id")
    Set<MyAccount> findByUserInfoId(@Param("id") Long id);

}
