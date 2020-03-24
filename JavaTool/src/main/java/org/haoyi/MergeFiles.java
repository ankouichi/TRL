package org.haoyi;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.haoyi.entity.*;
import org.haoyi.util.JsonUtil;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import java.awt.geom.Arc2D;
import java.io.*;
import java.util.ArrayList;
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
//        List<Link> links = parseLinksXML(XML_LOC);
//        Map<Integer, List<Point>> map = parsePointsXlsx(EXCEL_LOC);
//
//        for (Link link : links) {
//            List<Point> points = map.get(link.getDirectionId());
//            link.setPoints(points);
//        }
//
//        FileWriter fw = new FileWriter(JSON_LOC);
//        try{
//            ObjectMapper mapper = new ObjectMapper();
//            String jsonStr = mapper.writeValueAsString(links);
//            fw.write(jsonStr);
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            fw.flush();
//            fw.close();
//        }

//        String actualJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\doc\\outShortestPath.json";
//        List<OdPair> pairs = JsonUtil.readJsonFile(actualJsonFile);
//
//        for (OdPair pair : pairs) {
//            String linkStr = pair.getLinkStr();
//            String[] splitted = linkStr.split("n", 0);
//            pair.setUpStream(Integer.parseInt(splitted[1]));
//            pair.setDownStream(Integer.parseInt(splitted[2]));
//        }
//
//        JsonUtil.writeJsonFile(actualJsonFile, pairs);

        String nodeFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes.json";
        String nodeNeoFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes-new.json";
        List<Node> nodes = JsonUtil.readNodeJsonFile((nodeFile));

        List<NodeNeo> nodeNeos = new ArrayList<>();
        for (Node node : nodes){
            NodeNeo nodeNeo = new NodeNeo();
            nodeNeo.setId(Integer.parseInt(node.getId()));
            nodeNeo.setLat(Double.parseDouble(node.getY()));
            nodeNeo.setLng(Double.parseDouble(node.getX()));
            nodeNeo.setZone(Integer.parseInt(node.getZone()));
            nodeNeos.add(nodeNeo);
        }

        JsonUtil.writeNodeJsonFile(nodeNeoFile, nodeNeos);

        System.out.println(" ");
    }
}
