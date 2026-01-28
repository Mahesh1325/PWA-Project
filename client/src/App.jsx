
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import DeleteProduct from "./pages/DeleteProduct";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/add">Add</Link>
        <Link to="/products">Products</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/products" element={<Products />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/delete/:id" element={<DeleteProduct />} />
      </Routes>
    </BrowserRouter>
  );
}
















// import { useEffect, useState } from 'react';
// import logo from './logo.svg';
// import './App.css';



// function App() {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/data')
//       .then(res => res.json())
//       .then(json => setData(json));
//   }, []);

//   return (
//     <div>
//       <h1>Backend Data:</h1>
//       {data ? (
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default App;