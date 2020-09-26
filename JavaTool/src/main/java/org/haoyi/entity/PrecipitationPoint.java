package org.haoyi.entity;

public class PrecipitationPoint {
    private Double lat;
    private Double lng;
    private Double rate;

    public PrecipitationPoint(double x, double y, double rate) {
        this.lat = x;
        this.lng = y;
        this.rate = rate;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }
    public Double getRate() {
        return rate;
    }
}
