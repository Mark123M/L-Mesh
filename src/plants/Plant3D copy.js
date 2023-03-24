import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect} from "react";
import Turtle from "./Turtle";
import {Vector3, Matrix4, Quaternion} from "three";

//3D turtle interpreter
//standard basis vectors
let rotation = new Matrix4();
let direction = new Matrix4().set(    
    0, -1, 0, 0,
    1,  0, 0, 0,
    0,  0, 1, 0,
    0,  0, 0, 1);
const ex = new Vector3(-1, 0, 0); 
const ey = new Vector3(0, 1, 0);
const ez = new Vector3(0, 0, 1);

let init_state = {
    pos: [0, 0, 0],
    direction: [  //H, L, U
        0, -1, 0, 0,
        1,  0, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1],
    pen: ["#805333", 30, true], 
}
let state = [init_state];
let shapes = [];
let symbols;
let num_gens = 8;


const get_rotation_u = (angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation.set(
        ct, st, 0, 0,
        -st, ct, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
        )
}
const get_rotation_l = (angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation.set(
        ct, 0, -st, 0,
        0, 1, 0, 0,
        st, 0, ct, 0,
        0, 0, 0, 1
    )
}
const get_rotation_h = (angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation.set(
        1, 0, 0, 0,
        0, ct, -st, 0,
        0, st, ct, 0,
        0, 0, 0, 1
    )
}

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
/*
  //HERE WE FUCKING GOOOO
  function applyRule(symbol) {
    if(symbol.type == "!") {
      state[state.length - 1].pen[1] = symbol.wid;
    }
    else if (symbol.type == "F") {
      p5.stroke("#805333");
      p5.line(0, 0, 0, 0, -1* (symbol.len), 0);
      p5.translate(0, -1 * (symbol.len), 0);
    }
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
*/


const Branch = ({pos, radius, height, rotation}) => {
    const meshRef = useRef(null);

    let t;

    useEffect(()=>{
      if(meshRef.current) {
       // meshRef.current.rotation.set(rotation);
      }
    }, [meshRef]);
    
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
       // meshRef.current.applyMatrix4(new Matrix4().makeRotationX(Math.PI/3));
    })

    return (
        <mesh ref = {meshRef} position={pos} rotation = {[-Math.PI / 2, 0, 0]}> 
            <cylinderGeometry args={[radius, radius, height, 6]}/>
            <meshStandardMaterial color="blue"/>
        </mesh>
    )
}

const Cube = ({pos, heading}) =>{
    //set position in the mesh
    //maintain a separate orientation matrix [H, L, U]
    //the orientation gets updated for each rotation to keep track of math, but the actual rotation is done with 
    //use arrays instead of the local matricies, then in three js, apply the transformation matricies (from $ operations etc.)
    const meshRef = useRef(null);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
       // meshRef.current.rotation.x = Math.sin(t);
        //meshRef.current.rotation.y = t;
        meshRef.current.rotation.x = t; 
    })

    return (
        <mesh ref = {meshRef} position={pos}> 
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="blue"/>
        </mesh>
    )

}

const print_matrix = (m) => {
    let v1 = new Vector3();
    let v2 = new Vector3();
    let v3 = new Vector3();
    console.log(m.extractBasis(v1, v2, v3))
    console.log(v1);
    console.log(v2);
    console.log(v3);
}

export default function Plant3D() {
    const canvas_ref = useRef(null);

 //   direction.makeBasis(ey, ex, ez);   
    print_matrix(direction);
 /*   get_rotation_u(Math.PI/3);
    direction.multiply(rotation);
    get_rotation_l(Math.PI/6);
    direction.multiply(rotation);
    get_rotation_h(170 * (Math.PI/180));
    direction.multiply(rotation);
    print_matrix(direction); */

    //get_rotation_u(Math.PI/3);
    //direction.multiply(rotation);

    let q = new Quaternion().setFromRotationMatrix(new Matrix4().makeRotationX(Math.PI/3));
   // console.log(q);

   symbols = [{type: "A", len: 120, wid: 25}];
   for(let i = 0; i < num_gens; i ++) {
        symbols = generate();
        //   console.log(symbols, "NEW SYMBOLS");
        console.log(symbols);
    }
    for(let i = 0; i < symbols.length; i ++) {
        let s = symbols[i];
       // applyRule(s);
    }

    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/*<Cube/> */}
                <Branch pos={[0, 0, 0]} radius={0.2} height={1} rotation = {q}/>
            </Canvas>
        </div>
    )
}