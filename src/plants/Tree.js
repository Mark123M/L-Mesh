import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'

const len = 4;
const ang = 25;
const numGens = 5;
const width = 1440;
const height = 800;

let drawRules;
//let symbols = "X";
let symbols = [{type: "!", width: 2,}, {type: "F", len: 120}, {type: "+", angle: 10}, {type: "A"}]

/*
F Move forward and draw a line. 
f Move forward without drawing a line. 
+ Turn left. 
− Turn right. 
\ Roll left.
/ Roll right. 
| Turn around. 
$ Rotate the turtle to vertical. 
[ Start a branch. (saving the current state for position and angle)
] Complete a branch. (restore the saved state, "going back" to prev position) 
! Sets the diameter of segments.  
` Increment the current color index. 
% Cut off the remainder of the branch.  */

const d1 = 94.74; //divergence angle 1
const d2 = 132.63 //divergence angle 2
const a = 30 //branching angle
const lr = 1.109 //elongation rate
const vr = 1.732 //diameter increase rate.



const generateRules = (symbol) =>{
  if(symbol.type == "!"){
    const ruleSet = [
      {rule: [{type: "!", width: symbol.width * vr}],  prob: 1.0 },
      //increase width/diameter of all current branches.
      //(this is what i was thinking in my original idea as well :o)
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "F") {
    const ruleSet = [
      {rule: [{type: "F", len: symbol.len * lr}], prob: 1.0}, 
      //thicken all current branches for the new generation.
      //(this is what i was thinking in my original idea :o)
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "A") {
    const ruleSet = [
      {rule: [{type: "!", width: 2},
              //{type: "F", len: 50 }, //initial extension

              {type: "["},
              {type: "+", angle: a}, 
              {type: "F", len: 90}, //left branch from extension
              {type: "A"},
              {type: "]"}, 

              {type: "["},
              {type: "-", angle: a/3},
              {type: "F", len: 80}, //middle branch from extension (tilted right)
              {type: "A"},
              {type: "]"},

              {type: "["},
              {type: "-", angle: a},
              {type: "F", len: 80}, //right branch from extension 
              {type: "A"},
              {type: "]"},
      ], prob: 1.0}
    ]
    return chooseOne(ruleSet);
  }
}
function chooseOne(ruleSet) {
  let n = Math.random(); // Random number between 0-1
  let t = 0;
  for(let i = 0; i < ruleSet.length; i++) {
    t += ruleSet[i].prob; // Keep adding the probability of the options to total
    if(t > n) { // If the total is more than the random value
      return ruleSet[i].rule; // Choose that option
    }
  }
  return "";
}  


function sketch(p5) {
  p5.setup =() => {
    p5.createCanvas(width, height);
    p5.strokeWeight(2);
    drawRules = {
      "A": () => {
        // Draw circle at current location
        p5.noStroke();
        p5.fill("#E5CEDC");
        p5.circle(0, 0, len*2);
      },  
      "B": () => {
        // Draw circle at current location
        p5.noStroke();
        p5.fill("#FCA17D");
        p5.circle(0, 0, len*2);
      },
      "F": () => {
        // Draw line forward, then move to end of line
        p5.stroke("#9ea93f");
        p5.line(0, 0, 0, -len);
        p5.translate(0, -len);
      },
      "+": () => {
        // Rotate right
        p5.rotate(Math.PI/180 * -ang);
      },
      "-": () => {
        // Rotate right
        p5.rotate(Math.PI/180 * ang);
      },
      // Save current location
      "[": () => {
        p5.push();
      },
      // Restore last location
      "]": () => {
        p5.pop();
      }
    };
    p5.noLoop();
  }

  function applyRule(symbol) {
    if(symbol.type == "!") {
      p5.strokeWeight(symbol.width);
    }
    else if (symbol.type == "F") {
      p5.stroke("#9a704e");
      p5.line(0, 0, 0, -1* symbol.len);
      p5.translate(0, -1 * symbol.len);
    }
    else if (symbol.type == "+") {
      p5.rotate(Math.PI/180 * -1* symbol.angle);
    }
    else if (symbol.type == "-") {
      p5.rotate(Math.PI/180 * symbol.angle);
    }
    else if (symbol.type == "[") {
      p5.push();
    }
    else if (symbol.type == "]") {
      p5.pop();
    }
    
  }
  
  function generate() {
    let next = [];
    //console.log(symbols, "CURRENT SYMBOLS");

    for(let i = 0; i < symbols.length; i ++) {
      let s = symbols[i];
      let s2 = generateRules(s);
      //console.log(s + "SYMBOL "+i+ "TURNS TO " + s2);
      if(s2){
        next = next.concat(s2);
      }
      else{
        next = next.concat(s);
      }
    }
    return next;
  }

  p5.draw = async () => {
    p5.background(28);
    
    // Generate our L-System from the start
    symbols = [{type: "!", width: 2}, {type: "F", len: 120}, {type: "+", angle: 10}, {type: "A"}];
   // console.log(symbols, "CURRENT SYMBOLS");
    for(let i = 0; i < numGens; i ++) {
      symbols = generate();
   //   console.log(symbols, "NEW SYMBOLS");
    }
    
    // Draw L-System
    p5.push(); //save previous state
    p5.translate(width/2, height);
    for(let i = 0; i < symbols.length; i ++) {
      let s = symbols[i];
      await sleep(3);
      applyRule(s);
    }
    p5.pop(); 
  }
  
  p5.mouseReleased=()=> {
    p5.draw();
  }
  
  const sleep = (millis) => { 
    return new Promise(resolve => setTimeout(resolve, millis)) 
  }

}



export default function Plant() {
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}