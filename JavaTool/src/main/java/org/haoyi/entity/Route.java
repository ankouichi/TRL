package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Route {
    @JsonProperty("LinkID")
    private String linkStr;

    private int upStream;
    private int downStream;

    private List<Point> points;

    private List<RouteContent> routes;

    public String getLinkStr() {
        return linkStr;
    }

    public void setLinkStr(String linkStr) {
        this.linkStr = linkStr;
    }

    public List<RouteContent> getRoutes() {
        return routes;
    }

    public void setRoutes(List<RouteContent> routes) {
        this.routes = routes;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    public int getDownStream() {
        return downStream;
    }

    public void setDownStream(int downStream) {
        this.downStream = downStream;
    }

    public int getUpStream() {
        return upStream;
    }

    public void setUpStream(int upStream) {
        this.upStream = upStream;
    }
}
