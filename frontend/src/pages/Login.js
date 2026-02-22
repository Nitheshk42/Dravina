import { use, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        console.log('Email:', email);
        console.log('Password:', password);
    };

  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Crobo</h1>
          <p className="text-gray-500 mt-2">Send money across the world</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        {/* Signup Link */}
        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
        </div>
        </div>
  );
        }

export default Login;