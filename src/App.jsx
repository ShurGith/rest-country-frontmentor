import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';
import CountryNxt from './components/CountryNxt';
import CountrySearchList from './components/CountrySearchList';
import CountryLazyList from './components/CountryLazyList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 lg:min-w-[1280px]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<CountryList />} />
            <Route path="/country/:countryName" element={<CountryDetail />} />
            <Route path="*" element={<div className="text-center text-2xl">404 - Page Not Found</div>} />
            <Route path="/nxt" element={<CountryNxt />} />
            <Route path="/search" element={<CountrySearchList />} />
            <Route path="/search/:countryName" element={<CountrySearchList />} />
            <Route path="/nxt/:countryName" element={<CountryNxt />} />
            <Route path="/lazy" element={<CountryLazyList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;