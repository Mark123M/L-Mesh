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
import Tree3D from './plants/Tree3D'
import Flower from './plants/Flower'
import Pine_tree from './plants/Pine_tree'
import Space_tree from './plants/Space_tree'
import Pine_tree2 from './plants/Pine_tree2'

//import ThreeJs from './plants/old models/ThreeJs';
import Plant3D from './plants/Plant3D';
import Turtle from './plants/Turtle';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
      <Plant3D/>
      <Turtle/>
      
    { /*
      <ThreeJs/> 
      <Tree2/>  
      <Pine_tree2/>
      <Pine_tree/>
      <Space_tree/> 
      <Tree3D/>
      <Flower/>
      <Tree/>
      <Turtle/>  */}

    </ChakraProvider>
  );
}

export default App;
