# BattleReeves
A game of probabilistic battle ships. 

## Inspiration
We heard Improbable's talk on their new probablistic programming language, Keanu, and thought it would be a lot of fun to try it out. We decided to focus on the game Battleships, since it is simple enough to program the graphics and logic in a hackathon, but has lots of hidden state to apply probabilistic programming on, and far too many configurations to simply brute-force.

## What it does 
First, the player can position their five ships on the board. The application then allows the player to step through running two different probabilistic AIs to play the game - one using Keanu, and one using more combinatorial heuristics. At each stage, the selected AI rates the probability of one of the player's ships being under each square of the board, based on a uniform prior and its observations of hits and misses so far in the game. The player can click a button to aim at the square rated as most likely and move on to the next turn.

## How it does it
The AIs run on a Java backend, and communicate with the frontend via a REST API running on a Spring server. The frontend combines available online components with pure typescript code to create multiple game instances, keep track of valid/invalid states and visualise the probabilities in a dynamic heatmap.

## Screens 

### Place your ships
![place](https://github.com/alexmotoc/hack-cambridge/blob/master/screens/place.JPG)

### Take hits 
![hits](https://github.com/alexmotoc/hack-cambridge/blob/master/screens/hit.JPG)

## Technologies
* angular.js
* css
* html
* java
* keanu
* node.js
* spring
* typescript

