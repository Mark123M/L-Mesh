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
import Flower from './plants/Flower'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
    {  <Tree/> }
      <Flower/>
    </ChakraProvider>
  );
}

export default App;
