package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RouteContent {
    @JsonProperty("TravelTime")
    private double travelTime;

    @JsonProperty("Nodes")
    private String nodeStr;

    @JsonProperty("TravelRisk")
    private double travelRisk;

    public double getTravelTime() {
        return travelTime;
    }

    public void setTravelTime(double travelTime) {
        this.travelTime = travelTime;
    }

    public String getNodeStr() {
        return nodeStr;
    }

    public void setNodeStr(String nodeStr) {
        this.nodeStr = nodeStr;
    }

    public double getTravelRisk() {
        return travelRisk;
    }

    public void setTravelRisk(double travelRisk) {
        this.travelRisk = travelRisk;
    }
}
