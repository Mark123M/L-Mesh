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
import Pine_tree2 from './plants/Pine_tree2'

//import ThreeJs from './plants/old models/ThreeJs';
import Pine3D from './plants/Pine3D';
import Turtle from './plants/Turtle';
import Monopodial from './plants/Monopodial';
import Space3D from './plants/Space3D';
import Ternary from './plants/Ternary';
import Masterpiece from './plants/Masterpiece';
import Bush from './plants/Bush';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeSwitcher justifySelf="flex-end" /> 
      <Flower/>
      {/*<Bush/>*/}
      {/*<Masterpiece/> */}
  
      {/*<Plant3D/> */}
      {/*<Monopodial/>*/}
      {/*<Space3D/> */}
      {/*<Ternary/>   */}
      {/*<Pine3D/> */}
      {/*<Space_tree/> */}
      
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
