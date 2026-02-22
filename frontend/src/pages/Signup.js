import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
     const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    if( password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600">Crobo</h1>
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"/>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"/>
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"/>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"/>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200">
          Create Account
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-600 font-medium cursor-pointer hover:underline">
            Login
          </span>
        </p>

    </div>
    </div>
  );
}

export default Signup;