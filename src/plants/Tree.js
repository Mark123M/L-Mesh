/*
Generates trees using the TERNARY BRANCHING MODEL with a stochastic parametric L-system
*/
import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'

const len = 4;
const ang = 100;
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

const leaf_gen = 3; //generation where leaf starts growing.


const generateRules = (symbol) =>{
  if(symbol.type == "!"){
    
    const ruleSet = [
      {rule: [{type: "!", width: symbol.width * vr}],  prob: 1.0},
      //increase width/diameter of all current branches.
      //(this is what i was thinking in my original idea as well :o)
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "F") {
    console.log("THIS BRANCH HAS GEN: ", symbol.gen);
    const p = symbol.gen < 3? 0.0 : symbol.gen / numGens;
    const ruleSet = [
      {rule: [{type: "F", len: symbol.len * lr, gen: symbol.gen}], prob: 1.0 - p}, 
      {rule: [{type: "F", len: symbol.len * lr, gen: symbol.gen}, {type: "L", sz: 3}],  prob: p},
      //thicken all current branches for the new generation.
      //(this is what i was thinking in my original idea :o)
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "A") {
    const ruleSet = [
      {rule: [{type: "!", width: 2.5},
              //{type: "F", len: 50 }, //initial extension

              {type: "["},
              {type: "+", angle: a}, 
              {type: "F", len: 80, gen: symbol.gen + 1}, //left branch from extension
              {type: "A", gen: symbol.gen+1},
              {type: "]"}, 

              {type: "["},
              {type: "-", angle: a/3},
              {type: "F", len: 80, gen: symbol.gen + 1}, //middle branch from extension (tilted right)
              {type: "A", gen: symbol.gen+1},
              {type: "]"},

              {type: "["},
              {type: "-", angle: a},
              {type: "F", len: 80, gen: symbol.gen + 1}, //right branch from extension 
              {type: "A", gen: symbol.gen + 1},
              {type: "]"},
      ], prob: 0.6},
      {rule: [{type: "!", width: 2.5},
              //{type: "F", len: 50 }, //initial extension

              {type: "["},
              {type: "+", angle: a}, 
              {type: "F", len: 80, gen: symbol.gen + 1}, //left branch from extension
              {type: "A", gen: symbol.gen+1},
              {type: "]"}, 

              {type: "["},
              {type: "-", angle: a},
              {type: "F", len: 80, gen: symbol.gen + 1}, //right branch from extension (tilted right)
              {type: "A", gen: symbol.gen+1},
              {type: "]"},

             
      ], prob: 0.3},
      {rule: [{type: "!", width: 2.5},
              //{type: "F", len: 50 }, //initial extension
              {type: "["},
              {type: "-", angle: 0},
              {type: "F", len: 80, gen: symbol.gen + 1}, //right branch from extension (tilted right)
              {type: "A", gen: symbol.gen+1},
              {type: "]"},
      ], prob: 0.05},
      {rule: [{type: "!", width: 2.5},
      ], prob: 0.05},
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
    
    p5.noLoop();
  }

  function drawLeaf(sz) {
    p5.push();
    p5.scale(sz * 0.5);
    p5.noStroke();
    p5.beginShape();
    p5.fill(0, 255, 0);
    for(let i = 45; i < 135; i++) {
      var rad = 15;
      var x = rad * Math.cos(i * Math.PI/180);
      var y = rad * Math.sin(i * Math.PI/180);
      p5.vertex(x, y)
    }
    for(let i = 135; i > 40; i--) {
      var rad = 15;
      var x = rad * Math.cos(i * Math.PI/180);
      var y = rad * Math.sin(-1 * i * Math.PI/180) + 20;
      p5.vertex(x, y)
    }
    p5.endShape(p5.CLOSE);
    p5.pop();
  }

  function applyRule(symbol) {
    if(symbol.type == "!") {
      p5.strokeWeight(symbol.width);
    }
    else if (symbol.type == "F") {
      const factor = p5.random(-10, 15);
      p5.stroke("#805333");
      p5.line(0, 0, 0, -1* ( symbol.len + factor));
      p5.translate(0, -1 * (symbol.len + factor));
    }
    else if (symbol.type == "+") {
      const factor = p5.random(-5, 5);
      p5.rotate(Math.PI/180 * -1* ( symbol.angle + factor));
    }
    else if (symbol.type == "-") {
      const factor = p5.random(-5, 5);
      p5.rotate(Math.PI/180 * (symbol.angle + factor));
    }
    else if (symbol.type == "[") {
      p5.push();
    }
    else if (symbol.type == "]") {
      p5.pop();
    }
    else if (symbol.type == "L") {
      //p5.triangle(0, 0, 5, 0, 3, 2);
      drawLeaf(symbol.sz);
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
    console.log(next, "NEW SYMBOLS FOR TREE");
    return next;
  }

  p5.draw = async () => {
    p5.background("#FFFFFF");
    //p5.rotate(p5.millis/100000);
    
    // Generate our L-System from the start
    symbols = [{type: "!", width: 2.5}, {type: "F", len: 100, gen: 1}, {type: "+", angle: p5.random(-10, 10)}, {type: "A", gen: 1}];
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
     // await sleep(3);
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