package org.haoyi.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.haoyi.entity.Point;
import org.haoyi.entity.Precipitation;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class ExcelUtil {
    static Integer START_ROW_NUM = 0;
    static Integer SEQ_OF_DIRE_ID = 0;
    static Integer SEQ_OF_LNG = 4;
    static Integer SEQ_OF_LAT = 5;

    static Integer SEQ_OF_ID = 0;
    static Integer SEQ_OF_EB_RATE = 1;

    public static Map<Integer, List<Point>> parsePointsXlsx(String file) throws IOException {
        HashMap<Integer, List<Point>> map = new HashMap<>();

        File pointFile = new File(file);
        FileInputStream fis = new FileInputStream(pointFile);

        XSSFWorkbook wb = new XSSFWorkbook(fis);
        XSSFSheet sheet = wb.getSheetAt(START_ROW_NUM);

        for (Row row : sheet) {
            int rowNum = row.getRowNum();

            if (rowNum != 0) {
                Cell cell_dire_id = row.getCell(SEQ_OF_DIRE_ID);
                int id = (int) cell_dire_id.getNumericCellValue();
                Cell cell_lng = row.getCell(SEQ_OF_LNG);
                Cell cell_lat = row.getCell(SEQ_OF_LAT);

                Point point = new Point();
                point.setLng(cell_lng.getNumericCellValue());
                point.setLat(cell_lat.getNumericCellValue());

                List<Point> points = map.get(id);

                if (points == null) {
                    points = new ArrayList<>();
                    points.add(point);
                    map.put(id, points);
                } else {
                    points.add(point);
                }
            }
        }

        return map;
    }

    public static Map<String, List<Precipitation>> parsePrecipitationXlsx(String file) throws IOException {
        HashMap<String, List<Precipitation>> map = new HashMap<>();
        List<Precipitation> precipitations;

        File pointFile = new File(file);
        FileInputStream fis = new FileInputStream(pointFile);
        XSSFWorkbook wb = new XSSFWorkbook(fis);

        for (int i = 0; i < 3; i++) {
            precipitations = new ArrayList<>();
            XSSFSheet sheet = wb.getSheetAt(i);

            for (Row row : sheet) {
                int rowNum = row.getRowNum();
                if (rowNum != 0) {
                    Cell cell_dire_id = row.getCell(SEQ_OF_ID);
                    int id = (int) cell_dire_id.getNumericCellValue();
                    Cell t_eb_rate = row.getCell(SEQ_OF_EB_RATE);
                    double rate = t_eb_rate.getNumericCellValue();
                    Precipitation precipitation = new Precipitation(id, rate);
                    precipitations.add(precipitation);
                }
            }

            switch (i) {
                case 0:
                    map.put("light", precipitations);
                    System.out.println("light: " + precipitations.size());
                    break;
                case 1:
                    map.put("moderate", precipitations);
                    System.out.println("moderate: " + precipitations.size());
                    break;
                case 2:
                    map.put("severe", precipitations);
                    System.out.println("severe: " + precipitations.size());
                    break;
                default:
                    throw new IllegalArgumentException("wrong sheet index");
            }
        }

        return map;
    }
}
