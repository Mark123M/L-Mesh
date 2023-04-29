import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect, useState} from "react";
import * as THREE from "three"
import { v4 as uuidv4 } from "uuid";
import { useThree } from "@react-three/fiber";
import { ShapeUtils } from "three";
import * as math from "mathjs"

//3D turtle interpreter
//standard basis vectors


let heading_vector = new THREE.Vector3();
let position_vector = new THREE.Vector3();
let local_q = new THREE.Quaternion();
let world_q = new THREE.Quaternion();
const ey = new THREE.Vector3(0, 1, 0);

let mesh_shape = new THREE.Shape();
let mesh_geometry;
let positions;

/*mesh_shape.moveTo(0, 0);
mesh_shape.lineTo(1, 0);
mesh_shape.lineTo(1, 1);
mesh_shape.lineTo(0, 1);
mesh_shape.lineTo(0, 0);

const square = new THREE.ShapeGeometry(mesh_shape);
const pos = square.getAttribute('position');
console.log("POSITION OF SQUARE",pos);
//for(let i = 0; i < pos.count; i++) {
//  pos.setZ(i, Math.random());
//}
square.setAttribute('position', pos);  */


const hiearchy_on = false;

let init_state = {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    left: [-1, 0, 0], 
    up: [0, 0, 1],
    pen: ["#805333", 0.4, true], 
}

/*
let shape = {
  verticies:
  width: 
  color: 
}
*/

let state_stack = [init_state];
let objects = [];
let shapes = [];
let shape_stack = []; //{ means start a new shape, } means push the shape into the shapes array to be drawn
let symbols;
let num_gens = 4;

const b = 0.95;
const e = 0.80;
const c = 30;
const d = 45;
const h = 0.707;
const i = 137.5
const min = 0;

//tolerance values for randomization
const turn_t = 12;
const pitch_t = 12;
const roll_t = 20;

const delta = 18;
const edge = 0.4;

const generate_rules = (symbol) =>{
  if (symbol.type == "plant") {
    const ruleSet = [
      {rule: [
        {type: "internode"},
        {type: "+", angle: delta},

        {type: "["},
        {type: "plant"},
        {type: "+", angle: delta},
        {type: "flower"},
        {type: "]"},

        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},

        {type: "["},
        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "leaf"},
        {type: "]"},

        {type: "internode"},

        {type: "["},
        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "leaf"},
        {type: "]"},

        {type: "-", angle: delta},
        {type: "["},
        {type: "plant"},
        {type: "flower"},
        {type: "]"},

        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "plant"},
        {type: "flower"},

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "internode") {
    const ruleSet = [
      {rule: [
        {type: "F", len: edge},
        {type: "seg"},

        {type: "["},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "&", angle: delta},
        {type: "&", angle: delta},
        {type: "leaf"},
        {type: "]"},

        {type: "["},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "^", angle: delta},
        {type: "^", angle: delta},
        {type: "leaf"},
        {type: "]"},

        {type: "F", len: edge},
        {type: "seg"},

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  } 
  else if (symbol.type == "seg") {
    const ruleSet = [
      {rule: [
        {type: "seg"},
        {type: "F", len: edge},
        {type: "seg"},
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }  
  else if (symbol.type == "leaf") {
    const ruleSet = [
      {rule: [
        {type: "["},
        {type: "'"},

        {type: "{", color: "green"},
        {type: "."},
        {type: "+", angle: delta},
        {type: "f", len: edge},
        {type: "."},
        {type: "-", angle: delta},
        {type: "f", len: edge},
        {type: "f", len: edge},
        {type: "."},
        {type: "-", angle: delta},
        {type: "f", len: edge},

        {type: "+", angle: delta},
        {type: "|", angle: delta},

        {type: "."},
        {type: "+", angle: delta},
        {type: "f", len: edge},
        {type: "."},
        {type: "-", angle: delta},
        {type: "f", len: edge},
        {type: "f", len: edge},
        {type: "."},
        {type: "-", angle: delta},
        {type: "f", len: edge},
        {type: "}"},
        {type: "]"},
        
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "flower") {
    const ruleSet = [
      {rule: [
        {type: "["},
        {type: "^", angle: delta},
        {type: "^", angle: delta},
        {type: "^", angle: delta},
        {type: "pedicel"},
        {type: "'"},
        {type: "/", angle: delta},
        {type: "wedge"},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "wedge"},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "wedge"},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "wedge"},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "/", angle: delta},
        {type: "wedge"},
        {type: "]"},
        
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "pedicel") {
    const ruleSet = [
      {rule: [
        {type: "F", len: edge},
        {type: "F", len: edge},
      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
  else if (symbol.type == "wedge") {
    const ruleSet = [
      {rule: [
        {type: "["},
        {type: "'"},
        {type: "^", angle: delta},
        {type: "F", len: edge},
        {type: "]"},

        {type: "["},
        {type: "{", color: "orange"},
        {type: "."},
        {type: "&", angle: delta},
        {type: "&", angle: delta},
        {type: "&", angle: delta},
        {type: "&", angle: delta},
        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "f", len: edge * 2},
        {type: "."},
        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "f", len: edge * 2},

        {type: "."},
        {type: "|"},
        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "-", angle: delta},
        {type: "f", len: edge * 2},
        {type: "."},
        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "+", angle: delta},
        {type: "f", len: edge * 2},
        {type: "}"},
        {type: "]"},

      ], prob: 1.0},
    ]
    return chooseOne(ruleSet);
  }
}

//NEW CHANGES 

//"name" : val
let constants = {
  "num_gen": 5,
  "delta": 18,
  "edge": 0.4,
}
//"symbol" : "replacements"
let productions = {
  "A(len, wid)": "A(sin(len * sin(0)) + cos(len * cos(pi/2)) + 1,  wid)",
}
//"name" : [param1, param2...]
//SHOULD INCLUDE PRIMITIVE COMMANDS ALWAYS, LIKE F, f, !, [, ], {, }, /, \
let params = {
  "F": ["len"],
  "f": ["len"],
  "+": ["angle"],
  "-": ["angle"],
  "^": ["angle"],
  "&": ["angle"],
  "\\": ["angle"],
  "/": ["angle"],
  "|": [],
  "$": [],
  "[": [],
  "]": [],
  "{": [],
  ".": [],
  "}": [],
  "!": ["wid"],
  "'": ["color"],
  "%": [],
}
//replacement symbol string is split by space: so A-> F(10) A(15) / / /
//rule is a string representation of a symbol and its next params
//ex. "F(5 * sin(log(k, h)) + 5, expt(4, 5))" 
//returns a symbol object {type: "name", param1: x, param2: y...};

//then replace each occuring instance of the parameters of the symbol in the rule string
//then evaluate the parameters and and create a new symbol. 
//symbol is the string of the original symbol, rule is the replacement 
const get_next_symbol = (symbol, rule) => {
  rule = rule.replaceAll(' ', ''); //remove all whitespaces for safety
  if(!rule.includes('(')) { //if there are no parameters
    return {type: "rule"};
  }
  const firstIdx = rule.indexOf('(');
  const type = rule.substring(0, firstIdx);
  const lastIdx = rule.lastIndexOf(")");
  rule = rule.substring(firstIdx + 1, lastIdx);
  console.log("TRIMMED RULE IS", type, rule);

  if(!params[type]) {
    return;
  }
  Object.keys(symbol).forEach((s)=>{
    console.log(s, symbol[s]);
    if(s != "type"){
      rule = rule.replaceAll(s, symbol[s]); //replace all variables of the production with the fields of symbol 
    }
  })
  Object.keys(constants).forEach((s)=>{
    if(s != "num_gen"){
      rule = rule.replaceAll(s, constants[s]); //replace all variables of the production with any constants
    }
  })
  console.log("SUBBED RULE IS ", rule);

  let stack = [];
  let cur_param = "";
  let param_idx = 0;
  let new_symbol = {type: type};

  for(let i = 0; i < rule.length; i++) {
    if(rule[i] == ',' && stack.length == 0) { //if theres a comma that is not in a bracket, this is a parameter
      console.log("PARAM",param_idx, "is", params[type][param_idx]);
      new_symbol[params[type][param_idx]] = math.evaluate(cur_param);
      cur_param = "";
      param_idx++;
      continue;
    }
    cur_param = cur_param + rule[i];
    if(rule[i] == '(') {
      stack.push(rule[i]);
    }
    else if (rule[i] == ')') {
      stack.pop();
    }
  }
  if(rule[rule.length - 1] != ',') {
    console.log("PARAM",param_idx, "is", params[type][param_idx]);
    new_symbol[params[type][param_idx]] = math.evaluate(cur_param);
    cur_param = "";
    param_idx++;
  }
  console.log(new_symbol);

}

const get_params = () => {
  Object.keys(productions).forEach((s)=>{
    const type = s.substring(0, s.indexOf('('));
    s = s.substring(s.indexOf('('));
    s = s.replaceAll(' ','');
    s = s.replaceAll('(', '');
    s = s.replaceAll(')', '');
    params[type] = s.split(',');
  })
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
    objects.push([vector_add(last_state.pos, scalar_mult(symbol.len/2, last_state.heading)), last_state.heading, symbol.len, last_state.pen[1], symbol.id, symbol.parent_id]);
    //translate state
    last_state.pos = vector_add(last_state.pos, scalar_mult(symbol.len, last_state.heading));
  }
  else if (symbol.type == "f") {
    //translate state
    last_state.pos = vector_add(last_state.pos, scalar_mult(symbol.len, last_state.heading));
  }
  else if (symbol.type == "+") {
    //p5.rotateZ(Math.PI/180 * -1 * (symbol.angle));
    rotate_u(last_state, (Math.PI / 180) * -(symbol.angle));
  }
  else if (symbol.type == "-") {
    // p5.rotateZ(Math.PI/180 * (symbol.angle));
    rotate_u(last_state, (Math.PI / 180) * (symbol.angle));
   }

  else if (symbol.type == "&") {
    rotate_l(last_state, (Math.PI / 180) * (symbol.angle)); 
  }
  else if (symbol.type == "^") {
    rotate_l(last_state, (Math.PI / 180) * -(symbol.angle));  
  }
  else if (symbol.type == "\\") {
    // p5.rotateY(Math.PI/180 * (symbol.angle));
    rotate_h(last_state, (Math.PI / 180) * -(symbol.angle));
  }
  else if (symbol.type == "/") {
    rotate_h(last_state, (Math.PI / 180) * (symbol.angle));
  }
  else if (symbol.type == '|') {
    rotate_u(last_state, Math.PI);
  }
  else if (symbol.type == '$') {
    //L = (V x H) / ||V x H||
    last_state.left = cross_product([0, 1, 0], last_state.heading);
    last_state.left = scalar_mult((1 / vector_len(last_state.left)), last_state.left);
    //U = H x L
    last_state.up = cross_product(last_state.heading, last_state.left); 

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
  //start a new polygon
  else if (symbol.type == "{") {
    shape_stack.push([symbol.color, 1, symbol.id, symbol.parent_id, []]); 
  }
  //finish the current polygon
  else if (symbol.type == "}") {
    shapes.push(shape_stack.pop());
  }
  //draw a vertex for the current polygon
  else if (symbol.type == ".") {
    const num_shapes = shape_stack.length;
    shape_stack[num_shapes - 1][4].push(last_state.pos);
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
const vector_len = (v) =>{
  return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
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
const Branch = ({pos, heading, radius, height, id, parent_id}) => {
    const meshRef = useRef(null);
    const {scene} = useThree();

    useEffect(()=>{
      const parent = scene.getObjectByName(parent_id);
      position_vector.set(pos[0], pos[1], pos[2]);
      heading_vector.set(heading[0], heading[1], heading[2]);
      heading_vector.normalize();
      local_q.setFromUnitVectors(ey, heading_vector);
      //console.log("CURRENT OBJECT HAS ID: ",id, "PARENT ID",parent_id);
      if(parent_id) {
        //console.log(parent);
        parent.add(meshRef.current);
        parent.worldToLocal(position_vector);

        //get the world rotation of the parent
        parent.getWorldQuaternion(world_q);
        // get the inverse of the parent object's world rotation quaternion
        world_q.invert();
        // Convert the world rotation quaternion to local rotation quaternion
        local_q.multiplyQuaternions(world_q, local_q);
      }
     
      meshRef.current.position.copy(position_vector);
      meshRef.current.setRotationFromQuaternion(local_q);
      //meshRef.current.rotation.set(Math.PI/6, 0, 0);
      //console.log((Math.random() * 2 * pitch_t) - pitch_t);

    }, [meshRef]);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }

      // meshRef.current.rotateX(Math.sin(t*2) / 2000);
       //meshRef.current.rotateY(Math.sin(t) / 3000);
      // meshRef.current.rotateZ(Math.sin(t * 3) / 2000);
       //console.log(t);
    })

    return (
        <mesh ref = {meshRef} name = {id}> 
            <cylinderGeometry args={[radius, radius, height, 6]}/>
            <meshStandardMaterial color="#805333"/>
        </mesh>
    )
}

const Shape = ({color, wid, points, id, parent_id}) => {
  const meshRef = useRef(null);
  const {scene} = useThree();
  const [geometry, setGeometry] = useState(new THREE.ShapeGeometry());
  
  useEffect(()=>{
    const parent = scene.getObjectByName(parent_id);
    mesh_shape = new THREE.Shape();

    position_vector.set(points[0][0], points[0][1], points[0][2]);
    mesh_shape.moveTo(position_vector.x, position_vector.y);

    //add a small random value to avoid repeating lineTo calls
    let rx = Math.random() * 0.000008999999 + 0.000001;
    let ry = Math.random() * 0.000008999999 + 0.000001;
    for(let i = 1; i < points.length; i++) {
      position_vector.set(points[i][0], points[i][1], points[i][2]);
      mesh_shape.lineTo(position_vector.x + rx, position_vector.y + ry);
      rx = Math.random() * 0.000008999999 + 0.000001;
      ry = Math.random() * 0.000008999999 + 0.000001;
    }

    position_vector.set(points[0][0], points[0][1], points[0][2]);
    mesh_shape.lineTo(position_vector.x, position_vector.y);

    mesh_geometry = new THREE.ShapeGeometry(mesh_shape);
    positions = mesh_geometry.getAttribute('position');
    for(let i = 1; i < positions.count; i++) {
     // console.log(positions.getX(i), positions.getY(i), positions.getZ(i), 'POINTS', points[positions.count - i - 1]);
      if(ShapeUtils.isClockWise(mesh_shape.getPoints())) {
        positions.setZ(i, points[i][2]);
      }
      else {
        positions.setZ(i, points[positions.count - i][2]);
      }
    }
    //console.log();

    positions.setZ(0, points[0][2]);
    mesh_geometry.setAttribute('position', positions);
    setGeometry(mesh_geometry);
    //console.log(points, points.length, mesh_geometry.getAttribute('position'), ShapeUtils.isClockWise(mesh_shape.getPoints()));

    
  }, [meshRef]); 
  

  return (
    <mesh mesh ref = {meshRef} name = {id} geometry={geometry}>
      <meshPhongMaterial color={color} side={THREE.DoubleSide}/>
    </mesh>
  );
}

export default function Bush() {
    const canvas_ref = useRef(null);

   /* rotate_u(state_stack[0], Math.PI / 3);
    rotate_l(state_stack[0], Math.PI / 6);
    rotate_h(state_stack[0], 170 * (Math.PI / 180));
    console.log(state_stack[0].heading);
    console.log(state_stack[0].left);
    console.log(state_stack[0].up); */

    symbols = [{type: "!", wid: 0.02}, {type: "plant"}];
    //symbols = [{type: "/", angle: delta * 3},{type: "!", wid: 0.02},{type: "F", len: edge * 2}, {type: "["}, {type: "&", angle: delta * 3}, {type: "F", len: edge}, {type: "]"}];
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
    console.log(shapes);

    const v1 = [5, 3, -10];
    const v2 = [-4, -5, 7];
    console.log(cross_product(v1, v2));

    //get_next_symbol({type: "A", len: 5}, "  Flower  (sin(len) * cos(len) + 1, ) ");
    get_params();
    console.log(params);
    get_next_symbol({type: "A", len: 5, wid: 10}, "A(sin(len * sin(0)) + cos(len * cos(pi/2)) + 1 * delta,  (((wid + edge))))")
    
    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                {<OrbitControls enableZoom enablePan enableRotate/>}
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {objects.map((o)=>
                  <Branch key={uuidv4()} pos = {o[0]} heading = {o[1]} height = {o[2]} radius = {o[3]} id = {o[4]} parent_id = {o[5]}/>
                )}
                {shapes.map((s)=>
                  <Shape key = {uuidv4()} color = {s[0]} wid = {s[1]} points = {s[4]} id = {s[2]} parent_id = {s[3]}/>
                )}
                <Branch pos={[1, 1, 2]} heading = {[1, 1, 0]} radius={0.4} height={1}/>
            </Canvas>
        </div>
    )
}