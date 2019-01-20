package com.example.starter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class Controller {

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/calculate")
    public ResponseEntity<BoardResponseResource> calculate(@RequestBody BoardStateResource res) {
        List<Integer> ships = res.getBoats();
        ArrayList<Integer> hits = new ArrayList<Integer>();
        ArrayList<Integer> misses = new ArrayList<Integer>();
        for (HitItem r: res.getHits()) {
            if (r.getHit() == 1) {
                hits.add(r.getId());
            }
            if (r.getHit() == 0) {
                misses.add(r.getId());
            }
        }
        Model model = new Model(ships, hits, misses);
        try {
            double[] probs;
            if (res.getKeanu() == 1) {
                probs = model.runKeanu();
            } else {
                probs = model.run();
            }
            return ResponseEntity.ok(new BoardResponseResource(probs));
        } catch (Exception e) {
            System.out.println("ERROR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
