/*
Generates trees using a MONOPODIAL MODEL with a stochastic parametric L-system
*/
import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'

const numGens = 9;
const width = 1440;
const height = 800;

let drawRules;
//let symbols = "X";
let symbols;

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

const r1 = 0.95;
const r2 = 0.75;
const a1 = 10;
const a2 = -20;

const p1 = -70;
const p2 = 70;

const w0 = 40;
const q = 0.6
const e = 0.45
const min = 25.0

const leaf_gen = 3; //generation where leaf starts growing.

const generateRules = (symbol) =>{
  if (symbol.type == "A") {

    const ruleSet = [
      {rule: [
        {type: "!", width: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "+", angle: a1},
        {type: "A", len: roll_and_pitch_len(p1, symbol.len) *r1, wid: symbol.wid * (Math.pow(q, e))},
        {type: "]"},

        {type: "["},
        {type: "+", angle: a2},
        {type: "A", len: roll_and_pitch_len(p2, symbol.len) *r2, wid: symbol.wid * (Math.pow((1-q), e))},
        {type: "]"},

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
}

//this function transforms a roll followed by a pitch to 2d coordinates
//returns the length of the resulting branch and the angle w.r.t the 2d plane 
//will double check for correctness.

function roll_and_pitch_angle(roll_angle, pitch_angle, len) {
  let new_angle, new_length;
  const a = Math.sqrt(len*len + len*len - 2 *len*len*Math.cos(roll_angle * (Math.PI/180)))
  const b = Math.sqrt(len*len + len*len - 2 *len*len*Math.cos(pitch_angle * (Math.PI/180)))
 
  const c = Math.sqrt(a*a + b*b);
  //console.log(a +" "+b+" "+c);

  new_angle = Math.acos((len*len + len*len - c*c) / (2*len*len))
  new_length = len * Math.sin(pitch_angle * (Math.PI/180));
  
  return new_angle * (180/Math.PI);
 // console.log("New angle: "+new_angle +"New length: "+new_length);
}

function roll_and_pitch_len(pitch_angle, len) {
  let new_length = len * Math.sin(pitch_angle * (Math.PI/180));
  return new_length;
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
      const factor = 0 // p5.random(-10, 10);
      p5.stroke("#805333");
      p5.line(0, 0, 0, -1* ( symbol.len + factor));
      p5.translate(0, -1 * (symbol.len + factor));
    }
    else if (symbol.type == "+") {
      const factor = 0 // p5.random(-5, 5);
      p5.rotate(Math.PI/180 * -1* ( symbol.angle + factor));
    }
    else if (symbol.type == "-") {
      const factor = 0//p5.random(-5, 5);
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
    
    // Generate our L-System from the start
    symbols = [{type: "A", len: 300, wid: w0}];
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
  //console.log(Math.cos(Math.PI/2));
 // roll_and_pitch(30, 120, 5, "TESTING ROLL AND PITCH FUNCTION");
  console.log(roll_and_pitch_angle(30, 120, 5));
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}