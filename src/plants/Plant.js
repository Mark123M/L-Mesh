import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'

let rules = {
  "X": "F+[[X]-X]-F[-FX]+X",
  "F": "FF"
}

let len = 3;
let ang;
let drawRules;
let word = "X";

const width = 400;
const height = 400;

function sketch(p5) {
  p5.setup = () => {
    p5.createCanvas(width, height);
    ang = 25;

    drawRules = {
      "F": () => {
        p5.stroke(100, 50, 0);
        p5.line(0, 0, 0, -len);
        p5.translate(0, -len);
      },
      "+": () => {
        p5.rotate(Math.PI/180 * -ang);
      },
      "-": () => {
        p5.rotate(Math.PI/180 * ang);
      },
      "[": () => {
        p5.push();
      },
      "]": () => {
        p5.noStroke();
        p5.fill(0, 200, 0);
        p5.ellipse(0, 0, 2 * len, 5 * len);
        p5.pop();
      },
    }

    p5.noLoop();
  }

  p5.draw = () => {
    p5.background(220);
  
    p5.push();
    p5.translate(width/4, height);
    p5.rotate(Math.PI/180 * ang);
    for(let i = 0; i < word.length; i ++) {
      let c = word[i];
      if(c in drawRules) {
        drawRules[c]();
      }  
    }
    p5.pop();
  };

  function generate(){
    let next = ""
    for(let i = 0; i < word.length; i ++) {
      let c = word[i];
      if(c in rules) {
        next += rules[c];
      } else {
        next += c;
      }
    }
    return next;
  }

  p5.mouseReleased = () =>{
    word = generate();
    console.log(word);
    p5.draw();
  }

}

export default function Plant() {
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}