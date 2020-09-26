package org.haoyi;

import org.haoyi.entity.Link;
import org.haoyi.entity.Point;
import org.haoyi.entity.Precipitation;
import org.haoyi.entity.PrecipitationPoint;
import org.haoyi.util.ExcelUtil;
import org.haoyi.util.JsonUtil;

import java.io.IOException;
import java.util.*;

public class PrecipitationOperations {
    static final String PrecipitationXlsx = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\flood\\temp_probabilities.xlsx";
    static final String linkJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\links-new.json";

    static final String jsFolder = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\";
    static final String FLOOD_PREFIX = "flood-";
    static final String FLOOD_SUFFIX = ".json";
//    static final String lightPreJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\light-flood.json";
//    static final String moderatePreJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\moderate-flood.json";
//    static final String severePreJsonFile = "C:\\Users\\Daniel\\Documents\\GitHub\\TRL\\js\\severe-flood.json";

    public static void main(String[] args) throws IOException {
        Map<String, List<Precipitation>> preMap = ExcelUtil.parsePrecipitationXlsx(PrecipitationXlsx);
        List<PrecipitationPoint> prePoints;

        List<Link> links = JsonUtil.readLinkJsonFile(linkJsonFile);

        // iterate 3 precipitation list
        for (Map.Entry<String, List<Precipitation>> entry : preMap.entrySet()) {
            prePoints = new ArrayList<>();
            List<Precipitation> pres = entry.getValue();

            // iterate this precipitation sheet rows
            for (Precipitation pre : pres) {
                Optional<Link> ol = links.stream().filter(l -> l.getDirectionId() == pre.getId()).findFirst();
                if (ol.isPresent()) {
                    Link targetLink = ol.get();  // get the link with same direction_id

                    for (Point point : targetLink.getPoints()) {
                        // check the point exists in the result list or not
                        if (prePoints.stream().noneMatch(p -> p.getLat().equals(point.getLat()) &&
                                p.getLng().equals(point.getLng()) &&
                                p.getRate().equals(pre.getRate()))) {
                            prePoints.add(new PrecipitationPoint(point.getLat(), point.getLng(), pre.getRate()));
                        }
                    }
                }
            }

            String floodJsonFile = jsFolder + FLOOD_PREFIX + entry.getKey() + FLOOD_SUFFIX;
            JsonUtil.writeFloodJsonFile(floodJsonFile, prePoints);
        }
    }
}
