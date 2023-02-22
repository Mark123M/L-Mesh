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

const Ta = 4 /* developmental switch time */
const TL = 9 /* leaf growth limit */
const TK = 5 /* flower growth limit */
//#include L(0),L(1),...,L(TL) /* leaf shapes */ 

//const leaves_scale = 2; 
//#include K(0),K(1),...,K(TK) /* flower shapes */

const generateRules = (symbol) =>{
  if (symbol.type == "a" && symbol.t < Ta) {
    const ruleSet = [
      {rule: [{type: "F", len: 20}, //draw stem

              {type: "["},
              {type: "+", angle: 45}, 
              {type: "f", len: 5},
              {type: "L", sz: 1}, //draw left leaf
              {type: "]"},
              
              {type: "a", t: symbol.t + 1},
      ], prob: 0.3},
      {rule: [{type: "F", len: 20}, //draw stem

              {type: "["},
              {type: "-", angle: 45}, 
              {type: "f", len: 5},
              {type: "L", sz: 1}, //draw right leaf
              {type: "]"},
              
              {type: "a", t: symbol.t + 1},
      ], prob: 0.3},
      {rule: [{type: "F", len: 20}, //draw stem

              {type: "["},
              {type: "+", angle: 45}, 
              {type: "f", len: 5},
              {type: "L", sz: 1}, //draw both leaves
              {type: "]"},
              {type: "["},
              {type: "-", angle: 45},
              {type: "f", len: 5},
              {type: "L", sz: 1},
              {type: "]"},
              
              {type: "a", t: symbol.t + 1},
      ], prob: 0.4},
    ]
    return chooseOne(ruleSet);
  }
  else if(symbol.type == 'a' && symbol.t == Ta) {
    const ruleSet = [
      {rule: [{type: "F", len: 50}, //draw flowering APEX
              {type: "A"},
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if(symbol.type == 'A') {
    const ruleSet = [
      {rule: [{type: "K", sz: 1}], prob: 1.0}
    ]
    return chooseOne(ruleSet);
  }
  else if(symbol.type == 'L' && symbol.sz < TL) { 
    const ruleSet = [
      {rule: [{type: "L", sz: symbol.sz + 1}], prob: 1.0} //growing all leaves
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "K" && symbol.sz < TK) {
    const ruleSet = [
      {rule: [{type: "K", sz: symbol.sz + 1}], prob: 1.0} //growing leaf
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "F") {
    const ruleSet = [
      {rule: [{type: "F", len: symbol.len + 10}], prob: 1.0} //growing stem
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
    p5.strokeWeight(5);

    p5.noLoop();
  }

  function drawLeaf(sz) {
    p5.push();
    p5.scale(sz * 0.5);
    p5.noStroke();
    p5.beginShape();
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

  function drawFlower(sz) {
    p5.noStroke();
    p5.push();
    p5.translate(p5.random(30), -10);
    p5.scale(sz * 2.4);
    p5.fill(p5.random(255), p5.random(255), p5.random(255));
    p5.ellipse(0,0,20,20)
    p5.ellipse(0-15,0+5,20,20)
    p5.ellipse(0-25,0-5,20,20)
    p5.ellipse(0-17,0-20,20,20)
    p5.ellipse(0,0-15,20,20)
    // fill(255, 230, 51);
    p5.fill (225, p5.random(225), p5.random(225));
    p5.ellipse(0-12,0-7,22,22) 
    p5.pop();
  }

  function applyRule(symbol) {
    if (symbol.type == "F") {
      p5.strokeWeight(8);
      p5.stroke("#9ea93f");
      p5.line(0, 0, 0, -1* symbol.len);
      p5.translate(0, -1 * symbol.len);
    }
    else if (symbol.type == 'f') {
      p5.translate(0, symbol.len);
    }
    else if (symbol.type == "L") {
      //p5.triangle(0, 0, 5, 0, 3, 2);
      drawLeaf(symbol.sz);
    }
    else if (symbol.type == "K") {
      //p5.circle(0, 0, 100);
      drawFlower(symbol.sz)
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
    symbols = [{type: "a", t: 1}];
    console.log(symbols, "CURRENT SYMBOLS");
    for(let i = 0; i < numGens; i ++) {
      symbols = generate();
      console.log(symbols, "NEW SYMBOLS");
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