import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { TakeRat } from './pages/TakeRat';
import { StudentHome } from './pages/StudentHome';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WaitingRoom } from './pages/WaitingRoom';

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider >
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentHome />}/>
        <Route path="takerat" element={<TakeRat />} />
        <Route path="waitingroom" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  )
}

export default App;
