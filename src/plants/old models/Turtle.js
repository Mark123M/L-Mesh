import { ReactP5Wrapper } from "react-p5-wrapper";

//3D turtle interpreter
//standard basis vectors
const ex = {x: 1, y: 0, z: 0}; 
const ey = {x: 0, y: 1, z: 0};
const ez = {x: 0, y: 0, z: 1};

let turtle = {
    //column vectors of matrix [H, L, U]
    heading: ey, //default turtle orientation
    left: ex,
    up: ez,
}

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

export const rotate_u = (turtle, angle) =>{ //turn + -
   /* const m = JSON.parse(JSON.stringify(turtle));
    m.heading = matrix_vector_mult(turtle, {x: Math.cos(angle), y: -1 * Math.sin(angle), z: 0});
    print_vector(m.heading);
    m.left = matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0});
    print_vector(m.left);
    m.up = matrix_vector_mult(turtle, {x: 0, y: 0, z: 1});
    print_vector(m.up); */
    return {
        heading: matrix_vector_mult(turtle, {x: Math.cos(angle), y: -1 * Math.sin(angle), z: 0}),
        left: matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0}),
        up: matrix_vector_mult(turtle, {x: 0, y: 0, z: 1}),
    };
}
export const rotate_l = (turtle, angle) =>{ //pitch & ^
  /*  const m = JSON.parse(JSON.stringify(turtle));
    m.heading = matrix_vector_mult(turtle, {x: Math.cos(angle), y: 0, z: Math.sin(angle)});
    print_vector(m.heading);
    m.left = matrix_vector_mult(turtle, {x: 0, y: 1, z: 0});
    print_vector(m.left);
    m.up = matrix_vector_mult(turtle, {x: -1 * Math.sin(angle), y: 0, z: Math.cos(angle)});
    print_vector(m.up); */
    return {
        heading: matrix_vector_mult(turtle, {x: Math.cos(angle), y: 0, z: Math.sin(angle)}),
        left: matrix_vector_mult(turtle, {x: 0, y: 1, z: 0}),
        up: matrix_vector_mult(turtle, {x: -1 * Math.sin(angle), y: 0, z: Math.cos(angle)}),
    };
}
export const rotate_h = (turtle, angle) =>{ //roll \ /
   /* const m = JSON.parse(JSON.stringify(turtle));
    m.heading = matrix_vector_mult(turtle, {x: 1, y: 0, z: 0});
    print_vector(m.heading);
    m.left = matrix_vector_mult(turtle, {x: 0, y: Math.cos(angle), z: Math.sin(angle)});
    print_vector(m.left);
    m.up = matrix_vector_mult(turtle, {x: 0, y: -1 * Math.sin(angle), z: Math.cos(angle)});
    print_vector(m.up); */
    return {
        heading: matrix_vector_mult(turtle, {x: 1, y: 0, z: 0}),
        left: matrix_vector_mult(turtle, {x: 0, y: Math.cos(angle), z: Math.sin(angle)}),
        up: matrix_vector_mult(turtle, {x: 0, y: -1 * Math.sin(angle), z: Math.cos(angle)}),
    }
}
export const reset_vertical = (turtle) => {
    let new_l = cross_product(ey, turtle.heading); 
    new_l = scalar_mult(1 / len(cross_product(ey, turtle.heading)), new_l);
   // console.log('NEW VERTICAL L IS: ');
   // print_vector(new_l);
    const angle = get_angle(turtle.left, new_l);
    return rotate_h(turtle, -1 * angle); //LETS FUCK GO IT WORKED
}
export const reset_vertical_angle = (turtle) => {
    let new_l = cross_product(ey, turtle.heading); 
    new_l = scalar_mult(1 / len(cross_product(ey, turtle.heading)), new_l);
    //console.log('NEW VERTICAL L IS: ');
    // print_vector(new_l);
    return get_angle(turtle.left, new_l);
}  

//heading:  left:  up:
//x         x      x
//y         y      y
//z         z      z
export const get_inverse = (turtle) => {
    const cofactor = {
        heading: {
            x: (turtle.left.y * turtle.up.z - turtle.left.z * turtle.up.y), 
            y: -1 * (turtle.left.x * turtle.up.z - turtle.left.z * turtle.up.x),
            z: (turtle.left.x * turtle.up.y - turtle.left.y * turtle.up.x),
        },
        left: {
            x: -1 * (turtle.heading.y * turtle.up.z - turtle.heading.z * turtle.up.y),
            y: (turtle.heading.x * turtle.up.z - turtle.heading.z * turtle.up.x),
            z: -1 * (turtle.heading.x * turtle.up.y - turtle.heading.y * turtle.up.x),
        },
        up: {
            x: (turtle.heading.y * turtle.left.z - turtle.heading.z * turtle.left.y),
            y: -1 * (turtle.heading.x * turtle.left.z - turtle.heading.z * turtle.left.x),
            z: (turtle.heading.x * turtle.left.y - turtle.heading.y * turtle.left.x),
        }
    }
    const adjugate = {
        heading: {

        },
        left: {

        },
        up: {

        }
    }

    const determinant = turtle.heading.x * (turtle.left.y * turtle.up.z - turtle.left.z * turtle.up.y)
                        - turtle.left.x * (turtle.heading.y * turtle.up.z - turtle.heading.z * turtle.up.y)
                        + turtle.up.x * (turtle.heading.y * turtle.left.z - turtle.heading.z * turtle.left.y);
    console.log("COFACTOR: ");
    print_vector(cofactor.heading);
    print_vector(cofactor.left);
    print_vector(cofactor.up);
    console.log("DETERMINANT: ", determinant);
}

export const cross_product = (v1, v2) => {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: -(v1.x * v2.z - v1.z * v2.x),
        z: v1.x * v2.y - v1.y * v2.x,
    }
}

export const matrix_vector_mult = (m, v, p5) =>{
    //let vector = p5.createVector(0, 0, 0);
    //vector = vector.add()
   // ans.add(m.heading.mult)

   // return p5.Vector.mult(m.heading, v.x), p5.Vector.add(p5.Vector.mult(m.left, v.y), p5.Vector.mult(m.up, v.z));
    return vector_add(scalar_mult(v.x, m.heading, p5), vector_add(scalar_mult(v.y, m.left, p5), scalar_mult(v.z, m.up, p5)), p5);
}

export const scalar_mult = (c, v, p5) =>{
    return p5.createVector(c * v.x, c * v.y, c * v.z);
}
export const vector_add = (v1, v2, p5) => {
    return p5.createVector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

export const len = (v1) =>{
   return Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
}
export const dot_prod = (v1, v2)=>{
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
export const get_angle = (v1, v2)=>{
   return Math.acos(dot_prod(v1, v2) / (len(v1)*len(v2)) );
}

const print_vector = (v) => {
    console.log("(" + v.x + ", " + v.y + ", " + v.z + ")");
}

export default function Turtle() {
    get_inverse(test);
    get_inverse(test2);

    return(
      <>
      </>
    )
    
  }