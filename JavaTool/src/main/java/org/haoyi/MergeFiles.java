package org.haoyi;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.haoyi.entity.Link;
import org.haoyi.entity.Point;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import java.io.*;
import java.util.List;
import java.util.Map;

import static org.haoyi.util.ExcelUtil.parsePointsXlsx;
import static org.haoyi.util.XmlUtil.parseLinksXML;

/**
 * Read data from XML to POJO
 *
 */
public class MergeFiles
{
    static String EXCEL_LOC =  "C:\\Points.xlsx";
    static String XML_LOC =  "C:\\Links.xml";
    static String JSON_LOC = "C:\\Users\\Daniel\\Documents\\Directions.json";

    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
        List<Link> links = parseLinksXML(XML_LOC);
        Map<Integer, List<Point>> map = parsePointsXlsx(EXCEL_LOC);

        for (Link link : links) {
            List<Point> points = map.get(link.getDirectionId());
            link.setPoints(points);
        }

        FileWriter fw = new FileWriter(JSON_LOC);
        try{
            ObjectMapper mapper = new ObjectMapper();
            String jsonStr = mapper.writeValueAsString(links);
            fw.write(jsonStr);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            fw.flush();
            fw.close();
        }
    }
}
