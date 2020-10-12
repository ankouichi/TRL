package org.haoyi.entity;

import java.util.List;

public class FloodEntity {
    private List<Point> points;
    private Precipitation flood;

    public FloodEntity(List<Point> pointList, Precipitation precipitation) {
        this.points = pointList;
        this.flood = precipitation;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    public Precipitation getFlood() {
        return flood;
    }

    public void setFlood(Precipitation flood) {
        this.flood = flood;
    }
}
