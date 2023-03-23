import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef} from "react";
import Turtle from "./Turtle";
import {Vector3, Matrix4} from "three";

//3D turtle interpreter
//standard basis vectors
let rotation = new Matrix4();
let direction = new Matrix4();
const ex = new Vector3(-1, 0, 0); 
const ey = new Vector3(0, 1, 0);
const ez = new Vector3(0, 0, 1);

let init_state = {
    pos: [0, 0, 0],
    direction: direction,
    pen: ['brown', 30, true], 
}

let state = [init_state];


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


const Branch = ({pos, heading, radius, height}) => {
    const meshRef = useRef(null);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
       // get_rotation_u();
      //  meshRef.current.rotation.x = t; 
        meshRef.current.applyMatrix4(direction);
    })

    return (
        <mesh ref = {meshRef} position={pos}> 
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

    direction.makeBasis(ey, ex, ez);   
    print_matrix(direction);

    get_rotation_u(Math.PI/3);
    direction.multiply(rotation);
    get_rotation_l(Math.PI/6);
    direction.multiply(rotation);
    get_rotation_h(170 * (Math.PI/180));
    direction.multiply(rotation);

    print_matrix(direction);

    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/*<Cube/> */}
                <Branch pos={[0, 0, 0]} radius={0.2} height={1}/>
            </Canvas>
        </div>
    )
}