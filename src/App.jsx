import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Shop from './pages/Shop';
import DeckDetail from './pages/DeckDetail';
import HowItWorks from './pages/HowItWorks';
import Brackets from './pages/Brackets';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Success from './pages/Success';
import AnnouncementBar from './components/AnnouncementBar';

function AppInner({ animationsEnabled, setAnimationsEnabled }) {
  const location = useLocation();
  const hideBar = location.pathname === '/admin' || location.pathname === '/success';

  return (
    <div className={`min-h-screen bg-[#0a0e1a] text-white ${hideBar ? '' : 'pb-14'}`}>
      <Nav animationsEnabled={animationsEnabled} setAnimationsEnabled={setAnimationsEnabled} />
      <Routes>
        <Route path="/" element={<Home animationsEnabled={animationsEnabled} />} />
        <Route path="/shop" element={<Shop animationsEnabled={animationsEnabled} />} />
        <Route path="/deck/:id" element={<DeckDetail animationsEnabled={animationsEnabled} />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/brackets" element={<Brackets />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/success" element={<Success />} />
      </Routes>
      {!hideBar && <AnnouncementBar />}
    </div>
  );
}

export default function App() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  return (
    <BrowserRouter>
      <AppInner animationsEnabled={animationsEnabled} setAnimationsEnabled={setAnimationsEnabled} />
    </BrowserRouter>
  );
}
