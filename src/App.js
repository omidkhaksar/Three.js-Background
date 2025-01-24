import React, { useEffect, useRef } from "react"
import "./App.css"
import { Spheres2Background } from "threejs-components"
import * as dat from "dat.gui"

function App() {
  const canvasRef = useRef(null)
  const bgRef = useRef(null) // Reference to the background instance
  const guiRef = useRef(null) // Reference to the dat.GUI instance

  useEffect(() => {
    const canvas = canvasRef.current

    if (canvas) {
      // Initialize the Spheres2Background instance and store it in bgRef
      bgRef.current = Spheres2Background(canvas, {
        count: 200,
        attraction: 0.6,
        maxVelocity: 0.3,
        friction: 0.95,
        colors: [
          0xffffff * Math.random(),
          0xffffff * Math.random(),
          0xffffff * Math.random(),
        ],
        minSize: 0.2,
        maxSize: 1,
        materialParams: {
          clearcoat: 1,
          clearcoatRoughness: 0.5,
          metalness: 0.1,
          roughness: 0.1,
        },
      })

      const spheres = bgRef.current.spheres // Ensure we reference the correct object

      // Initialize dat.GUI
      guiRef.current = new dat.GUI()
      const gui = guiRef.current

      // Parameters for dat.GUI
      const params = {
        count: spheres.config.count,
        attraction: spheres.config.attraction,
        maxVelocity: spheres.config.maxVelocity,
        friction: spheres.config.friction,
        colors: {
          color1: `#${Math.floor(spheres.config.colors[0])
            .toString(16)
            .padStart(6, "0")}`,
          color2: `#${Math.floor(spheres.config.colors[1])
            .toString(16)
            .padStart(6, "0")}`,
          color3: `#${Math.floor(spheres.config.colors[2])
            .toString(16)
            .padStart(6, "0")}`,
        },
      }

      // GUI controls
      gui
        .add(params, "count", 1, 200)
        .step(5)
        .onChange((value) => {
          spheres.count = value
        })
      gui
        .add(params, "maxVelocity", 0.1, 1)
        .step(0.1)
        .onChange((value) => {
          spheres.config.maxVelocity = value
        })
      gui
        .add(params, "friction", 0.8, 1.1)
        .step(0.05)
        .onChange((value) => {
          spheres.config.friction = value
        })
      gui
        .add(params, "attraction", 0.1, 1)
        .step(0.1)
        .onChange((value) => {
          spheres.config.attraction = value
        })
      Object.keys(params.colors).forEach((key, index) => {
        gui.addColor(params.colors, key).onChange((value) => {
          const color = parseInt(value.replace("#", ""), 16)
          spheres.config.colors[index] = color
          spheres.setColors(spheres.config.colors)
        })
      })
      // colorFolder.open()
    }

    // Cleanup function to dispose of the background and GUI instances
    return () => {
      if (bgRef.current) {
        bgRef.current.dispose()
        bgRef.current = null
      }
      if (guiRef.current) {
        guiRef.current.destroy()
        guiRef.current = null
      }
    }
  }, [])

  return (
    <div id="app">
      <div className="hero">
        <h1>Spheres</h1>
        <h2>Three.js</h2>
      </div>
      <canvas id="webgl-canvas" ref={canvasRef}></canvas>
    </div>
  )
}

export default App
