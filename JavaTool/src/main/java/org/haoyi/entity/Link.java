package org.haoyi.entity;

import java.util.List;

public class Link {
    private Integer id;
    private Integer upStream;
    private Integer downStream;
    private Integer directionId;
    private List<Point> points;

    public Integer getUpStream() {
        return upStream;
    }

    public void setUpStream(Integer upStream) {
        this.upStream = upStream;
    }

    public Integer getDownStream() {
        return downStream;
    }

    public void setDownStream(Integer downStream) {
        this.downStream = downStream;
    }

    public List<Point> getPoints() {
        return points;
    }

    public void setPoints(List<Point> points) {
        this.points = points;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDirectionId(Integer directionId) {
        this.directionId = directionId;
    }

    public Integer getDirectionId(){
        return directionId;
    }
}
