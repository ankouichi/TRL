package org.haoyi.util;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.haoyi.entity.Point;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.*;

public class ExcelUtil {
    static Integer START_ROW_NUM = 0;
    static Integer SEQ_OF_DIRE_ID = 0;
    static Integer SEQ_OF_LNG = 4;
    static Integer SEQ_OF_LAT = 5;

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
}
