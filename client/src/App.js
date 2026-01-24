import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [data,setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(res => res.json())
      .then(json => setData(json));
  }, []);

  return(
  <>
  <h1>Backend Data: </h1>
  {data? (
    <prev>{JSON.stringify(data, null, 2)}</prev>
  ) : (
    <p>Loading......</p>
  )
  }
  </>
)
}



export default App;
