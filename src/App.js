import React, { Suspense, useRef } from "react";
import "./App.scss";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { useFBXLoader, Html } from 'drei'
import CameraControls from 'camera-controls'
import * as THREE from "three"

const clock = new THREE.Clock()
CameraControls.install( { THREE: THREE } )

const Lights = () => {
  return (
    <>
      {/* Ambient Light illuminates lights for all objects */}
      <ambientLight intensity={0.3} />
      {/* Diretion light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight
        castShadow
        position={[0, 10, 0]}
        intensity={1.5}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Spotlight Large overhead light */}
      <spotLight intensity={1} position={[1000, 0, 0]} castShadow />
    </>
  );
};

const Model = ({position, modelRef, rotationY}) => {

  const object = useFBXLoader("model.fbx")
  
  return (
    <> 
      <primitive
        object={object}
        ref={modelRef}
        position={position}
        rotation={[0, rotationY, 0]}
      />
    </>
  )
}

const WithCameraControlers = ({position, modelRef}) => {
  const { camera, gl } = useThree()
  const cameraControls = new CameraControls( camera, gl.domElement )

  useFrame(() => {
    const delta = clock.getDelta()
	  const hasControlsUpdated = cameraControls.update( delta )
  })
  
  return (
    <>
      <Html>
        <button style={{ width: '100px'}} onClick={() => { 
          cameraControls.fitTo(modelRef.current, true)
          cameraControls.rotateTo(0, 1.56, true)
        }}>Click Me</button>
      </Html>
    </>
  )
}

function randomNumber(min, max){
  const r = Math.random()*(max-min) + min
  return Math.floor(r)
}

export default function App() {
  const positionX = randomNumber(-100, 100)
  const positionY = randomNumber(-50, 50)
  const positionZ = randomNumber(-50, 50)

  const rotationY = 0

  const positionX2 = randomNumber(-100, 100)
  const positionY2 = randomNumber(-50, 50)

  const modelRef = useRef()

  return (
    <>
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [positionX2, positionY2, 120], fov: 70 }}>
        <Lights />
        <Suspense fallback={null} >
          <Model position={[positionX, positionY, positionZ]} modelRef={modelRef} rotationY={rotationY}/>
          {/* <OrbitControls /> */}
        </Suspense>
        <WithCameraControlers position={[positionX, positionY, positionZ]} modelRef={modelRef}/>
      </Canvas>
    </>
  );
}
