import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import Confirm from './pages/Confirm';
import History from './pages/History';
import Recipients from './pages/Recipients';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoney />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/history" element={<History />} />
        <Route path="/recipients" element={<Recipients />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
