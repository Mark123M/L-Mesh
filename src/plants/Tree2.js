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

const r1 = 0.96;
const r2 = 0.96;
const a1 = 5;
const a2 = -30;

const p1 = 90;
const p2 = 90;

const w0 = 30;
const q = 0.6;
const e = 0.45;
const min = 20.0;

const leaf_gen = 3; //generation where leaf starts growing.

const generateRules = (symbol) =>{
  if (symbol.type == "A" && symbol.len >= min) {

    const ruleSet = [
      {rule: [
        {type: "!", width: symbol.wid},
        {type: "F", len: turn_and_roll_len(0, symbol.roll_angle, symbol.len)}, //creates new internode

        {type: "["},
        {type: "+", angle: turn_and_roll_angle(a1, p1, symbol.len)}, //rotates for new apex
        {type: "A", len: symbol.len *r1, wid: symbol.wid * (Math.pow(q, e)), roll_angle: p1}, //creates new apex, updating len, wid, roll_angle
        {type: "]"},

        {type: "["},
        {type: "+", angle: -1 * turn_and_roll_angle(a2, p2, symbol.len)}, //rotates for new apex
        {type: "A", len: symbol.len *r2, wid: symbol.wid * (Math.pow((1-q), e)), roll_angle: p2}, //sdoijfosidjfoi
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

//if this works im fucking einstein
function turn_and_roll_angle(turn_angle, roll_angle, len) {
  const l = Math.sqrt(len*len + len*len - 2*len*len*Math.cos(turn_angle * (Math.PI/180)));

  let delta;
  roll_angle %= 360;
  if(0 <= roll_angle && roll_angle <= 90) {
    delta = roll_angle;
  }
  else if (roll_angle <= 180) {
    delta = 180 - roll_angle;
  }
  else if (roll_angle <= 270) {
    delta = roll_angle - 180;
  }
  else if (roll_angle <= 360) {
    delta = 360 - roll_angle;
  }

  const a = l * Math.cos(delta * (Math.PI/180));
  let new_angle = Math.atan(a/len) * (180 / Math.PI);
  if (roll_angle <= 180) {
    new_angle *= -1;
  }
  else if (roll_angle <= 270) {
    new_angle *= -1;
  }

  return new_angle;
}

//if this works im fucking einstein
function turn_and_roll_len(turn_angle, roll_angle, len) {
  const l = Math.sqrt(len*len + len*len - 2*len*len*Math.cos(turn_angle * (Math.PI/180)));

  let delta;
  roll_angle %= 360;
  if(0 <= roll_angle && roll_angle <= 90) {
    delta = roll_angle;
  }
  else if (roll_angle <= 180) {
    delta = 180 - roll_angle;
  }
  else if (roll_angle <= 270) {
    delta = roll_angle - 180;
  }
  else if (roll_angle <= 360) {
    delta = 360 - roll_angle;
  }

  const a = l * Math.cos(delta * (Math.PI/180));
  const new_len = Math.sqrt(a*a + len*len)
  return new_len;
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
    /*symbols = [{type: "F", len: 200}, {type: "["}, {type: "-", angle: 45}, {type: "F", len: 100}, {type: "["}, {type: "-", angle:45},
               {type: "F", len: 100}, {type: "]"}, {type:"F", len: 100}, {type: "]"}, {type: "F", len: 150}, 
               {type: "["}, {type: "-", angle: turn_and_roll_angle(45, 137.5, 100)}, {type: "F", len:100}, {type:"]"},
               {type: "F", len: turn_and_roll_len(45, 137.5, 100)}
              ]; */

    symbols = [{type: "A", len: 100, wid: w0, roll_angle: 0}];

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
 // console.log(roll_and_pitch_angle(30, 120, 5));
  console.log(turn_and_roll_angle(30, 137, 100));
  console.log(turn_and_roll_angle(-20, 137, 100));
  console.log(turn_and_roll_angle(-20, 274, 100));
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}