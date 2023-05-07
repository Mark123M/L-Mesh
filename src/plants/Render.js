import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect, useState} from "react";
import * as THREE from "three"
import { v4 as uuidv4 } from "uuid";
import { useThree } from "@react-three/fiber";
import { ShapeUtils } from "three";
import * as math from "mathjs"
import React from 'react'
import ReactDOM from 'react-dom'

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

const init_state = {
    pos: [0, 0, 0],
    heading: [0, 1, 0],
    left: [-1, 0, 0], 
    up: [0, 0, 1],
    pen: [[128, 83, 51], 0.4, true], 
}

let num_gens = 6;

//given a symbol, return the next generation of replacement symbols based on productions.
const generate_rules = (symbol, productions, constants, params) =>{
  let symbol_str = symbol.type;

  if(!params[symbol.type]){
    return;
  }
  if(params[symbol.type].length > 0) {
    symbol_str = symbol_str + '(';
    //console.log("PARAMS OF CURRENT SYMBOL",params[symbol.type]);
    for(let i = 0; i < params[symbol.type].length - 1; i++) {
      symbol_str = symbol_str + params[symbol.type][i] + ',';
    }
    symbol_str = symbol_str + params[symbol.type][params[symbol.type].length - 1] + ')';
    //console.log(symbol_str);
  }

  if(!(symbol_str in productions)) {
    console.log("symbol not found in productions");
    return;
  }
  let new_symbols = [];
  productions[symbol_str].forEach((r)=>{
    new_symbols.push(
      {
        rule: r.rule.split(" ").map((s)=>get_next_symbol(symbol, s, constants, params)),
        prob: r.prob
      }
    )
  })
  /*productions[symbol_str].split(" ").forEach((s)=>{
    console.log("NEW SYMBOLS", symbol, s, get_next_symbol(symbol, s));
    new_symbols.push(get_next_symbol(symbol, s));

  })*/
  //console.log("NEW SYMBOLS", new_symbols);
  return chooseOne(new_symbols);
 
}

//"name" : val
/*let constants = {
  "num_gens": 5,
  "delta": 22.5,
  "edge": 0.4,
  "init_wid": 0.04,
  "hr": 0.707,
  "col_rate": [0, 15, 0]
} */

//let axiom = "A(edge,init_wid,[0,80,0],[128,83,51])"

//"symbol" : "replacements"
/*let productions = {
  //default productions

  //custom productions
  "A(len,wid,lcol,bcol)": [{rule: "[ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ] /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) /(delta) [ &(delta) !(wid) '(bcol) F(len,lcol) '(lcol) L A(len,wid*hr,lcol+col_rate,bcol+col_rate) ]", prob:1.0}],
  "F(len,lcol)": [{rule: "S(lcol) /(delta) /(delta) /(delta) /(delta) /(delta) F(len,lcol)", prob:1.0}],
  "S(lcol)": [{rule: "F(edge,lcol) '(lcol) L", prob: 1.0}],
  "L": [{rule: "[ ^(delta) ^(delta) { . -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) . -(delta) | -(delta) f(edge) . +(delta) f(edge) . +(delta) f(edge) } ]", prob: 1.0}],

} */
//"name" : [param1, param2...]
//SHOULD INCLUDE PRIMITIVE COMMANDS ALWAYS, LIKE F, f, !, [, ], {, }, /, \


const get_axiom = (axiom, constants, params) =>{
  return axiom.split(" ").map((s)=>get_next_symbol(null, s, constants, params));
}

const get_next_symbol = (symbol, rule, constants, params) => {
  
  //console.log("INITIAL RULE IS: ", rule);
  rule = rule.replaceAll(' ', ''); //remove all whitespaces for safety
  if(!rule.includes('(')) { //if there are no parameters
    //console.log({type: rule});
    return {type: rule};
  }
  const firstIdx = rule.indexOf('(');
  const type = rule.substring(0, firstIdx);
  const lastIdx = rule.lastIndexOf(")");
  rule = rule.substring(firstIdx + 1, lastIdx);
  //console.log("TRIMMED RULE IS", type, rule);

  if(symbol != null) {
    Object.keys(symbol).forEach((s)=>{
      //console.log(s, symbol[s]);
      if(s != "type"){
        rule = rule.replaceAll(s, JSON.stringify(symbol[s])); //replace all variables of the production with any fields of symbol 
      }
    })
  }
  //console.log("PRINTING CONSTANTS", constants);
  Object.keys(constants).forEach((s)=>{
    if(s != "num_gen"){
      rule = rule.replaceAll(s, JSON.stringify(constants[s])); //replace all variables of the production with any constants
    }
  })
  //console.log("SUBBED RULE IS ", rule, symbol);

  let stack = [];
  let cur_param = "";
  let param_idx = 0;
  let new_symbol = {type: type};

  for(let i = 0; i < rule.length; i++) {
    if(rule[i] == ',' && stack.length == 0) { //if theres a comma that is not in a bracket, this is a parameter
      //console.log("PARAM TPYE: ",type,  params, new_symbol, cur_param); //ohh math.evaluate is fucking up 
      const val = math.evaluate(cur_param);
      new_symbol[params[type][param_idx]] = math.typeOf(val) == "DenseMatrix" ? val.toArray() : val;
      cur_param = "";
      param_idx++;
      continue;
    }
    cur_param = cur_param + rule[i];
    if(rule[i] == '(' || rule[i] == '[') {
      stack.push(rule[i]);
    }
    else if (rule[i] == ')' || rule[i] == ']') {
      stack.pop();
    }
  }
  if(rule[rule.length - 1] != ',') {
    //console.log("PARAM TPYE: ",type,  params, cur_param); //ohh math.evaluate is fucking up 
    const val = math.evaluate(cur_param);
    new_symbol[params[type][param_idx]] = math.typeOf(val) == "DenseMatrix" ? val.toArray() : val;
    cur_param = "";
    param_idx++;
  }
  //console.log(new_symbol);
  return(new_symbol);
}

const get_params = (productions, params) => {
  Object.keys(productions).forEach((s)=>{

    if(!s.includes('(')){
      params[s] = [];
     // console.log(params);
    }
    else {
      const type = s.substring(0, s.indexOf('('));
      //console.log(type);
      s = s.substring(s.indexOf('('));
      s = s.replaceAll(' ','');
      s = s.replaceAll('(', '');
      s = s.replaceAll(')', '');
      params[type] = s.split(',');
    }
  })
  //console.log("NEW PARAMS", params, productions);
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
const rgbToHex = (rgb, type) => {
  //console.log("RGB VALUES ARE", rgb); //some rgb are undefined waht the fuck 
  return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
}

//MAKE SURE NOT TO EDIT ANY VECTORS
const Branch = ({pos, heading, radius, height, id, parent_id, color}) => {
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
    })

    return (
        <mesh ref = {meshRef} name = {id}> 
            <cylinderGeometry args={[radius, radius, height, 6]}/>
            <meshStandardMaterial color={rgbToHex(color, true)}/>
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

    positions.setZ(0, points[0][2]);
    mesh_geometry.setAttribute('position', positions);
    setGeometry(mesh_geometry);
  }, [meshRef]); 
  return (
    <mesh mesh ref = {meshRef} name = {id} geometry={geometry}>
      <meshPhongMaterial color={rgbToHex(color, false)} side={THREE.DoubleSide}/>
    </mesh>
  );
}

const Render = ({axiom, constants, productions}) => {
  const[objects, setObjects] = useState([]);
  const[shapes, setShapes] = useState([]);
  //{ means start a new shape, } means push the shape into the shapes array to be drawn
  const [symbols, setSymbols] = useState([]);
  const [params, setParams] = useState({
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
  });

  const canvas_ref = useRef(null);


  const generate = (symbols) => {
    let next = [];
  
    for(let i = 0; i < symbols.length; i++) {
      let s = symbols[i];
      let s2 = generate_rules(s, productions, constants, params);
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
   const applyRule = (symbol, newObjects, newShapes, newStateStack, newShapeStack) => {
    //console.log(newStateStack, "WITH TYPE", symbol.type); //pritning out the states
    let last_state = newStateStack[newStateStack.length - 1];
    if(symbol.type == "!") {
      last_state.pen[1] = symbol.wid;
    }
    else if (symbol.type == "F") {
      //each new object stores: position, direction vector, length, width/radius
      //draw object
      newObjects.push([vector_add(last_state.pos, scalar_mult(symbol.len/2, last_state.heading)), last_state.heading, symbol.len, last_state.pen[1], symbol.id, symbol.parent_id, last_state.pen[0]]);
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
      newStateStack.push(new_state);
    }
    else if (symbol.type == "]") {
      newStateStack.pop();
    }
    else if (symbol.type == "L") {
      //drawLeaf(symbol.sz);
    }
    //start a new polygon
    else if (symbol.type == "{") {
      newShapeStack.push([last_state.pen[0], 1, symbol.id, symbol.parent_id, []]); 
    }
    //finish the current polygon
    else if (symbol.type == "}") {
      newShapes.push(newShapeStack.pop());
    }
    //draw a vertex for the current polygon
    else if (symbol.type == ".") {
      const num_shapes = newShapeStack.length;
      newShapeStack[num_shapes - 1][4].push(last_state.pos);
    }
    else if (symbol.type == "'") {
      last_state.pen[0] = symbol.color;
    }
    
  }

  const getAllMeshes = () => {
    const newStateStack = [
      {pos: [0, 0, 0],
      heading: [0, 1, 0],
      left: [-1, 0, 0], 
      up: [0, 0, 1],
      pen: [[128, 83, 51], 0.4, true], }
    ];
    const newShapeStack = [];
    const newObjects = [];
    const newShapes = [];
    for(let i = 0; i < symbols.length; i ++) {
      let s = symbols[i];
      applyRule(s, newObjects, newShapes, newStateStack, newShapeStack);
    } 
    setObjects(newObjects);
    setShapes(newShapes);
  }

  //params -> generating symbols -> objects -> shapes 
  useEffect(()=>{
    console.log("PRINTING ALL PROPS");
    console.log(axiom);
    console.log(constants);
    console.log(productions);

    let newParams = {
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
    };
    get_params(productions, newParams);
    //console.log("NEW PARAMS", newParams);
    setParams(newParams); 
  }, [axiom, constants, productions])

  useEffect(()=>{
    console.log("All params:",params);
      
    let newSymbols = get_axiom(axiom, constants, params); //start with the axiom 
    console.log("INITIAL SYMBOLS", newSymbols);  
    for(let i = 0; i < constants["num_gens"]; i ++) {
      newSymbols = generate(newSymbols);
      //  console.log(symbols, "NEW SYMBOLS");
    }
    //console.log(newSymbols);
    setSymbols(newSymbols); 
  }, [params])

  useEffect(()=>{
    console.log("FINAL SYMBOLS", symbols);
    getAllMeshes();
  }, [symbols])

  useEffect(()=>{
    console.log("FINAL OBJECTS", objects);
  }, [objects])

  useEffect(()=>{
    console.log("FINAL SHAPES", shapes);
  }, [shapes])

  //console.log(math.evaluate('[1, 2, 3]').toArray());
  //console.log(math.evaluate('[[1, 2, 3],[1,2,3]] + [[4, 5, 6],[4,5,6]]').toArray()); 

  return (
    <div ref={canvas_ref} style={{top: "0", bottom: "0", right: "0", width: "100%"} }>
        <Canvas>
            <PerspectiveCamera makeDefault position={[4, 4, 10]} />
            <OrbitControls enableZoom enablePan enableRotate/>
            <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            {objects.map((o)=>
              <Branch key={uuidv4()} pos = {o[0]} heading = {o[1]} height = {o[2]} radius = {o[3]} id = {o[4]} parent_id = {o[5]} color = {o[6]}/>
            )}
            {shapes.map((s)=>
              <Shape key = {uuidv4()} color = {s[0]} wid = {s[1]} points = {s[4]} id = {s[2]} parent_id = {s[3]}/>
            )}
            <Branch color={[128, 83, 51]} pos={[1, 1, 2]} heading = {[1, 1, 0]} radius={0.4} height={1}/>
        </Canvas>
    </div>
  )
}

export default Render;