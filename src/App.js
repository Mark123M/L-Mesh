import React, {Suspense} from 'react';

import Editor from './Editor';
import store from './services/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading Models...</div>}>
        <Editor/>
      </Suspense>
    </Provider>
  );
}

export default App;
