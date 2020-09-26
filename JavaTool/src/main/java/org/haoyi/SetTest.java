package org.haoyi;

import org.haoyi.entity.PrecipitationPoint;

import java.util.HashSet;

public class SetTest {

    public static void main(String[] args) {
        HashSet<PrecipitationPoint> nums = new HashSet<>();

        PrecipitationPoint pp1 = new PrecipitationPoint(1.0, 1.0, 1.0);
        PrecipitationPoint pp2 = new PrecipitationPoint(1.0, 1.0, 1.0);

        nums.add(pp1);
        nums.add(pp2);
        nums.add(pp1);

        System.out.println(nums.size());

    }

}
