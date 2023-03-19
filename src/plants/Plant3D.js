import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import {useRef} from "react";

const Cube = () =>{
    const meshRef = useRef(null);

    let t;
    useFrame((state)=>{
        t = state.clock.getElapsedTime();
        if(!meshRef.current){
            return;
        }
        meshRef.current.rotation.x = Math.sin(t);
        meshRef.current.rotation.y = Math.sin(t)/3; 
    })

    return (
        <mesh ref = {meshRef} position={[0, 0, 0]}>
            <boxGeometry args={[1, 1, 1]}/>
            <meshStandardMaterial color="blue"/>
        </mesh>
    )

}

export default function Plant3D() {

    return (
        <div style={{position: "fixed", top: "0", left: "0", bottom: "0", right: "0", overflow: "auto"}}>
            <Canvas>
                <OrbitControls enableZoom enablePan enableRotate={false}/>
                <axesHelper renderOrder={1} scale={[5, 5, 5]}/>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                {/*<PerspectiveCamera position={[0, 0, 0]}> */}
                <Cube/>
                {/*</PerspectiveCamera>*/}
            </Canvas>
        </div>
    )
}