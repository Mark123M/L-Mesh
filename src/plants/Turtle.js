//3D turtle interpreter

const ex = {x: 1, y: 0, z: 0}; 
const ey = {x: 0, y: 1, z: 0};
const ez = {x: 0, y: 0, z: 1};

let turtle = {
    //column vectors of matrix [H, L, U]
    heading: ey, //default turtle orientation
    left: ex,
    up: ez,
}

let test = {
    heading: {x: -2, y: 1, z: 6},
    left: {x: 5, y: 4, z: 0},
    up: {x: 0, y: 2, z: 1},
}
// 1 2 3
// 4 5 6
// 7 8 9

const rotate_u = (turtle, angle) =>{ //turn
    const m = JSON.parse(JSON.stringify(turtle));
    turtle.heading = matrix_vector_mult(m, {x: Math.cos(angle), y: -1 * Math.sin(angle), z: 0});
    print_vector(turtle.heading);
    turtle.left = matrix_vector_mult(m, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0});
    print_vector(turtle.left);
    turtle.up = matrix_vector_mult(m, {x: 0, y: 0, z: 1});
    print_vector(turtle.up);
}
const rotate_l = (turtle, angle) =>{ //pitch
    const m = JSON.parse(JSON.stringify(turtle));
    turtle.heading = matrix_vector_mult(m, {x: Math.cos(angle), y: 0, z: Math.sin(angle)});
    print_vector(turtle.heading);
    turtle.left = matrix_vector_mult(m, {x: 0, y: 1, z: 0});
    print_vector(turtle.left);
    turtle.up = matrix_vector_mult(m, {x: -1 * Math.sin(angle), y: 0, z: Math.cos(angle)});
    print_vector(turtle.up);
}
const rotate_h = (turtle, angle) =>{ //roll
    const m = JSON.parse(JSON.stringify(turtle));
    turtle.heading = matrix_vector_mult(m, {x: 1, y: 0, z: 0});
    print_vector(turtle.heading);
    turtle.left = matrix_vector_mult(m, {x: 0, y: Math.cos(angle), z: Math.sin(angle)});
    print_vector(turtle.left);
    turtle.up = matrix_vector_mult(m, {x: 0, y: -1 * Math.sin(angle), z: Math.cos(angle)});
    print_vector(turtle.up);
}
// 
const matrix_vector_mult = (m, v) =>{
    return vector_add(scalar_mult(v.x, m.heading), vector_add(scalar_mult(v.y, m.left), scalar_mult(v.z, m.up)));
}

const scalar_mult = (c, v) =>{
    return {x: c*v.x, y: c*v.y, z: c*v.z};
}

const vector_add =(v1, v2) =>{
    return {x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
}


const len = (v1) =>{
   return Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
}
const dot_prod = (v1, v2)=>{
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
const get_angle = (v1, v2)=>{
   return Math.acos(dot_prod(v1, v2) / (len(v1)*len(v2)) );
}

const print_vector = (v) => {
    console.log("(" + v.x + ", " + v.y + ", " + v.z + ")");
}

export default function Turtle() {
    //console.log(Math.cos(Math.PI/2));
    console.log("SOME TESTS");
    print_vector(matrix_vector_mult(test, {x: 2, y:3, z: 4}));
    print_vector(matrix_vector_mult(test, {x: -5, y:1, z: 6}));

   // print_vector(matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0})); //WHAT THE FUCK 
   // print_vector(matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0}));
    rotate_u(turtle, Math.PI/3);
    rotate_l(turtle, Math.PI/6);
    rotate_h(turtle, 170 * (Math.PI/180));
   // print_vector(turtle.heading);
   // print_vector(turtle.left);
   // print_vector(turtle.up);
    
    return(
      <>
      </>
    )
    
  }