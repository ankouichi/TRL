package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class OdPairWithFlood {
    @JsonProperty("TravelTime")
    private double travelTime;

    @JsonProperty("LinkID")
    private String linkStr;

    @JsonProperty("Nodes")
    private String nodeStr;

    @JsonProperty("TravelRisk")
    private double travelRisk;

    private int upStream;
    private int downStream;

    public OdPairWithFlood(double tTime, double tRisk, String linkId, String nodes, int up, int down) {
        this.travelTime = tTime;
        this.travelRisk = tRisk;
        this.linkStr = linkId;
        this.nodeStr = nodes;
        this.upStream = up;
        this.downStream = down;
    }

    private List<FloodEntity> floods;

    public double getTravelTime() {
        return travelTime;
    }

    public void setTravelTime(double travelTime) {
        this.travelTime = travelTime;
    }

    public String getLinkStr() {
        return linkStr;
    }

    public void setLinkStr(String linkStr) {
        this.linkStr = linkStr;
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

    public int getUpStream() {
        return upStream;
    }

    public void setUpStream(int upStream) {
        this.upStream = upStream;
    }

    public int getDownStream() {
        return downStream;
    }

    public void setDownStream(int downStream) {
        this.downStream = downStream;
    }

    public List<FloodEntity> getFloods() {
        return floods;
    }

    public void setFloods(List<FloodEntity> floods) {
        this.floods = floods;
    }
}
