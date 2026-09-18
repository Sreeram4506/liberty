import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileStickyBar from './components/MobileStickyBar';
import FirearmPolicyNotice from './components/FirearmPolicyNotice';

import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Deals from './pages/Deals';
import Guide from './pages/Guide';
import Services from './pages/Services';
import SellGuns from './pages/SellGuns';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

// Pages where a customer is actually browsing or buying product — the
// firearm pickup/refund policy notice only makes sense here, not on
// informational pages like About or Contact.
const SHOP_SECTION_PATHS = ['/shop', '/cart', '/checkout'];

function AppShell() {
  const location = useLocation();
  const inShopSection = SHOP_SECTION_PATHS.includes(location.pathname) || location.pathname.startsWith('/product/');

  return (
    <>
      <Header />
      {inShopSection && <FirearmPolicyNotice />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sell-your-guns" element={<SellGuns />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <MobileStickyBar />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
