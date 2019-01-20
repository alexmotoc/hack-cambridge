package com.example.starter;

import java.util.List;

public class BoardStateResource {
    private final List<Integer> boats;
    private final List<HitItem> hits;
    private final Integer keanu;

    public BoardStateResource(List<Integer> boats, List<HitItem> hits, Integer keanu) {
        this.boats = boats;
        this.hits = hits;
        this.keanu = keanu;
    }

    public List<Integer> getBoats() {
        return boats;
    }

    public List<HitItem> getHits() {
        return hits;
    }

    public Integer getKeanu() {
        return keanu;
    }
}

