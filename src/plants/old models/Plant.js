import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'

const len = 4;
const ang = 25;
const numGens = 6;
const width = 600;
const height = 600;

let drawRules;
let symbols = "X";
//let symbols = [{type: "!", params: {F}  }]

let rules = {
  X: [
    // Original rule
    { rule: "F[+X][-X]FX",  prob: 0.5 },
    
    // Fewer limbs
    { rule: "F[-X]FX",      prob: 0.05 },
    { rule: "F[+X]FX",      prob: 0.05 },
    
    // Extra rotation
    { rule: "F[++X][-X]FX", prob: 0.1 },
    { rule: "F[+X][--X]FX", prob: 0.1 },
    
    // Berries/fruits
    { rule: "F[+X][-X]FA",  prob: 0.1 },
    { rule: "F[+X][-X]FB",  prob: 0.1 }
  ],
  F: [
    // Original rule
    { rule: "FF",  prob: 0.85 },
    
    // Extra growth
    { rule: "FFF", prob: 0.05 },
    
    // Stunted growth
    { rule: "F",   prob: 0.1 },
  ]
};

function sketch(p5) {
  p5.setup =() => {
    p5.createCanvas(600, 600);
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
  
  p5.draw = () => {
    p5.background(28);
    
    // Generate our L-System from the start
    symbols = "X";
    for(let i = 0; i < numGens; i ++) {
      symbols = generate();
      console.log(symbols);
    }
    
    // Draw L-System
    p5.push(); //save previous state
    p5.translate(width/2, height);
    for(let i = 0; i < symbols.length; i ++) {
      let c = symbols[i];
      if(c in drawRules) {
        drawRules[c]();
      }  
    }
    p5.pop();
  }
  
  p5.mouseReleased=()=> {
    p5.draw();
  }
  
  function generate() {
    let next = ""
    
    for(let i = 0; i < symbols.length; i ++) {
      let c = symbols[i];
      if(c in rules) {
        let rule = rules[c];
        
        // Check if we're using an array or not
        if(Array.isArray(rule)) {
          next += chooseOne(rule); // If we are, choose one of the options
        } else {
          next += rules[c]; // Otherwise use the rule directly
        }
      } else {
        next += c;
      }
    }
    
    return next;
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
}



export default function Plant() {
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}