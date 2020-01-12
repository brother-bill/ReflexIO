# ReflexIO
<img src="https://github.com/TahaBilalCS/ReflexIO/blob/master/app/demo/reflexIO.gif" width="600" height="498" />

## Description
ReflexIO is a game I created to share with friends and teammates to practice their right click movement. A player can select a difficulty
of their choosing and must move their character to dodge incoming enemies. The game tracks the survival time of the player and the amount
of clicks they use to move around. 
<br/><br/>
Based on player feedback, I implemented controls that allows the user to avoid having to use their keyboard to restart the game. 
This prevents interrupting the flow of the game and allows for better replayability. 
<br/><br/>
The game is used by dozens of friends/teammates to help warm up for fun or before tournaments.

## Implementation
The most difficult part of creating this game was to ensure everyone has the same experience regardless of what computer and resolution they are using.

Making the game adjust it's size based on the own player's screen resolution affected the amount of time the player had to react to enemies.
If I try to scale the resolution to address this, it caused some distortion that ultimately affects the feel of the game. 
The best solution was to create a fixed size for the game. 

Another issue was adjusting to the processing speed of each players' computers. I had to make the game run on a certain FPS to ensure everything moved at the same speed.
Each frame, the game has to redraw the canvas and change the player and enemies' position based on the elapsed time between the new frame and old frame.
This allowed the game to stabilize on different computers.


## Running Tests
Tests were run using mocha and chai to test the math for some of my calculations. 
Run the following commands in the root folder:

```
npm install
npm run test
```

## Author
**Bilal Taha**


