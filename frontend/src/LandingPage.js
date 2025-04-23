// Super Shiny
import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF} from "@react-three/drei";
import "./Landing.css";
import azis from "./resources/images/importantazis.jpg";
import logo from "./resources/3js/GatorTradeLogoSuperShiny.gltf"

const LogoModel = React.forwardRef((props, ref) => {
    const { scene } = useGLTF(logo);
  
    return (
      <primitive
        object={scene}
        scale={[2.6, 2.6, 2.6]}
        position={[-0.025, 0, -2]}
        rotation={[-0.2, -0.4, 0]}
        ref={ref} // 👈 forward the ref here
        {...props}
      />
    );
  });

const BackgroundScene = () => {
    const modelRef = useRef();
    
  
    useFrame(() => {
      if (modelRef.current) {
        modelRef.current.rotation.z -= 0.005;
      }
    });
  
    return (
        <group>
          <LogoModel ref={modelRef} />
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
            camera={{ position: [0, 0, 0], fov: 40 }}
          >
            <color attach="background" args={["#0a0a0a"]} />
            <Suspense fallback={null}>
              <ambientLight intensity={0} />
              {/* Fill Light */}
              <pointLight position={[2, 0, 2]} intensity={20000} />
              {/* Back Light */}
              <pointLight position={[-2, 0, -2]} intensity={20000}/>
              {/* Key Light */}
              <pointLight position={[-2, 0, 2]} intensity={20000} color='#95F09B'/>
              <BackgroundScene />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Suspense>
          </Canvas>
        </div>
  
        {/* Foreground Content */}
        <div className="landing-container">
          <section className="hero">
            <h1>Welcome to <span style={{ color: "#95F09B" }}>GatorTrade</span></h1>
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


