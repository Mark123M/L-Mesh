import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef, useEffect} from "react";
import * as THREE from "three"

//3D turtle interpreter
//standard basis vectors
let rotation_matrix = new THREE.Matrix4();
let direction_matrix = new THREE.Matrix4();

let q = new THREE.Quaternion();
const ey = new THREE.Vector3(0, 1, 0);
let heading_vector = new THREE.Vector3();


let init_state = {
    pos: [0, 0, 0],
    direction: [
      0,-1, 0, 0,
      1, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ],
    pen: ['brown', 30, true], 
}

let state = [init_state];


const rotate_u = (direction_array, angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation_matrix.set(
        ct, st, 0, 0,
        -st, ct, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    )
    direction_matrix.set(
      ...direction_array
    )
    direction_matrix.multiply(rotation_matrix);
    return direction_matrix.toArray();
}

const rotate_l = (direction_array, angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation_matrix.set(
        ct, 0, -st, 0,
        0, 1, 0, 0,
        st, 0, ct, 0,
        0, 0, 0, 1
    )
    direction_matrix.set(
      ...direction_array
    )
    direction_matrix.multiply(rotation_matrix);
    return direction_matrix.toArray();
}

const rotate_h = (direction_array, angle) => {
    const st = Math.sin(angle);
    const ct = Math.cos(angle);
    rotation_matrix.set(
        1, 0, 0, 0,
        0, ct, -st, 0,
        0, st, ct, 0,
        0, 0, 0, 1
    )
    direction_matrix.set(
      ...direction_array
    )
    direction_matrix.multiply(rotation_matrix);
    return direction_matrix.toArray();
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



const print_matrix_array = (m) => {
    console.log(m[0], m[1], m[2], m[3]);
    console.log(m[4], m[5], m[6], m[7]);
    console.log(m[8], m[9], m[10], m[11]);
    console.log(m[12], m[13], m[14], m[15]);
}

export default function Plant3D() {
    const canvas_ref = useRef(null);

    let m = [
      0,-1, 0, 0,
      1, 0, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    m = rotate_u(m, Math.PI / 3);
    m = rotate_l(m, Math.PI / 6);
    m = rotate_h(m, 170 * (Math.PI / 180));
    print_matrix_array(m);


   /* print_matrix(direction);

    get_rotation_u(Math.PI/3);
    direction.multiply(rotation);
    get_rotation_l(Math.PI/6);
    direction.multiply(rotation);
    get_rotation_h(170 * (Math.PI/180));
    direction.multiply(rotation);

    print_matrix(direction); */

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