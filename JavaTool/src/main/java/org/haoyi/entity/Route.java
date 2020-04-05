package org.haoyi.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Route {
    @JsonProperty("LinkID")
    private String linkStr;

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
}
