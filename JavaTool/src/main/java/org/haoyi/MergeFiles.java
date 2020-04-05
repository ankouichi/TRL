package org.haoyi;

import org.haoyi.entity.*;
import org.haoyi.util.JsonUtil;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

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

    public static void main( String[] args ) throws IOException {
        List<Route> routeList = new ArrayList<>();
        Route route1 = new Route();
        RouteContent content1 = new RouteContent();
        content1.setNodeStr("[n1002, n1000]");
        content1.setTravelRisk(0.006998730357736349);
        content1.setTravelTime(8.005760192871094);
        List<RouteContent> list1 = new ArrayList<>();
        list1.add(content1);
        route1.setLinkStr("n1002n1000");
        route1.setRoutes(list1);

        Route route2 = new Route();
        RouteContent content2 = new RouteContent();
        content2.setNodeStr("[n1002, n1001]");
        content2.setTravelRisk(0.025438755750656128);
        content2.setTravelTime(64.58867645263672);

        RouteContent content3 = new RouteContent();
        content3.setNodeStr("[n1002, n1001]");
        content3.setTravelRisk(0.02341567352414131);
        content3.setTravelTime(177.14785766601562);
        List<RouteContent> list2 = new ArrayList<>();
        list2.add(content2);
        list2.add(content3);
        route2.setLinkStr("n1002n1001");
        route2.setRoutes(list2);

        List<Route> routes = new ArrayList<>();
        routes.add(route1);
        routes.add(route2);

        String pathJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\test.json";
        JsonUtil.writeRouteJsonFile(pathJsonFile, routes);
    }

//    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
////        List<Link> links = parseLinksXML(XML_LOC);
////        Map<Integer, List<Point>> map = parsePointsXlsx(EXCEL_LOC);
////
////        for (Link link : links) {
////            List<Point> points = map.get(link.getDirectionId());
////            link.setPoints(points);
////        }
////
////        FileWriter fw = new FileWriter(JSON_LOC);
////        try{
////            ObjectMapper mapper = new ObjectMapper();
////            String jsonStr = mapper.writeValueAsString(links);
////            fw.write(jsonStr);
////        } catch (IOException e) {
////            e.printStackTrace();
////        } finally {
////            fw.flush();
////            fw.close();
////        }
//
////        String actualJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\doc\\outShortestPath.json";
////        List<OdPair> pairs = JsonUtil.readJsonFile(actualJsonFile);
////
////        for (OdPair pair : pairs) {
////            String linkStr = pair.getLinkStr();
////            String[] splitted = linkStr.split("n", 0);
////            pair.setUpStream(Integer.parseInt(splitted[1]));
////            pair.setDownStream(Integer.parseInt(splitted[2]));
////        }
////
////        JsonUtil.writeJsonFile(actualJsonFile, pairs);
//
//        String nodeFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes.json";
//        String nodeNeoFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes-new.json";
//        String linkFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\links.json";
//        String pathFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\paths-origin.json";
////        List<Node> nodes = JsonUtil.readNodeJsonFile((nodeFile));
////
////        List<NodeNeo> nodeNeos = new ArrayList<>();
////        for (Node node : nodes){
////            NodeNeo nodeNeo = new NodeNeo();
////            nodeNeo.setId(Integer.parseInt(node.getId()));
////            nodeNeo.setLat(Double.parseDouble(node.getY()));
////            nodeNeo.setLng(Double.parseDouble(node.getX()));
////            nodeNeo.setZone(Integer.parseInt(node.getZone()));
////            nodeNeos.add(nodeNeo);
////        }
////
////        JsonUtil.writeNodeJsonFile(nodeNeoFile, nodeNeos);
//
//        List<Link> links = JsonUtil.readLinkJsonFile(linkFile);
//        List<OdPair> pairs = JsonUtil.readJsonFile(pathFile);
//
//        for(OdPair pair : pairs){
//            String nodeStr = pair.getNodeStr();
//
//            nodeStr = nodeStr.replaceAll("] \\[", ", ").replaceAll("\\[", "").replaceAll("]","");
//            nodeStr = nodeStr.replaceAll("n", "").replaceAll(" ", "");
//            String[] splittedNodeStr = nodeStr.split(",", 0);
//
//            List<Point> points = new ArrayList<>();
//
//            for(int i = 0; i < splittedNodeStr.length - 1; i++){
//                if (splittedNodeStr[i].equals(splittedNodeStr[i + 1])){
//                    continue;
//                }
//
//                for (Link link : links){
////                    if(splittedNodeStr[i].equals("") || splittedNodeStr[i+1].equals("")){
////                        System.out.println(pair.getLinkStr());
////                    }
//
//                    if (link.getUpStream() == Integer.parseInt(splittedNodeStr[i]) &&
//                    link.getDownStream() == Integer.parseInt(splittedNodeStr[i + 1])){
//                        List<Point> mediates = link.getPoints();
////                        if(points.size() > 0){
////                            if (mediates.size() == 0){
////                                int id = link.getId();
////                                System.out.println(id);
////                            }
////                            mediates.remove(0);
////                        }
//                        points.addAll(mediates);
//                    }
//                }
//            }
//
//            pair.setPoints(points);
//        }
//
//        String pathJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\paths.json";
//
//        JsonUtil.writeJsonFile(pathJsonFile, pairs);
//    }


}
