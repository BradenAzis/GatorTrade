import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF} from "@react-three/drei";
import "./Landing.css";
import azis from "./resources/images/importantazis.jpg";
import logo from "./resources/3js/GatorTradeLogo.glb"

const LogoModel = () => {
    const { scene } = useGLTF(logo);
  
    return (
      <primitive
        object={scene}
        scale={[5, 5, 5]}           // Scale the model (uniform or non-uniform)
        position={[0, 0, 0]}       // Move it in the 3D space (x, y, z)
        rotation={[0, Math.PI / 2, 0]} // Rotate it (x, y, z in radians)
      />
    );
  };

const BackgroundScene = () => {
    const { camera } = useThree();
    const scrollYRef = useRef(0);
    const modelRef = useRef();
  
    useEffect(() => {
      const handleScroll = () => {
        scrollYRef.current = window.scrollY;
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    useFrame(() => {
      const scrollEffect = scrollYRef.current * 0.005;
      camera.position.y += (scrollEffect - camera.position.y) * 0.05;
      if (modelRef.current) {
        modelRef.current.position.y = -scrollEffect * 0.2;
      }
    });
  
    return (
      <group ref={modelRef}>
        <LogoModel />
      </group>
    );
  };

const Landing = () => {
    return (
      <>
        {/* Background Canvas */}
        <div className="canvas-container">
          <Canvas
            className="canvas-bg"
            gl={{ preserveDrawingBuffer: true }}
            camera={{ position: [0, 0, 10], fov: 40 }}
          >
            <color attach="background" args={["#FFFFFF"]} />
            <Suspense fallback={null}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[2, 5, 2]} intensity={10}/>
              <BackgroundScene />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
  
        {/* Foreground Content */}
        <div className="landing-container">
          <section className="hero">
            <h1>Welcome to GatorTrade</h1>
            <p>Find and sell everything you need for college life.</p>
          </section>
          <section className="spacer">
          </section>
          <section className="cards-section">
            <div className="card">
              <img src={azis} alt="Card 1" />
              <div className="card-text">
                <h2>Easy Listings</h2>
                <p>Create and manage your listings in seconds.</p>
              </div>
            </div>
            <section className="spacer">
            </section>
  
            <div className="card">
              <div className="card-text">
                <h2>Verified Students Only</h2>
                <p>Keep it safe with .edu email verification.</p>
              </div>
              <img src={azis} alt="Card 2" />
            </div>
            <section className="spacer">
          </section>
  
            <div className="card">
              <img src={azis} alt="Card 3" />
              <div className="card-text">
                <h2>Campus Connection</h2>
                <p>Buy and sell from students right at your school.</p>
              </div>
            </div>
            <section className="spacer2">
            </section>
          </section>
        </div>
      </>
    );
  };
  
  

export default Landing;
