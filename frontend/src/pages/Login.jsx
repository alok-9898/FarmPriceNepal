import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, ChevronRight, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[32px] border border-gray-100 shadow-soft p-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Welcome Back</h2>
          <p className="text-dark/40 font-medium">Sign in to your FarmPrice account.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-dark/70 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-medium placeholder:text-dark/20"
                placeholder="ram@nepal.com" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-dark/70 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-medium placeholder:text-dark/20"
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-dark/30 hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full h-14 group" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <p className="mt-8 text-center text-dark/40 font-medium">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
