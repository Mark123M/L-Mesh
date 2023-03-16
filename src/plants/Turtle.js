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
    heading: {x: -2, y: 1, z: 6},
    left: {x: 5, y: 4, z: 0},
    up: {x: 0, y: 2, z: 1},
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
    console.log('NEW VERTICAL L IS: ');
    print_vector(new_l);
    const angle = get_angle(turtle.left, new_l);
    return rotate_h(turtle, angle);
}
export const reset_vertical_angle = (turtle) => {
    let new_l = cross_product(ey, turtle.heading); 
    new_l = scalar_mult(1 / len(cross_product(ey, turtle.heading)), new_l);
    console.log('NEW VERTICAL L IS: ');
    print_vector(new_l);
    return get_angle(turtle.left, new_l);
}  


export const cross_product = (v1, v2) => {
    return {
        x: v1.y * v2.z - v1.z * v2.y,
        y: -(v1.x * v2.z - v1.z * v2.x),
        z: v1.x * v2.y - v1.y * v2.x,
    }
}

const matrix_vector_mult = (m, v) =>{
    return vector_add(scalar_mult(v.x, m.heading), vector_add(scalar_mult(v.y, m.left), scalar_mult(v.z, m.up)));
}

const scalar_mult = (c, v) =>{
    return {x: c*v.x, y: c*v.y, z: c*v.z};
}

const vector_add =(v1, v2) =>{
    return {x: v1.x + v2.x, y: v1.y + v2.y, z: v1.z + v2.z};
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
    //console.log(Math.cos(Math.PI/2));
  //  console.log("SOME TESTS");
  //  print_vector(matrix_vector_mult(test, {x: 2, y:3, z: 4}));
  //  print_vector(matrix_vector_mult(test, {x: -5, y:1, z: 6}));

   // print_vector(matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0})); //WHAT THE FUCK 
   // print_vector(matrix_vector_mult(turtle, {x: Math.sin(Math.PI/3), y: Math.cos(Math.PI/3), z: 0}));
  
   
   // turtle = rotate_u(turtle, Math.PI/3);
    turtle = rotate_l(turtle, Math.PI/6);
   // turtle = rotate_h(turtle, 170 * (Math.PI/180));

    print_vector(turtle.heading);
    print_vector(turtle.left);
    print_vector(turtle.up);

/*    turtle = rotate_vertical(turtle);
    print_vector(turtle.heading);
    print_vector(turtle.left);
    print_vector(turtle.up); 

    turtle = rotate_l(turtle, Math.PI/3);
    print_vector(turtle.heading);
    print_vector(turtle.left);
    print_vector(turtle.up); */
    console.log('AFTER ROTATING ON H');
    turtle = rotate_h(turtle, Math.PI / 4);
    print_vector(turtle.heading);
    print_vector(turtle.left);
    print_vector(turtle.up);

    turtle = reset_vertical(turtle);
    console.log("AFTER RESETTING TO VERTICAL");
    print_vector(turtle.heading);
    print_vector(turtle.left);
    print_vector(turtle.up);

   
    

   // print_vector(turtle.heading);
   // print_vector(turtle.left);
   // print_vector(turtle.up);
   console.log("DSIUFHSUDHFUISDHFUIFHSDFHUISDHF");
   print_vector(cross_product({x: -1, y: -2, z: 3}, {x: 4, y: 0, z: -8}));

    return(
      <>
      </>
    )
    
  }