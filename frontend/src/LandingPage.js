import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import "./Landing.css";
import azis from "./resources/images/importantazis.jpg";

const BackgroundScene = () => {
  return (
    <Sphere visible args={[2, 100, 200]} scale={1}>
      <MeshDistortMaterial
        color="#6C63FF"
        attach="material"
        distort={0.5}
        speed={5}
        roughness={0}
      />
    </Sphere>
  );
};

const Landing = () => {
  return (
    <div className="landing-wrapper">
      {/* 3D Background */}
      <Canvas className="canvas-bg" gl={{ preserveDrawingBuffer: true }} camera={{ position: [0, 0, 10], fov: 50 }}>
        <color attach="background" args={["#000000"]} /> {/* Set background color */}
        <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[2, 5, 2]} />
            <BackgroundScene />
            <OrbitControls enableZoom={false} enablePan={false} />
        </Suspense>
    </Canvas>

      {/* Foreground Content */}
      <div className="landing-container">
        <section className="hero">
          <h1>Welcome to GatorTrade</h1>
          <p>Find and sell everything you need for college life.</p>
        </section>

        <section className="cards-section">
          <div className="card">
            <img src={azis} alt="Card 1" />
            <div className="card-text">
              <h2>Easy Listings</h2>
              <p>Create and manage your listings in seconds.</p>
            </div>
          </div>

          <div className="card">
            <div className="card-text">
              <h2>Verified Students Only</h2>
              <p>Keep it safe with .edu email verification.</p>
            </div>
            <img src={azis} alt="Card 2" />
          </div>

          <div className="card">
            <img src={azis} alt="Card 3" />
            <div className="card-text">
              <h2>Campus Connection</h2>
              <p>Buy and sell from students right at your school.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
