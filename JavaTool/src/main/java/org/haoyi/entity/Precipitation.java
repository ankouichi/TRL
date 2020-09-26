package org.haoyi.entity;

public class Precipitation {
    private int id;
    private Double rate;

    public Precipitation(int directId, double ebRate) {
        this.id = directId;
        this.rate = ebRate;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Double getRate() {
        return rate;
    }

    public void setRate(Double rate) {
        this.rate = rate;
    }
}
