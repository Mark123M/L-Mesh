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
import Tree3D from './plants/Tree3D'
import Flower from './plants/Flower'
import Pine_tree from './plants/Pine_tree'
import Turtle from './plants/Turtle';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
    { /* <Tree2/>  */}
      <Pine_tree/>
      <Tree3D/>
      <Tree/>
      <Flower/>
      <Turtle/>
    </ChakraProvider>
  );
}

export default App;
