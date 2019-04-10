package com.wongs.permission;

/**
 * Constants for Spring Security authorities.
 */
public final class PermissionsConstants {

    public static final String CREATE = "C";

    public static final String READ = "R";

    public static final String UPDATE = "U";
    
    public static final String DELETE = "D";
    
    public static final String ALL = "CRUD";

    private PermissionsConstants() {
    }
}
