package org.haoyi;

import org.apache.poi.ss.usermodel.Row;
import org.haoyi.entity.Point;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import java.io.*;
import java.util.List;
import java.util.Map;

import static org.haoyi.util.ExcelUtil.parsePointsXlsx;

/**
 * Read data from XML to POJO
 *
 */
public class MergeFiles
{
    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
        String excelLoc = "C:\\Points.xlsx";
//        String xmlLoc = "C:\\Links.xml";
//
//        List<Link> links = parseLinksXML(xmlLoc);
//
//        for(int i = 0; i < links.size(); i++){
//            Link link = links.get(i);
//            System.out.println("");
//            System.out.println("link id: " + link.getId());
//            System.out.println("link upstream: " + link.getUpStream());
//            System.out.println("link downstream: " + link.getDownStream());
//            System.out.println("link direction id: " + link.getDirectionId());
//        }
//
//        System.out.println("");
//        System.out.println("Number of links: " + links.size());

        Map<Integer, List<Point>> map = parsePointsXlsx(excelLoc);

        for (Integer key : map.keySet()) {
            System.out.println("Direction Id: " + key);
            for(Point p : map.get(key)) {
                System.out.println(p.getLat() + "," + p.getLng());
            }
            System.out.println("");
        }
    }
}
