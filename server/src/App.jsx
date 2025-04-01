import { useState } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import { useSocketSetup } from './customHook/useSocketSetup'

function App() {
  useSocketSetup()

  return (
    <div>
      <Canvas/>
    </div>
  )
}

export default App
