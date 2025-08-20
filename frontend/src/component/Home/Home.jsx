import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Home.css';



const Home = () => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredItem, setHoveredItem] = useState(null);
  const navigate = useNavigate();
  // ... (keep all your existing state)

  const categories = [
    { id: 'all', name: 'All', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' },
    { id: 'pizza', name: 'Pizza', image: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg' },
    { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop' },
    { id: 'pasta', name: 'Pasta', image: 'https://images.pexels.com/photos/6287338/pexels-photo-6287338.jpeg' },
    { id: 'salads', name: 'Salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=150&h=150&fit=crop' },
    { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop' },
    { id: 'drinks', name: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=150&h=150&fit=crop' },
    { id: 'rice-curry', name: 'Rice & Curry', image: 'https://images.pexels.com/photos/7353379/pexels-photo-7353379.jpeg' },
    { id: 'noodle', name: 'Noodles & Ramen', image: 'https://images.pexels.com/photos/31302296/pexels-photo-31302296.jpeg' },
    { id: 'seafood', name: 'Seafood', image: 'https://images.pexels.com/photos/566345/pexels-photo-566345.jpeg' },
    { id: 'chicken', name: 'Chicken Dishes ', image: 'https://images.pexels.com/photos/5718025/pexels-photo-5718025.jpeg' },
    { id: 'kottu', name: ' Kottu', image: 'https://www.andy-cooks.com/cdn/shop/articles/20240522004316-andy-20cooks-20-20kottu-20roti-20recipe.jpg?v=1716937898' }
  ];

  const foodItems = {
    all: [
      { id: 1, name: 'Margherita Pizza', image: 'https://images.pexels.com/photos/33316978/pexels-photo-33316978.jpeg', price: '1500.00LKR', category: 'pizza' },
      { id: 2, name: 'Beef Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', price: '1200.00LKR', category: 'burgers' },
      { id: 3, name: 'Creamy Pasta', image: 'https://images.pexels.com/photos/33323283/pexels-photo-33323283.jpeg', price: '1350.00LKR', category: 'pasta' },
      { id: 4, name: 'Fresh Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', price: '950.00LKR', category: 'salads' },
      { id: 5, name: 'Chocolate Cake', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', price: '800.00LKR', category: 'desserts' },
      { id: 6, name: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop', price: '450.00LKR', category: 'drinks' }
    ],
    pizza: [
      { id: 1, name: 'Margherita Pizza', image: 'https://images.pexels.com/photos/33316978/pexels-photo-33316978.jpeg', price: '1500.00LKR', category: 'pizza' },
      { id: 7, name: 'Pepperoni Pizza', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop', price: '1750.00LKR', category: 'pizza' },
      { id: 8, name: 'Vegetarian Pizza', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop', price: '1600.00LKR', category: 'pizza' }
    ],
    burgers: [
      { id: 2, name: 'Beef Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop', price: '1200.00LKR', category: 'burgers' },
      { id: 9, name: 'Chicken Burger', image: 'https://images.pexels.com/photos/918581/pexels-photo-918581.jpeg', price: '1100.00LKR', category: 'burgers' },
      { id: 10, name: 'Veggie Burger', image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=300&h=200&fit=crop', price: '950.00LKR', category: 'burgers' }
    ],
    pasta: [
      { id: 3, name: 'Creamy Pasta', image: 'https://images.unsplash.com/photo-1551892374-ecf8129d1474?w=300&h=200&fit=crop', price: '1350.00LKR', category: 'pasta' },
      { id: 11, name: 'Spaghetti Bolognese', image: 'https://images.unsplash.com/photo-1563379091339-03246963d49f?w=300&h=200&fit=crop', price: '1400.00LKR', category: 'pasta' },
      { id: 12, name: 'Penne Arrabbiata', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop', price: '1300.00LKR', category: 'pasta' }
    ],
    salads: [
      { id: 4, name: 'Fresh Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', price: '950.00LKR', category: 'salads' },
      { id: 13, name: 'Caesar Salad', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop', price: '1050.00LKR', category: 'salads' },
      { id: 14, name: 'Greek Salad', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop', price: '1100.00LKR', category: 'salads' }
    ],
    desserts: [
      { id: 5, name: 'Chocolate Cake', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop', price: '800.00LKR', category: 'desserts' },
      { id: 15, name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', price: '350.00LKR', category: 'desserts' },
      { id: 16, name: 'Cheesecake', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=300&h=200&fit=crop', price: '900.00LKR', category: 'desserts' }
    ],
    drinks: [
      { id: 6, name: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop', price: '450.00LKR', category: 'drinks' },
      { id: 17, name: 'Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop', price: '350.00LKR', category: 'drinks' },
      { id: 18, name: 'Smoothie', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&h=200&fit=crop', price: '650.00LKR', category: 'drinks' }
    ],
    noodle: [
      { id: 6, name: 'Fresh Juice', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop', price: '450.00LKR', category: 'drinks' },
      { id: 17, name: 'Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop', price: '350.00LKR', category: 'drinks' },
      { id: 18, name: 'Smoothie', image: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=300&h=200&fit=crop', price: '650.00LKR', category: 'drinks' }
    ]
  };
   const foodImages = [
    'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop'
  ];

  

  const handleOrderClick = (item) => {
    // Navigate to order page with item data
    navigate('/order', { state: { item } });
    const userId = localStorage.getItem('userId');
      if (userId) {
      // User logged in — redirect to order page with item info (optional: pass state)
      navigate('/order', { state: { item } });
    } else {
      // Not logged in — redirect to signup
      navigate('/signup', { state: { message: 'First you have to logged in' } });
    }


  };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [foodImages.length]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handlePhotoSelect = (image) => {
    setSelectedPhoto(image);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedPhoto(null);
  };

  const getCurrentFoodItems = () => {
    return foodItems[selectedCategory] || foodItems.all;
  };
  // ... (keep all your existing useEffect hooks and other functions)

  return (
  <div className="home-container">
    <Navbar 
      isScrolled={isScrolled} 
      activeNav={activeNav} 
      toggleMobileMenu={toggleMobileMenu} 
      isMobileMenuOpen={isMobileMenuOpen} 
    />

    {/* Header Section */}
    <header className="home-header">
      <div 
        className="header-background" 
        style={{ 
          backgroundImage: `url(${foodImages[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="header-content">
        <h1>Welcome to Tasty Hub</h1>
        <p>
          Discover amazing recipes and delicious food from around the world. 
          Join our community of food lovers!
        </p>
        <Link to="/signup" className="cta-button">
          Get Started
        </Link>
      </div>
    </header>

    {/* Categories Section */}
    <section className="categories-section">
      <div className="section-header">
        <h2>Food Categories</h2>
        <p>Explore our diverse range of delicious food categories</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`category-card ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>

    {/* Food Items Section */}
    <section className="food-items-section">
      <div className="food-items-grid">
        {getCurrentFoodItems().map((item) => (
          <div
            key={item.id}
            className={`food-item-card ${selectedPhoto === item.image ? 'active' : ''}`}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <img 
              src={item.image} 
              alt={item.name} 
              onClick={() => handlePhotoSelect(item.image)}
            />
            <div className="food-item-info">
              <h3>{item.name}</h3>
              <p>{item.price}</p>
              {hoveredItem === item.id && (
                <button 
                  className="order-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOrderClick(item);
                  }}
                >
                  Order Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Selected Photo Modal */}
    {selectedPhoto && (
      <div 
        className="photo-modal"
        onClick={() => setSelectedPhoto(null)}
      >
        <img src={selectedPhoto} alt="Selected food" />
      </div>
    )}

    <Footer />
  </div>
);
};

export default Home;