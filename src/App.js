import React, {Suspense} from 'react';

import Editor from './Editor';

function App() {
  return (
    <Suspense fallback={<div>Loading Models...</div>}>
      <Editor/>
    </Suspense>
  );
}

export default App;
