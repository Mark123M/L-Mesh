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
import Tree from './plants/Tree';
import Tree2 from './plants/Tree2';
import Flower from './plants/Flower'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
    { /* <Tree/>  */}
      <Tree2/>
      <Flower/>
    </ChakraProvider>
  );
}

export default App;
