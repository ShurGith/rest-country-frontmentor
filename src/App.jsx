import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CountryList from './components/CountryList';
import CountryDetail from './components/CountryDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<CountryList />} />
            <Route path="/country/:countryName" element={<CountryDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;