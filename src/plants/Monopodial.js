import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect} from "react";
import * as THREE from "three"
import { v4 as uuidv4 } from "uuid";

//3D turtle interpreter
//standard basis vectors


let heading_vector = new THREE.Vector3();
let q = new THREE.Quaternion();
const ey = new THREE.Vector3(0, 1, 0);

let init_state = {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    left: [-1, 0, 0], 
    up: [0, 0, 1],
    pen: ["#805333", 0.2, true], 
}

let state_stack = [init_state];
let objects = [];
let symbols;
let num_gens = 9;

const a = 1.0;
const b = 0.90;
const e = 0.80;
const c = 50;
const d = 50;
const h = 0.707;
const i = 137.5
const min = 0;

const generate_rules = (symbol) =>{
  if (symbol.type == "A" && symbol.len >= min) {
    const ruleSet = [
      {rule: [
        {type: "!", wid: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "&", angle: c/2},
        {type: "B", len: symbol.len * e, wid: symbol.wid * h},
        {type: "]"},
        {type: "/", angle: i},
        {type: "A", len: symbol.len * a, wid: symbol.wid * h}

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "B" && symbol.len >= min) {
    const ruleSet = [
      {rule: [
        {type: "!", wid: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "-", angle: d},
        {type: "/", angle: -1 * i/2},
        {type: "C", len: symbol.len * e, wid: symbol.wid * h},
        {type: "]"},

        {type: "C", len: symbol.len * b, wid: symbol.wid * h},
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "C" && symbol.len >= min) {
    const ruleSet = [
      {rule: [
        {type: "!", wid: symbol.wid},
        {type: "F", len: symbol.len},

        {type: "["},
        {type: "+", angle: d},
        {type: "/", angle: -1 * i/2},
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

function generate() {
  let next = [];

  for(let i = 0; i < symbols.length; i++) {
    let s = symbols[i];
    let s2 = generate_rules(s);
    if(s2){
      next = next.concat(s2);
    }
    else{
      next = next.concat(s);
    }
  }
  //console.log(next, "NEW SYMBOLS FOR TREE");
  return next;
}

//HERE WE FUCKING GOOOO
function applyRule(symbol) {
  let last_state = state_stack[state_stack.length - 1];
  if(symbol.type == "!") {
    last_state.pen[1] = symbol.wid;
  }
  else if (symbol.type == "F") {
    //each new object stores: position, direction vector, length, width/radius
    //draw object
    objects.push([vector_add(last_state.pos, scalar_mult(symbol.len/2, last_state.heading)), last_state.heading, symbol.len, last_state.pen[1]]);
    //translate state
    last_state.pos = vector_add(last_state.pos, scalar_mult(symbol.len, last_state.heading));
  }
  else if (symbol.type == "f") {
    //translate state
    last_state.pos = vector_add(last_state.pos, scalar_mult(symbol.len, last_state.heading));
  }
  else if (symbol.type == "+") {
    //p5.rotateZ(Math.PI/180 * -1 * (symbol.angle));
    rotate_u(last_state, (Math.PI / 180) * (symbol.angle));
  }
  else if (symbol.type == "-") {
    // p5.rotateZ(Math.PI/180 * (symbol.angle));
    rotate_u(last_state, (Math.PI / 180) * -(symbol.angle));
   }

  else if (symbol.type == "&") {
    rotate_l(last_state, (Math.PI / 180) * (symbol.angle)); 
  }
  else if (symbol.type == "^") {
    rotate_l(last_state, (Math.PI / 180) * -(symbol.angle));  
  }
  else if (symbol.type == "\\") {
    // p5.rotateY(Math.PI/180 * (symbol.angle));
    rotate_h(last_state, (Math.PI / 180) * (symbol.angle));
  }
  else if (symbol.type == "/") {
    rotate_h(last_state, (Math.PI / 180) * -(symbol.angle));
  }
  else if (symbol.type == '|') {
    rotate_u(last_state, Math.PI);
  }
  else if (symbol.type == '$') {
    console.log("$ NOT IMPLEMENTED YET");

    //rotate_u(last_state, Math.PI);
  }
  else if (symbol.type == "[") {
    let new_state = JSON.parse(JSON.stringify(last_state));
    state_stack.push(new_state);
  }
  else if (symbol.type == "]") {
    state_stack.pop();
  }
  else if (symbol.type == "L") {
    //drawLeaf(symbol.sz);
  }
  
}

const matrix_vector_mult = (m, v) =>{
  return vector_add(scalar_mult(v[0], m.heading), vector_add(scalar_mult(v[1], m.left), scalar_mult(v[2], m.up)));
}
const cross_product = (a, b) => {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
const scalar_mult = (c, v) =>{
  
  return [c * v[0], c * v[1], c * v[2]];
}
const vector_add =(v1, v2) =>{
  return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}
const rotate_u = (state, angle) =>{ //turn + -
  const m = JSON.parse(JSON.stringify(state));
  const ct = Math.cos(angle);
  const st = Math.sin(angle);
  state.heading = matrix_vector_mult(m, [ct, -st, 0]);
  state.left = matrix_vector_mult(m, [st, ct, 0]);
  state.up = matrix_vector_mult(m, [0, 0, 1]);
}
const rotate_l = (state, angle) =>{ //turn + -
  const m = JSON.parse(JSON.stringify(state));
  const ct = Math.cos(angle);
  const st = Math.sin(angle);
  state.heading = matrix_vector_mult(m, [ct, 0, st]);
  state.left = matrix_vector_mult(m, [0, 1, 0]);
  state.up = matrix_vector_mult(m, [-st, 0, ct]);
}
const rotate_h = (state, angle) =>{ //turn + -
  const m = JSON.parse(JSON.stringify(state));
  const ct = Math.cos(angle);
  const st = Math.sin(angle);
  state.heading = matrix_vector_mult(m, [1, 0, 0]);
  state.left = matrix_vector_mult(m, [0, ct, st]);
  state.up = matrix_vector_mult(m, [0, -st, ct]);
}

//MAKE SURE NOT TO EDIT ANY VECTORS
const Branch = ({pos, heading, radius, height}) => {
    const meshRef = useRef(null);
  

    useEffect(()=>{
      heading_vector.set(heading[0], heading[1], heading[2]);
      heading_vector.normalize();
      q.setFromUnitVectors(ey, heading_vector);
      meshRef.current.position.set(pos[0], pos[1], pos[2]);
      meshRef.current.setRotationFromQuaternion(q);
      //meshRef.current.rotation.set(Math.PI/6, 0, 0);
      
    }, [meshRef]);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
       // get_rotation_u();
      //  meshRef.current.rotation.x = t; 
        //meshRef.current.applyMatrix4(direction);
       // console.log(meshRef.current.lookAt);
    })

    return (
        <mesh ref = {meshRef}> 
            <cylinderGeometry args={[radius, radius, height, 6]}/>
            <meshStandardMaterial color="#805333"/>
        </mesh>
    )
}

export default function Monopodial() {
    const canvas_ref = useRef(null);

   /* rotate_u(state_stack[0], Math.PI / 3);
    rotate_l(state_stack[0], Math.PI / 6);
    rotate_h(state_stack[0], 170 * (Math.PI / 180));
    console.log(state_stack[0].heading);
    console.log(state_stack[0].left);
    console.log(state_stack[0].up); */

    symbols = [{type: "A", len: 1, wid: 0.2}];
    //symbols = [{type: "F", len: 2, wid: 0.2}, {type: "-", angle: 45}, {type: "F", len: 1, wid: 0.2}, {type: "^", angle: 45},{type: "F", len: 1, wid: 0.2}, ];
    for(let i = 0; i < num_gens; i ++) {
        symbols = generate();
        //  console.log(symbols, "NEW SYMBOLS");
        console.log(symbols);
    }
    for(let i = 0; i < symbols.length; i ++) {
      let s = symbols[i];
      applyRule(s);
    }

    console.log(objects);


    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                {<OrbitControls enableZoom enablePan enableRotate/>}
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {objects.map((o)=>
                  <Branch key={uuidv4()} pos = {o[0]} heading = {o[1]} height = {o[2]} radius = {o[3]}/>
                )}
                <Branch pos={[1, 1, 2]} heading = {[1, 1, 0]} radius={0.2} height={1}/>
            </Canvas>
        </div>
    )
}