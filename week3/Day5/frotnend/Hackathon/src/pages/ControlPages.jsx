"use client";

import { useState } from "react";
import CollectionsPage from "./CollectionsPage";
import ProductDetailPage from "./ProductDetailPage";
import ShoppingBagPage from "./ShoppingBagPage";
import TeaLandingPage from "./TeaLandingPage";

export default function ControlPage() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }
    setShowCartSidebar(true);
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setCartItems(cartItems.filter((item) => item.id !== productId));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const navigateToProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage("product");
  };

  const navigateToBag = () => {
    setCurrentPage("bag");
    setShowCartSidebar(false);
  };

  const navigateToCollections = () => {
    setCurrentPage("collections");
    setShowCartSidebar(false);
  };

  const navigateToLanding = () => {
    setCurrentPage("landing");
    setShowCartSidebar(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage === "landing" && (
        <TeaLandingPage
          onExploreClick={navigateToCollections}
          cartItems={cartItems}
          onCartClick={navigateToBag}
        />
      )}

      {currentPage === "collections" && (
        <CollectionsPage
          onProductClick={navigateToProduct}
          cartItems={cartItems}
          onCartClick={navigateToBag}
          onHomeClick={navigateToLanding}
        />
      )}

      {currentPage === "product" && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onAddToCart={addToCart}
          onBackToCollections={navigateToCollections}
          onHomeClick={navigateToLanding}
          cartItems={cartItems}
          showCartSidebar={showCartSidebar}
          onCartSidebarClose={() => setShowCartSidebar(false)}
          onViewBag={navigateToBag}
          updateCartQuantity={updateCartQuantity}
        />
      )}

      {currentPage === "bag" && (
        <ShoppingBagPage
          cartItems={cartItems}
          updateCartQuantity={updateCartQuantity}
          onContinueShopping={navigateToCollections}
          onHomeClick={navigateToLanding}
        />
      )}
    </div>
  );
}
