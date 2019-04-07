package com.wongs.service.util;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.Date;

import org.apache.commons.lang3.RandomStringUtils;

import com.google.common.io.Files;

/**
 * Utility class for processing file.
 */
public final class DateUtil {

    private DateUtil() {
    }

    /**
     * Passing testDate and check if it is within startDate and endDate
     * 
     * @param testDate
     * @param startDate
     * @param endDate
     * @return boolean
     */
    public static boolean withinRange(ZonedDateTime testDate, ZonedDateTime startDate, ZonedDateTime endDate) {
    	return !(testDate.isBefore(startDate) || testDate.isAfter(endDate));
    }
}
