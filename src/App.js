import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import Plant from './plants/Plant';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
      <Plant/>
    </ChakraProvider>
  );
}

export default App;
