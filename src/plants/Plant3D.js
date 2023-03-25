import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect} from "react";
import * as THREE from "three"

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
    pen: ['brown', 30, true], 
}

let state_stack = [init_state];

const matrix_vector_mult = (m, v) =>{
  return vector_add(scalar_mult(v[0], m.heading), vector_add(scalar_mult(v[1], m.left), scalar_mult(v[2], m.up)));
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
            <meshStandardMaterial color="blue"/>
        </mesh>
    )
}

export default function Plant3D() {
    const canvas_ref = useRef(null);

    rotate_u(state_stack[0], Math.PI / 3);
    rotate_l(state_stack[0], Math.PI / 6);
    rotate_h(state_stack[0], 170 * (Math.PI / 180));
    console.log(state_stack[0].heading);
    console.log(state_stack[0].left);
    console.log(state_stack[0].up);


    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                {/*<OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/> */}
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />

                <Branch pos={[1, 1, 0]} heading = {[1, 1, 0]} radius={0.2} height={1}/>
            </Canvas>
        </div>
    )
}