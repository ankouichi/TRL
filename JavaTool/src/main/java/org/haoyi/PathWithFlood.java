package org.haoyi;

import org.haoyi.entity.*;
import org.haoyi.util.ExcelUtil;
import org.haoyi.util.JsonUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class PathWithFlood {

    static final String PathWithoutFloodDir = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\paths-new.json";
//    static final String PathWithFloodDir = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\pathsWithFlood.json";
    static final String PrecipitationFileDir = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\flood\\temp_probabilities.xlsx";
    static final String ORIGINAL_PATH_JSON = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\outShortestPath-modified.json";
    static final String LINK_JSON = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\links-new.json";
    static final String jsFolder = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\";
    static final String FLOOD_PREFIX = "pathsWithFlood-";
    static final String FLOOD_SUFFIX = ".json";

    public static void main(String[] args) throws IOException {
        List<OdPair> pathWithoutFlood = JsonUtil.readPathJsonFile(PathWithoutFloodDir);
        int size = pathWithoutFlood.size();

        List<OdPair> firstHalf = new ArrayList<>(pathWithoutFlood.subList(0, size / 2));
        List<OdPairWithFlood> odwfs_1 = cvtOdPair2OdPairWF(firstHalf);
        String floodJsonFile_first = jsFolder + FLOOD_PREFIX + "severe-first" + FLOOD_SUFFIX;
        JsonUtil.write2JsonFile(floodJsonFile_first, odwfs_1);

        List<OdPair> secondHalf = new ArrayList<>(pathWithoutFlood.subList(size / 2, size));
        List<OdPairWithFlood> odwfs_2 = cvtOdPair2OdPairWF(secondHalf);
        String floodJsonFile_second = jsFolder + FLOOD_PREFIX + "severe-second" + FLOOD_SUFFIX;
        JsonUtil.write2JsonFile(floodJsonFile_second, odwfs_2);

        System.out.print("Finished!!");
    }

    private static List<OdPairWithFlood> cvtOdPair2OdPairWF(List<OdPair> odPairs) throws IOException {
        List<OdPairWithFlood> odPairWithFloods = new ArrayList<>();
        Map<String, List<Precipitation>> preMap = ExcelUtil.parsePrecipitationXlsx(PrecipitationFileDir);
        // use severe condition precipitation data
        List<Precipitation> severePrecipitations = preMap.get("severe");
        List<Link> links = JsonUtil.readLinkJsonFile(LINK_JSON);
        List<Route> routes = JsonUtil.readRouteJsonFile(ORIGINAL_PATH_JSON);

        for (OdPair path : odPairs) {
            OdPairWithFlood opwf = new OdPairWithFlood(path.getTravelTime(), path.getTravelRisk(), path.getLinkStr(), path.getNodeStr(), path.getUpStream(), path.getDownStream());

            // get paths by linkId, e.g. "n1000n2000"
            // there will be multiple paths by one specific linkId
            Route targetRoute = routes.stream().filter(route -> opwf.getLinkStr().equals(route.getLinkStr())).findFirst().orElse(null);
            if (targetRoute != null) {
                // get the exact one path
                RouteContent targetRC = targetRoute.getRoutes().stream().filter(r -> opwf.getTravelRisk() == r.getTravelRisk()).findFirst().orElse(null);
                if (targetRC != null) {
                    // collection of link info (points + precipitation)
                    List<FloodEntity> floodEntities = new ArrayList<>();
                    // get all nodes on the path
                    Integer[] nodes = MergeFiles.getIntermediates(targetRC.getNodeStr());
                    // iterate nodes
                    for (int i = 0; i < nodes.length - 1; i++) {
                        final int idx = i;
                        // get link by upstream and downstream nodes
                        Link targetLink = links.stream().filter(l -> l.getUpStream().equals(nodes[idx]) && l.getDownStream().equals(nodes[idx + 1])).findFirst().orElse(null);
                        if (targetLink != null) {
                            // the DirectionId
                            int dirtId = targetLink.getDirectionId();
                            // get the flooding info
                            Precipitation flooding = severePrecipitations.stream().filter(p -> dirtId == p.getId()).findFirst().orElse(null);
                            double floodRate = flooding != null ? flooding.getRate() : 0.0;
                            Precipitation precipitation = new Precipitation(dirtId, floodRate);
                            FloodEntity floodEntity = new FloodEntity(targetLink.getPoints(), precipitation);
                            floodEntities.add(floodEntity);
                        }
                    }

                    opwf.setFloods(floodEntities);
                }
            }

            odPairWithFloods.add(opwf);
        }

        return odPairWithFloods;
    }
}
