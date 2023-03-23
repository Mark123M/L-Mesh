import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef} from "react";
import Turtle from "./Turtle";
import {Vector3, Matrix4} from "three";

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
let rotation = new Matrix4();

const get_rotation_u = (angle) =>{
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation.set(
        ct, st, 0, 0,
        -st, ct, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
        )
    console.log(rotation);
}

const Branch = ({pos, heading, radius, height}) => {
    const meshRef = useRef(null);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
        meshRef.current.rotation.x = t; 
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

export default function Plant3D() {
    const canvas_ref = useRef(null);

    get_rotation_u(Math.PI/3);
    return (
        <div ref={canvas_ref} style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"} }>
            <Canvas>
                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false}/>
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Cube/>
                <Branch pos={[0, 0, -10]} radius={1} height={10}/>
            </Canvas>
        </div>
    )
}