import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Product Management PWA</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1rem"
      }}>
        <button onClick={() => navigate("/addproduct")}>Add Product</button>
        <button onClick={() => navigate("/products")}>View Products</button>
        {/* <button onClick={() => navigate("/editproduct")}>Edit Product</button>
        <button onClick={() => navigate("/delete/1")}>Delete Product</button> */}
        <button onClick={() => navigate('/search')}>Search Products</button>      
      </div>
    </div>
  );
}

