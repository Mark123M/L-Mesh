/*
Generates trees using a MONOPODIAL MODEL with a stochastic parametric L-system
*/
import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import {Flex} from '@chakra-ui/react'
//import {matrix_vector_mult} from './Turtle'

const numGens = 9;
const width = 1440;
const height = 800;

let symbols;

/*F Move forward and draw a line. 
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

const b = 0.9;
const e = 0.8;
const c = 45;
const d = 45;
const h = 0.707;
const i = 137.5;

const leaf_gen = 3; //generation where leaf starts growing.

const generateRules = (symbol) =>{
  if (symbol.type == "A") {
    const ruleSet = [
      {rule: [
        {type: "!", width: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "&", angle: c},
        {type: "B", len: symbol.len * e, wid: symbol.wid * h},
        {type: "]"},

        {type: "/", angle: i},
        {type: "A", len: symbol.len * b, wid: symbol.wid * h}

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "B") {
    const ruleSet = [
      {rule: [
        {type: "!", width: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "-", angle: d},
        {/*type: "/", angle: -1 * i/2*/},
        {type: "C", len: symbol.len * e, wid: symbol.wid * h},
        {type: "]"},

        {type: "C", len: symbol.len * b, wid: symbol.wid * h},
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "C") {
    const ruleSet = [
      {rule: [
        {type: "!", width: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "+", angle: d},
        {/*type: "/", angle: -1 * i/2 */},
        {type: "B", len: symbol.len * e, wid: symbol.wid * h},
        {type: "]"},

        {type: "B", len: symbol.len * b, wid: symbol.wid * h},
      ], prob: 1.0},
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
    p5.createCanvas(width, height, p5.WEBGL);
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
      p5.stroke("#805333");
      p5.line(0, 0, 0, 0, -1* (symbol.len), 0);
      p5.translate(0, -1 * (symbol.len), 0);
    }
    //ROTATES ON THE U AXIS (TURN) (USES THE RU MATRIX)
    else if (symbol.type == "+") {
      //p5.rotateZ(Math.PI/180 * -1 * (symbol.angle));
      const ct = Math.cos(-1 * Math.PI/180 * (symbol.angle));
      const st = Math.sin(-1 * Math.PI/180 * (symbol.angle));
      p5.applyMatrix(
        ct, st,  0.0,  0.0,
        -st, ct, 0.0,  0.0,
        0.0, 0.0,  1.0,  0.0,
        0.0, 0.0, 0.0,  1.0
      ); 
    }
    else if (symbol.type == "-") {
      // p5.rotateZ(Math.PI/180 * (symbol.angle));
       const ct = Math.cos(Math.PI/180 * (symbol.angle));
       const st = Math.sin(Math.PI/180 * (symbol.angle));
       p5.applyMatrix(
         ct, st,  0.0,  0.0,
         -st, ct, 0.0,  0.0,
         0.0, 0.0,  1.0,  0.0,
         0.0, 0.0, 0.0,  1.0
       ); 
     }
     //ROTATES ON THE H AXIS (ROLL) (USES THE RL MATRIX)
    else if (symbol.type == "/") {
       // p5.rotateY(Math.PI/180 * (symbol.angle));
        const ct = Math.cos(-1 * Math.PI/180 * (symbol.angle));
        const st = Math.sin(-1 * Math.PI/180 * (symbol.angle));
        p5.applyMatrix(
          ct, 0.0,  -st,  0.0,
          0.0, 1.0, 0.0,  0.0,
          st, 0.0,  ct,  0.0,
          0.0, 0.0, 0.0,  1.0
        );
    }
    else if (symbol.type == "\\") {
       // p5.rotateY(Math.PI/180 * -1 * (symbol.angle));
        const ct = Math.cos(Math.PI/180 * (symbol.angle));
        const st = Math.sin(Math.PI/180 * (symbol.angle));
        p5.applyMatrix(
          ct, 0.0,  -st,  0.0,
          0.0, 1.0, 0.0,  0.0,
          st, 0.0,  ct,  0.0,
          0.0, 0.0, 0.0,  1.0
        );
    }
    //ROTATES ON THE L AXIS (PITCH) (USES THE RH MATRIX)
    else if (symbol.type == "&") {
      // p5.rotateX(Math.PI/180 * (symbol.angle));
       const ct = Math.cos(Math.PI/180 * (symbol.angle));
       const st = Math.sin(Math.PI/180 * (symbol.angle));
       p5.applyMatrix(
         1.0, 0.0,  0.0,  0.0,
         0.0, ct, -st,  0.0,
         0.0, st,  ct,  0.0,
         0.0, 0.0, 0.0,  1.0
       );   
    }
    else if (symbol.type == "^") {
      // p5.rotateX(Math.PI/180 * (symbol.angle));
       const ct = Math.cos(-1 * Math.PI/180 * (symbol.angle));
       const st = Math.sin(-1 * Math.PI/180 * (symbol.angle));
       p5.applyMatrix(
         1.0, 0.0,  0.0,  0.0,
         0.0, ct, -st,  0.0,
         0.0, st,  ct,  0.0,
         0.0, 0.0, 0.0,  1.0
       );   
    }
    else if (symbol.type == "$") {
      p5.rotateY(Math.PI/180 * -1 * (symbol.angle))
    }
    else if (symbol.type == "[") {
      p5.push();
    }
    else if (symbol.type == "]") {
      p5.pop();
    }
    else if (symbol.type == "L") {
      drawLeaf(symbol.sz);
    }
    
  }
  
  function generate() {
    let next = [];

    for(let i = 0; i < symbols.length; i++) {
      let s = symbols[i];
      let s2 = generateRules(s);
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

  function rotate_u (mat, angle){ //turn + -
     return {
         heading: matrix_vector_mult(mat, p5.createVector(Math.cos(angle), -1 * Math.sin(angle), 0)),
         left: matrix_vector_mult(mat, p5.createVector(Math.sin(angle), Math.cos(angle), 0)),
         up: matrix_vector_mult(mat, p5.createVector(0, 0, 1)),
     };
 }
  function rotate_l (mat, angle){ //pitch & ^
     return {
         heading: matrix_vector_mult(mat, p5.createVector(Math.cos(angle), 0, Math.sin(angle))),
         left: matrix_vector_mult(mat, p5.createVector(0, 1, 0)),
         up: matrix_vector_mult(mat, p5.createVector(-1 * Math.sin(angle), 0, Math.cos(angle))),
     };
  }
  function rotate_h (mat, angle){ //roll \ /
     return {
         heading: matrix_vector_mult(mat, p5.createVector(1, 0, 0)),
         left: matrix_vector_mult(mat, p5.createVector(0, Math.cos(angle), Math.sin(angle))),
         up: matrix_vector_mult(mat, p5.createVector(0, -1 * Math.sin(angle), Math.cos(angle))),
     }
  }
  function matrix_vector_mult(mat, v){
    return vector_add(scalar_mult(v.x, mat.heading), vector_add(scalar_mult(v.y, mat.left), scalar_mult(v.z, mat.up)));
  }
  function scalar_mult(c, v){
      return p5.createVector(c*v.x, c*v.y, c*v.z);
  }
  function vector_add(v1, v2){
      return p5.createVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }
  function print_vector(v){
    console.log(v.x, " ", v.y, " ", v.z);
  }

  p5.draw = async () => {
    p5.background("#FFFFFF");
    
    // L-System AXIOMS:
    symbols = [{type: "A", len: 150, wid: 15, matrix: {heading: p5.createVector(0, 1, 0), left: p5.createVector(-1, 0, 0), up: p5.createVector(0, 0, 1)}}];

   /* const mat = {heading: p5.createVector(1, 4, 8), left: p5.createVector(2, -5, 10), up: p5.createVector(3, 6, 4)};
    const test = p5.createVector(1, 4, -5);
    console.log('VECTOR TEST 1', test.x, test.y, test.z);
    const test2 = matrix_vector_mult(mat, test);
    //test2.mult(1);
    console.log('VECTOR TEST 2', test2.x, test2.y, test2.z);  */

    symbols[0].matrix = rotate_u(symbols[0].matrix, Math.PI/3);
    symbols[0].matrix = rotate_l(symbols[0].matrix, Math.PI/6);
    symbols[0].matrix = rotate_h(symbols[0].matrix, 170 * (Math.PI/180));

    console.log("MATRIX AFTER PRINTING: ");
    print_vector(symbols[0].matrix.heading);
    print_vector(symbols[0].matrix.left);
    print_vector(symbols[0].matrix.up);

    //rotate_l(turtle, Math.PI/6);
    //rotate_h(turtle, 170 * (Math.PI/180));


    for(let i = 0; i < numGens; i ++) {
      symbols = generate();
   //   console.log(symbols, "NEW SYMBOLS");
    }
    
    p5.push(); //save previous state
    p5.translate(0, width/4, 0);
   // p5.rotateY(60 * -1 * (Math.PI/180));
    p5.scale(0.8);
    for(let i = 0; i < symbols.length; i ++) {
      let s = symbols[i];
    //  await sleep(1);
      applyRule(s);
    }
    p5.pop(); 
  }
  
  p5.mouseReleased=()=> {
    p5.clear();
    p5.draw();
  }
  
  const sleep = (millis) => { 
    return new Promise(resolve => setTimeout(resolve, millis)) 
  }

}



export default function Plant() {
  //console.log(Math.cos(Math.PI/2));
  return(
    <ReactP5Wrapper sketch={sketch}/>
  )
  
}