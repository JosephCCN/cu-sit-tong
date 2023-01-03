import React, { useState } from 'react'


function App() {
  const [count, set_count] = useState(0);
  const add = () => {
    set_count(count + 1);
  }
  return (
    <div>
    <h1>{count}</h1>
    <button onClick={add}>Click</button>
    </div>
  );
}

export default App