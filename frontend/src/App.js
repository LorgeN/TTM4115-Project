import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { TakeRat } from './pages/TakeRat';

function App() {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <TakeRat />
    </ChakraProvider>
  )
}

export default App;
