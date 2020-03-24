package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Node {
    @JsonProperty("ID")
    private String id;
    @JsonProperty("X")
    private String x;
    @JsonProperty("Y")
    private String y;
    @JsonProperty("Z")
    private String z;
    @JsonProperty("Zone")
    private String zone;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public String getY() {
        return y;
    }

    public void setY(String y) {
        this.y = y;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }
}
