import * as React from "react";

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react";
import { TakeIRat } from "./pages/TakeIRat";
import { TakeTRat } from "./pages/TakeTRat";
import { StudentHome } from "./pages/StudentHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RatComplete } from "./pages/RatComplete";
import { Login } from "./pages/Login";
/*import { Connection } from './pages/MQTTExperiment';*/
import { TaHome } from "./pages/TaHome";
import { Layout } from "./components/Layout";

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route element={<Layout />}>
            <Route path="/studenthome" element={<StudentHome />} />
            <Route path="/taHome" element={<TaHome />} />
            <Route path="takeirat" element={<TakeIRat />} />
            <Route path="taketrat" element={<TakeTRat />} />
            <Route path="ratcomplete" element={<RatComplete />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
