import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="form-card">
        <center>
        <h1 className="page-title">Product Management</h1>
        </center>
      </div>

      <div className="home-grid">
        <div className="form-card home-tile tile-add" onClick={() => navigate('/addproduct')}>
          <h2>Add Product</h2>
          <p className="muted">Create a new product with details such as price, brand and image.</p>
        </div>

        <div className="form-card home-tile tile-edit" onClick={() => navigate('/manage')}>
          <h2>Edit / Delete</h2>
          <p className="muted">Search products and open the editor or delete items directly.</p>
        </div>

        <div className="form-card home-tile tile-view" onClick={() => navigate('/products')}>
          <h2>View Products</h2>
          <p className="muted">Browse product cards and click to view full description.</p>
        </div>

        <div className="form-card home-tile tile-search" onClick={() => navigate('/search')}>
          <h2>Search</h2>
          <p className="muted">Quick search across name, brand and category.</p>
        </div>
      </div>
    </div>
  );
}

