package com.wongs.permission;

import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;

/**
 * Utility class for Spring Security.
 */
public final class PermissionUtils {

    private PermissionUtils() {
    }

    /**
     * @param permissionCode
     * @return
     */
    public static boolean isCreatable(String permissionCode) {
    	return Optional.ofNullable(permissionCode).map(code ->  code.contains(PermissionsConstants.CREATE)).orElse(false);
    }
    
    /**
     * @param permissionCode
     * @return
     */
    public static boolean isReadable(String permissionCode) {
    	return Optional.ofNullable(permissionCode).map(code ->  code.contains(PermissionsConstants.READ)).orElse(false);
    }
    
    /**
     * @param permissionCode
     * @return
     */
    public static boolean isUpdatable(String permissionCode) {
    	return Optional.ofNullable(permissionCode).map(code ->  code.contains(PermissionsConstants.UPDATE)).orElse(false);
    }
    
    /**
     * @param permissionCode
     * @return
     */
    public static boolean isDeletable(String permissionCode) {
    	return Optional.ofNullable(permissionCode).map(code ->  code.contains(PermissionsConstants.DELETE)).orElse(false);
    }
}
