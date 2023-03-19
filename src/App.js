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
import Plant from './plants/old models/Plant';
import Tree from './plants/Tree';
import Tree2 from './plants/Tree2';
import Tree3D from './plants/Tree3D'
import Flower from './plants/Flower'
import Pine_tree from './plants/Pine_tree'
import Turtle from './plants/Turtle';
import Space_tree from './plants/Space_tree'
import Pine_tree2 from './plants/Pine_tree2'

import ThreeJs from './plants/ThreeJs';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
      <ThreeJs/>
      
    { /* <Tree2/>  
      <Pine_tree2/>
      <Pine_tree/>
      */}
   {/*   <Space_tree/> 
      <Tree3D/>
     
      <Flower/>*/}
     {/*  <Tree/>
      <Turtle/>  */}
    </ChakraProvider>
  );
}

export default App;
