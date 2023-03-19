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
import Space_tree from './plants/Space_tree'
import Pine_tree2 from './plants/Pine_tree2'

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
      <Pine_tree/>
    { /* <Tree2/>  
      <Pine_tree2/>*/}
   {/*   <Space_tree/> 
      <Tree3D/>
     
      <Flower/>*/}
     {/*  <Tree/>
      <Turtle/>  */}
    </ChakraProvider>
  );
}

export default App;
