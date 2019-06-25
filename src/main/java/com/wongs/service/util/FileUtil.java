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
    public static enum TYPE {
    	IMAGE("img");

    	private String abbreviation;
    	public String getAbbreviation() {
    		return this.abbreviation;
    	}
    	TYPE(String abbreviation) {
    		this.abbreviation = abbreviation;
    	}
    }

    private FileUtil() {
    }

    /**
     * Passing the base 64 String from web, save it and return the path
     * 
     * @param fileType
     * @param fileName
     * @param base64String
     * @return
     * @throws IOException
     */
    public static String saveAndGetFilePath(TYPE fileType, String fileName, String base64String) throws IOException {
    	Decoder decoder = Base64.getDecoder();
    	byte[] image = decoder.decode(base64String.substring(base64String.indexOf("base64,") + 7));
    	Path targetPath = Paths.get(String.format("C:\\xampp\\htdocs\\%s\\%s", fileType.getAbbreviation(), fileName));

    	Files.write(image, targetPath.toFile());
    	
    	return String.format("http://localhost/%s/%s", fileType.getAbbreviation(), fileName);
    }
}
