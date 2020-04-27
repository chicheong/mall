package com.wongs.service;

import java.io.File;
import java.io.IOException;
import java.math.RoundingMode;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.io.Files;

/**
 * Service class for processing file.
 */
@Service
@Transactional
public class FileService {

    private final Logger log = LoggerFactory.getLogger(FileService.class);
    private static final int DEF_COUNT = 20;
    private static final String FILE_SERVER_PATH = "C:"+File.separator+"xampp"+File.separator+"htdocs"+File.separator;
    private static final String FILE_SERVER_URI = "http://localhost/";
    private static final String WEB_PATH = "/";
    private static final String MARK_DELETE_SUFFIX = "-deleted";
    
    public static enum TYPE {
    	IMAGE("image"),
    	VIDEO("video");

    	private String abbreviation;
    	public String getAbbreviation() {
    		return this.abbreviation;
    	}
    	TYPE(String abbreviation) {
    		this.abbreviation = abbreviation;
    	}
    }
    
    public static enum CATEGORY {
    	PRODUCT("yyyy"+File.separator+"MM"+File.separator+"dd"+File.separator+"product"+File.separator+"id1"+File.separator),
    	PRODUCT_ITEM("yyyy"+File.separator+"MM"+File.separator+"dd"+File.separator+"product"+File.separator+"id1"+File.separator+"item"+File.separator+"id2"+File.separator),
    	USER("yyyy"+File.separator+"MM"+File.separator+"dd"+File.separator+"user"+File.separator+"id1"+File.separator),
    	USER_PROFILE("yyyy"+File.separator+"MM"+File.separator+"dd"+File.separator+"user"+File.separator+"id1"+File.separator+"profile"+File.separator);

    	private String path;
    	public String getPath() {
    		return this.path;
    	}
    	CATEGORY(String path) {
    		this.path = path;
    	}
    }

    public FileService() {
    }

    public String saveAndGetFilePath(TYPE type, CATEGORY category, Long id, String fileName, String base64String) throws IOException {
    	return saveAndGetFilePath(type, category, id, null, fileName, base64String);
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
    public String saveAndGetFilePath(TYPE type, CATEGORY category, Long id1, Long id2, String fileName, String base64String) throws IOException {
    	Calendar calendar = Calendar.getInstance();
    	DecimalFormat format= new DecimalFormat("00");
    	format.setRoundingMode(RoundingMode.DOWN);
    	
    	Decoder decoder = Base64.getDecoder();
    	byte[] image = decoder.decode(base64String.substring(base64String.indexOf("base64,") + 7));
    	
    	String dir = category.getPath();
    	
		dir = dir.replaceAll("yyyy", format.format(Double.valueOf(calendar.get(Calendar.YEAR))));
		dir = dir.replaceAll("MM", format.format(Double.valueOf(calendar.get(Calendar.MONTH)+1)));
		dir = dir.replaceAll("dd", format.format(Double.valueOf(calendar.get(Calendar.DAY_OF_MONTH))));
		dir = dir.replaceAll("HH", format.format(Double.valueOf(calendar.get(Calendar.HOUR))));
		dir = dir.replaceAll("mm", format.format(Double.valueOf(calendar.get(Calendar.MINUTE))));
		dir = dir.replaceAll("ss", format.format(Double.valueOf(calendar.get(Calendar.SECOND))));
		dir = dir.replaceAll("SSS", format.format(Double.valueOf(calendar.get(Calendar.MILLISECOND))));
		dir = dir.replaceAll("id1", String.valueOf(id1));
		dir = dir.replaceAll("id2", String.valueOf(id2));
    	
    	Path targetPath = Paths.get(FILE_SERVER_PATH + type.getAbbreviation() + File.separator + dir + fileName);
    	Files.createParentDirs(targetPath.toFile());
    	Files.write(image, targetPath.toFile());
    	
    	String dirWeb = dir.replace(File.separator, WEB_PATH);
    	
    	return FILE_SERVER_URI + type.getAbbreviation() + WEB_PATH + dirWeb + fileName;
    }
    
    public void markDelete(String url) throws IOException {
    	String dir = url.replace(FILE_SERVER_URI, FILE_SERVER_PATH);
    	dir = dir.replace(WEB_PATH, File.separator);
    	Path sourcePatth = Paths.get(dir);
    	Path targetaPath = Paths.get(dir + MARK_DELETE_SUFFIX);
    	Files.move(sourcePatth.toFile(), targetaPath.toFile());
    }
}
