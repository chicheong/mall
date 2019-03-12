package com.wongs.service.util;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Base64.Decoder;

import org.apache.commons.lang3.RandomStringUtils;

import com.google.common.io.Files;

/**
 * Utility class for processing file.
 */
public final class FileUtil {

    private static final int DEF_COUNT = 20;
    public static enum FILETYPE {
    	IMAGE("img");

    	private String abbreviation;
    	public String getAbbreviation() {
    		return this.abbreviation;
    	}
    	FILETYPE(String abbreviation) {
    		this.abbreviation = abbreviation;
    	}
    }

    private FileUtil() {
    }

    public static String saveAndGetFilePath(FILETYPE fileType, String fileName, String base64String) throws IOException {
    	Decoder decoder = Base64.getDecoder();
    	byte[] image = decoder.decode(base64String.substring(base64String.indexOf("base64,") + 7));
    	Path targetPath = Paths.get(String.format("C:\\xampp\\htdocs\\%s\\%s", fileType.getAbbreviation(), fileName));

    	Files.write(image, targetPath.toFile());
    	
    	return String.format("http://localhost/%s/%s", fileType.getAbbreviation(), fileName);
    }
    
    /**
     * Generate a password.
     *
     * @return the generated password
     */
    public static String generatePassword() {
        return RandomStringUtils.randomAlphanumeric(DEF_COUNT);
    }

    /**
     * Generate an activation key.
     *
     * @return the generated activation key
     */
    public static String generateActivationKey() {
        return RandomStringUtils.randomNumeric(DEF_COUNT);
    }

    /**
     * Generate a reset key.
     *
     * @return the generated reset key
     */
    public static String generateResetKey() {
        return RandomStringUtils.randomNumeric(DEF_COUNT);
    }
}
