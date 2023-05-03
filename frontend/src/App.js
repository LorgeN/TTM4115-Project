import * as React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { TakeIRat } from "./pages/TakeIRat";
import { TakeTRat } from "./pages/TakeTRat";
import { StudentHome } from "./pages/StudentHome";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RatComplete } from "./pages/RatComplete";
import { Login } from "./pages/Login";
import { TaHome } from "./pages/TaHome";
import { Layout } from "./components/Layout";
import { SessionContextProvider } from "./utils/useSession";

function App() {
  return (
    <ChakraProvider>
      <SessionContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="studenthome" element={<StudentHome />} />
              <Route path="takeirat" element={<TakeIRat />} />
              <Route path="taketrat" element={<TakeTRat />} />
              <Route path="ratcomplete" element={<RatComplete />} />
            </Route>

            <Route path="tahome" element={<TaHome />} />
          </Routes>
        </BrowserRouter>
      </SessionContextProvider>
    </ChakraProvider>
  );
}

export default App;
