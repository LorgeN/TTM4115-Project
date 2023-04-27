import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { TakeRat } from './pages/TakeIRat';
import { TakeTRat } from './pages/TakeTRat';
import { StudentHome } from './pages/StudentHome';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WaitingRoom } from './pages/WaitingRoom';
import { Login } from './pages/Login';
/*import { Connection } from './pages/MQTTExperiment';*/
import HookMqtt from './components/Hook/'
function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider >
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/studenthome" element={<StudentHome />}/>
        <Route path="takerat" element={<TakeRat />} />
        <Route path="takeTrat" element={<TakeTRat />} />
        <Route path="waitingroom" element={<WaitingRoom />} />
        
        
        
      </Routes>

    </BrowserRouter>
    <HookMqtt />
    </ChakraProvider>
  )
}

export default App;
