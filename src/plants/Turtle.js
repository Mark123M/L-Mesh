import { ReactP5Wrapper } from "react-p5-wrapper";
import { Vector3, Matrix4 } from "three";


//3D turtle interpreter
//standard basis vectors
const ex = [-1, 0, 0]; 
const ey = [0, 1, 0];
const ez = [0, 0, 1];

const init_state = {
    pos: [0, 0, 0],
    H: ey, //default orientation
    L: ex, //left vector
    U: ez, //up vector
    pen: ['brown', 30, true], 
}

let state = [init_state];

//used to keep track of position, orientation, and pen state. H vector is used to draw shapes in three js by 
//pointing each shape to the vector's direction

//let state = [turtle,]; //use push and pop to add and remove from the end of array

const test = {
    heading: {x: 0, y: 2, z: 3},
    left: {x: 9, y: 0, z: 7},
    up: {x: 3, y: 4, z: 0},
}
const test2 = {
    heading: {x: -5, y: 4, z: 3},
    left: {x: 3, y: 5, z: 7},
    up: {x: -3, y: -6, z: 0},
}
// 1 2 3
// 4 5 6
// 7 8 9

let m = new Matrix4();

export default function Turtle() {


    console.log(ex[0] + ", "+ ex[1] +", "+ex[2]);

    return(
      <>
      </>
    )
    
  }