package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OdPair {
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
}
