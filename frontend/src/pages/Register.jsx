import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(formData);
      setIsRegistered(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          errorMessage = err.response.data.detail;
        } else if (Array.isArray(err.response.data.detail)) {
          errorMessage = err.response.data.detail.map(e => e.msg).join(', ');
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'farmer', label: 'Farmer', icon: '🌾' },
    { id: 'trader', label: 'Trader', icon: '🏪' },
    { id: 'consumer', label: 'Consumer', icon: '🛒' },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 p-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[32px] border border-gray-100 shadow-soft p-12"
      >
        {isRegistered ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-emerald-100 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-4">Registration Successful!</h2>
            <p className="text-dark/60 font-medium mb-6">
              Your account has been successfully created.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Redirecting you to the login page...
            </div>
          </motion.div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-dark tracking-tight mb-2">Join FarmPriceNepal</h2>
              <p className="text-dark/40 font-medium">Start predicting market trends today.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-medium border border-red-100 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-dark/70 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-medium placeholder:text-dark/20"
                    placeholder="Ram Bahadur" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-dark/70 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-medium placeholder:text-dark/20"
                    placeholder="Minimum 6 characters" 
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

              <div className="space-y-4 pt-2">
                <label className="text-sm font-bold text-dark/70 ml-1">Select your role</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setFormData({...formData, role: role.id})}
                      className={`
                        relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2
                        ${formData.role === role.id 
                          ? 'bg-emerald-50 border-emerald-200 text-primary shadow-sm' 
                          : 'bg-white border-gray-100 text-dark/40 hover:border-emerald-100 hover:text-dark/60'}
                      `}
                    >
                      <span className="text-2xl">{role.icon}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{role.label}</span>
                      {formData.role === role.id && (
                        <motion.div layoutId="check" className="absolute top-2 right-2 bg-primary rounded-full p-0.5 text-white">
                          <Check className="w-3 h-3" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-14 group" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
              </Button>
            </form>

            <p className="mt-8 text-center text-dark/40 font-medium">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Register;
