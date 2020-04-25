package org.haoyi;

import org.haoyi.entity.*;
import org.haoyi.util.ExcelUtil;
import org.haoyi.util.JsonUtil;
import org.haoyi.util.XmlUtil;
import org.xml.sax.SAXException;
import javax.xml.parsers.*;
import java.io.*;
import java.util.*;

import static org.haoyi.util.ExcelUtil.parsePointsXlsx;
import static org.haoyi.util.XmlUtil.parseLinksXML;

/**
 * Read data from XML to POJO
 *
 */
public class MergeFiles
{

    static String XML_LOC =  "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\doc\\Links.xml";
    static String JSON_LOC = "C:\\Users\\Daniel\\Documents\\Directions.json";
    static String INTERMEDIATE_XLSX =  "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\doc\\intermediatePoints.xlsx";
    static String LINK_XML = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\doc\\Links.xml";
    static String ORIGINAL_PATH_JSON = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\outShortestPath-modified.json";
    static String LINK_JSON = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\links-new.json";

    private static Integer[] getIntermediates(String str){
        String input = str.replaceAll("] \\[", ", ").replaceAll("\\[", "").replaceAll("]","");
        input = input.replaceAll("n", "").replaceAll(" ", "");
        String[] numStrs = input.split(",", 0);
        Integer[] nums = new Integer[numStrs.length];
        for(int i = 0; i < numStrs.length; i++){
            nums[i] = Integer.parseInt(numStrs[i]);
        }

        LinkedHashSet<Integer> linkedHashSet = new LinkedHashSet<>(Arrays.asList(nums));
        return linkedHashSet.toArray(new Integer[] {});
    }

//    public static void main( String[] args ) throws IOException {
//        List<Route> routeList = new ArrayList<>();
//        Route route1 = new Route();
//        RouteContent content1 = new RouteContent();
//        content1.setNodeStr("[n1002, n1000]");
//        content1.setTravelRisk(0.006998730357736349);
//        content1.setTravelTime(8.005760192871094);
//        List<RouteContent> list1 = new ArrayList<>();
//        list1.add(content1);
//        route1.setLinkStr("n1002n1000");
//        route1.setRoutes(list1);
//
//        Route route2 = new Route();
//        RouteContent content2 = new RouteContent();
//        content2.setNodeStr("[n1002, n1001]");
//        content2.setTravelRisk(0.025438755750656128);
//        content2.setTravelTime(64.58867645263672);
//
//        RouteContent content3 = new RouteContent();
//        content3.setNodeStr("[n1002, n1001]");
//        content3.setTravelRisk(0.02341567352414131);
//        content3.setTravelTime(177.14785766601562);
//        List<RouteContent> list2 = new ArrayList<>();
//        list2.add(content2);
//        list2.add(content3);
//        route2.setLinkStr("n1002n1001");
//        route2.setRoutes(list2);
//
//        List<Route> routes = new ArrayList<>();
//        routes.add(route1);
//        routes.add(route2);
//
//        String pathJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\test.json";
//        JsonUtil.writeRouteJsonFile(pathJsonFile, routes);
//    }

    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
//        List<Link> links = parseLinksXML(LINK_XML);
//        Map<Integer, List<Point>> map = parsePointsXlsx(INTERMEDIATE_XLSX);
//
//        for (Link link : links) {
//            List<Point> points = map.get(link.getDirectionId());
//            link.setPoints(points);
//        }
//
//        List<OdPair> pairs = JsonUtil.readJsonFile(ORIGINAL_PATH_JSON);
//
//        for (OdPair pair : pairs) {
//            String linkStr = pair.getLinkStr();
//            String[] splitted = linkStr.split("n", 0);
//            pair.setUpStream(Integer.parseInt(splitted[1]));
//            pair.setDownStream(Integer.parseInt(splitted[2]));
//        }

//        String nodeFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes.json";
//        String nodeNeoFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\nodes-new.json";
//        List<Node> nodes = JsonUtil.readNodeJsonFile((nodeFile));
//
//        List<NodeNeo> nodeNeos = new ArrayList<>();
//        for (Node node : nodes){
//            NodeNeo nodeNeo = new NodeNeo();
//            nodeNeo.setId(Integer.parseInt(node.getId()));
//            nodeNeo.setLat(Double.parseDouble(node.getY()));
//            nodeNeo.setLng(Double.parseDouble(node.getX()));
//            nodeNeo.setZone(Integer.parseInt(node.getZone()));
//            nodeNeos.add(nodeNeo);
//        }
//
//        JsonUtil.writeNodeJsonFile(nodeNeoFile, nodeNeos);

        List<Link> links = JsonUtil.readLinkJsonFile(LINK_JSON);
        List<Route> routes = JsonUtil.readRouteJsonFile(ORIGINAL_PATH_JSON);
        List<OdPair> odPairs = new ArrayList<>();

        for(Route route : routes){
            for(RouteContent rc : route.getRoutes()){
                String linkStr = route.getLinkStr();
                String[] splitted = linkStr.split("n", 0);

                OdPair odPair = new OdPair();
                odPair.setUpStream(Integer.parseInt(splitted[1]));
                odPair.setDownStream(Integer.parseInt(splitted[2]));
                odPair.setLinkStr(route.getLinkStr());
                odPair.setTravelTime(rc.getTravelTime());
                odPair.setTravelRisk(rc.getTravelRisk());
                odPair.setNodeStr(rc.getNodeStr());

                Integer[] intermediates = getIntermediates(rc.getNodeStr());
                List<Point> points = new ArrayList<>();

                for(int i = 0; i < intermediates.length - 1; i++){
                    for (Link link : links){
                        if (link.getUpStream().equals(intermediates[i]) &&
                                link.getDownStream().equals(intermediates[i + 1])){
                            List<Point> mediates = link.getPoints();

                            if(points.size() > 0){
                                if (mediates.size() < 1){
                                    System.out.println(link.getId());
                                }
                                for (int j = 1; j < mediates.size(); j++){
                                    points.add(mediates.get(j));
                                }
                            } else {
                                points.addAll(mediates);
                            }
                        }
                    }
                }

                odPair.setPoints(points);
                odPairs.add(odPair);
            }
        }

        String pathJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\paths-new.json";

        JsonUtil.writeJsonFile(pathJsonFile, odPairs);
    }

//    public static void main( String[] args ) throws IOException, SAXException, ParserConfigurationException {
//        List<Link> links = XmlUtil.parseLinksXML(XML_LOC);
//        Map<Integer, List<Point>> map = ExcelUtil.parsePointsXlsx(INTERMEDIATE_XLSX);
//
//        for (Link link : links){
//            List<Point> points = map.get(link.getDirectionId());
//            if (link.getDirection() == 1){
//                link.setPoints(points);
//            } else {
//                List<Point> reversePoints = new ArrayList<>();
//
//                for(int i = points.size() - 1; i > -1; i--){
//                    reversePoints.add(points.get(i));
//                }
//
//                link.setPoints(reversePoints);
//            }
//        }
//
//        String linkFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\links-new.json";
//        JsonUtil.writeLinkJsonFile(linkFile, links);
//    }
}
