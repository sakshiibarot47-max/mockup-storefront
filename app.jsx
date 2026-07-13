import React, { useState, useEffect } from 'react';
import productData from './products.json';

function App() {
  const [products] = useState(productData);
  const [cart, setCart] = useState([]);
  
  // WISHLIST STATE: Loads saved items from localStorage on startup
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('storefront_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  
  // For storing the search text, selected category, and sort order
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'default', 'price-low-high', 'price-high-low'

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('storefront_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart functions
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Wishlist functions
  const toggleWishlist = (product) => {
    const isAlreadyInWishlist = wishlist.some(item => item.id === product.id);
    if (isAlreadyInWishlist) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  // Filter and Sort the products array based on user input
  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      return 0; // default (no sorting)
    });

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      <header style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '25px' }}>
        <h1>🛍️ My Mockup Storefront</h1>
        
        {/* INTERACTIVE SEARCH, FILTER, & SORT BAR */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '250px', fontSize: '15px' }}
          />

          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px', cursor: 'pointer' }}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
          </select>

          {/* NEW SORT DROPDOWN */}
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '15px', cursor: 'pointer' }}
          >
            <option value="default">Sort By: Featured</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
          </select>
        </div>
      </header>

      {/* Main Layout split into Products (Left) and Cart/Wishlist Sidebars (Right) */}
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* LEFT COLUMN: Product Grid */}
        <div style={{ flex: '3', minWidth: '300px' }}>
          <h2>Products ({filteredAndSortedProducts.length})</h2>
          
          {filteredAndSortedProducts.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic', marginTop: '20px' }}>No products found matching your criteria.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
              {filteredAndSortedProducts.map((product) => {
                const isInWishlist = wishlist.some(item => item.id === product.id);
                return (
                  <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#fff', textAlign: 'center', position: 'relative' }}>
                    
                    {/* Heart/Wishlist Button */}
                    <button 
                      onClick={() => toggleWishlist(product)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      {isInWishlist ? '❤️' : '🖤'}
                    </button>

                    <img src={product.image} alt={product.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                    <h3 style={{ fontSize: '16px', margin: '10px 0', height: '40px', overflow: 'hidden' }}>{product.title}</h3>
                    <p style={{ color: '#666', fontWeight: 'bold' }}>${product.price.toFixed(2)}</p>
                    
                    <button 
                      onClick={() => addToCart(product)}
                      style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebars for Cart & Wishlist */}
        <div style={{ flex: '1', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* SHOPPING CART PANEL */}
          <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
            <h2>🛒 Your Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</h2>
            
            {cart.length === 0 ? (
              <p style={{ color: '#888' }}>Your cart is empty.</p>
            ) : (
              <div>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.title}</h4>
                      <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 8px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}

                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '2px solid #333', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                
                <button 
                  onClick={() => alert('Checkout complete! (This is a mockup storefront)')}
                  style={{ backgroundColor: '#28a745', color: 'white', border: 'none', width: '100%', padding: '12px', borderRadius: '4px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>

          {/* NEW WISHLIST PANEL */}
          <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', backgroundColor: '#fff' }}>
            <h2>❤️ Your Wishlist ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <p style={{ color: '#888' }}>No items saved yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {wishlist.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '14px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
                    <button 
                      onClick={() => addToCart(item)}
                      style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      + Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
