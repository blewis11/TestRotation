import React, { Suspense, useRef, useState, useEffect } from "react";
import "./App.scss";
import { Canvas, useFrame, useThree } from "react-three-fiber";
import { useFBXLoader, Html } from "drei";
import CameraControls from "camera-controls";
import * as THREE from "three";

const clock = new THREE.Clock();
CameraControls.install({ THREE: THREE });

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

const Model = ({ position, modelRef, rotationY }) => {
  const object = useFBXLoader("model.fbx");

  return (
    <>
      <primitive
        object={object}
        ref={modelRef}
        position={position}
        rotation={[0, rotationY, 0]}
      />
    </>
  );
};

const Model2 = ({ position, modelRef, rotationY }) => {
  const object = useFBXLoader("model.1.fbx");

  return (
    <>
      <primitive
        object={object}
        ref={modelRef}
        position={position}
        rotation={[0, rotationY, 0]}
      />
    </>
  );
};

const EPS = 1e-5;

const WithCameraControlers = ({ position, modelRef, modelRef1 }) => {
  const { camera, scene, gl } = useThree();
  const cameraControls = new CameraControls(camera, gl.domElement);
  cameraControls.dollySpeed = 0;
  cameraControls.azimuthRotateSpeed = 0.3; // negative value to invert rotation direction
  cameraControls.polarRotateSpeed = -0.3; // negative value to invert rotation direction
  cameraControls.truckSpeed = (1 / EPS) * 3;
  cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
  cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
  cameraControls.saveState();

  useFrame(() => {
    const delta = clock.getDelta();
    cameraControls.update(delta);
  });

  useEffect(() => {
    const onClick = event => {
      var mouse = new THREE.Vector2();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      let intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let matchingIntersects1 = intersects.filter(
          item => item.object.parent.uuid === modelRef.current.uuid
        );
        let matchingIntersects2 = intersects.filter(
          item => item.object.parent.uuid === modelRef1.current.uuid
        );

        if (matchingIntersects1.length > 0) {
          cameraControls.fitToBox(modelRef.current, true);
          cameraControls.rotateTo(0, 1.56, true);
        } else if (matchingIntersects2.length > 0) {
          cameraControls.fitToBox(modelRef1.current, true);
          cameraControls.rotateTo(0, 1.56, true);
        }
      }
    };

    document.addEventListener("click", onClick, false);
  });

  return null;
};

function randomNumber(min, max) {
  const r = Math.random() * (max - min) + min;
  return Math.floor(r);
}

export default function App() {
  const positionX = randomNumber(-200, 200);
  const positionY = randomNumber(-200, 200);
  const positionZ = randomNumber(-200, -100);

  const positionX1 = randomNumber(-200, 200);
  const positionY1 = randomNumber(-50, 50);
  const positionZ1 = randomNumber(-50, 50);

  const rotationY = 0;

  const modelRef = useRef();
  const modelRef1 = useRef();

  return (
    <>
      <Canvas
        concurrent
        colorManagement
        camera={{ position: [0, 0, EPS], fov: 70 }}
      >
        <Lights />
        <Suspense fallback={null}>
          <Model
            position={[positionX, positionY, positionZ]}
            modelRef={modelRef}
            rotationY={rotationY}
          />
          <Model2
            position={[positionX1, positionY1, positionZ1]}
            modelRef={modelRef1}
            rotationY={rotationY}
          />
        </Suspense>
        <WithCameraControlers
          position={[positionX, positionY, positionZ]}
          modelRef={modelRef}
          modelRef1={modelRef1}
        />
      </Canvas>
    </>
  );
}
