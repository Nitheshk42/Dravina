import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import Confirm from './pages/Confirm';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Login />} />
      <Route path = "/signup" element={<Signup />} />
      <Route path = "/dashboard" element={<Dashboard />} />
      <Route path = "/send" element={<SendMoney />} />
      <Route path = "/confirm" element={<Confirm />} />
      <Route path = "/history" element={<History />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
