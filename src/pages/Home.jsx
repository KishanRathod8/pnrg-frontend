import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// ─── EMI Calculator Modal ────────────────────────────────────
const EMICalculatorModal = ({ onClose }) => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenureMonths, setTenureMonths] = useState(12);

  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 12 / 100;
    const months = tenureMonths;

    if (monthlyRate === 0) {
      return { emi: principal / months, totalInterest: 0, totalPayment: principal };
    }

    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    return { emi, totalInterest, totalPayment };
  };

  const result = calculateEMI();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-brand-navy">EMI Calculator</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Loan Amount (₹)</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interest Rate (% p.a.)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenure (Months)</label>
            <input
              type="number"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly EMI</span>
              <span className="font-bold text-brand-pink">{formatCurrency(result.emi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Interest</span>
              <span className="font-bold text-brand-navy">{formatCurrency(result.totalInterest)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total Payment</span>
              <span className="font-bold text-brand-navy">{formatCurrency(result.totalPayment)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Home Component ──────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showEMICalculator, setShowEMICalculator] = useState(false);

  // ─── Redirect logged‑in users to their dashboard ──────────
  useEffect(() => {
    if (user) {
      const role = (user?.role || 'CUSTOMER').toUpperCase();
      const roleMap = {
        ADMIN: '/admin/dashboard',
        MANAGER: '/manager/dashboard',
        FIELD_OFFICER: '/field-officer/dashboard',
        STAFF: '/staff/dashboard',
        CUSTOMER: '/customer/dashboard',
      };
      navigate(roleMap[role] || '/customer/dashboard');
    }
  }, [user, navigate]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyNow = () => {
    if (user) {
      navigate('/loan/apply');
    } else {
      navigate('/register');
    }
  };

  // ─── If user is logged in, we already redirect via useEffect ──
  // But to avoid flash, we can render nothing while redirecting.
  if (user) {
    return null; // will be redirected
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="PNRG Finance"
                  className="h-10 w-auto"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40?text=PNRG'; }}
                />
                <span className="ml-2 text-xl font-bold text-brand-navy">PNRG <span className="text-brand-pink">FINANCE</span></span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-brand-pink transition">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-brand-pink transition">About</button>
              <button onClick={() => scrollToSection('products')} className="text-gray-600 hover:text-brand-pink transition">Products</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-brand-pink transition">Contact</button>
            </nav>
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-brand-pink border border-brand-pink rounded-lg hover:bg-brand-pink hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section id="home" className="relative bg-gradient-brand text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to PNRG Finance
              </h1>
              <p className="text-xl mb-6 opacity-90">
                Get instant loans with minimal documentation and quick approval
              </p>
              <p className="text-lg mb-8 opacity-80">
                Simple, Fast, and Secure loan processing system
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-brand-pink font-semibold rounded-lg hover:scale-105 transition shadow-lg"
                >
                  Register Now
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-pink transition"
                >
                  Login
                </Link>
                <button
                  onClick={() => setShowEMICalculator(true)}
                  className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-pink transition"
                >
                  EMI Calculator
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-semibold mb-4">Quick Loan Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <span>Quick Approval within 24 hours</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">🔒</span>
                    <span>Bank-level security</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <span>Flexible EMI options</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-2xl">📄</span>
                    <span>Minimal documentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Products ───────────────────────────────────────────── */}
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy">Our Loan Products</h2>
            <p className="text-gray-500 mt-2">Choose from our flexible loan options tailored to your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">🏢</div>
              <h3 className="text-xl font-bold text-brand-navy">Business Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Grow your business with flexible financing options</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹9,000 – ₹10,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>3 – 36 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
            {/* Education Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-xl font-bold text-brand-navy">Education Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Invest in your future with education loans</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹9,000 – ₹10,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>12 – 120 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
            {/* Group Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold text-brand-navy">Group Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Community-based loan for self-help groups</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹25,000 – ₹10,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>12 – 48 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
            {/* Home Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-xl font-bold text-brand-navy">Home Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Buy your dream home with attractive interest rates</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹5,00,000 – ₹1,00,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>60 – 360 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
            {/* Personal Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="text-xl font-bold text-brand-navy">Personal Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Quick personal loan for salaried individuals</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹10,000 – ₹5,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>6 – 60 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
            {/* Vehicle Loan */}
            <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition border border-gray-100">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="text-xl font-bold text-brand-navy">Vehicle Loan</h3>
              <p className="text-gray-500 text-sm mb-3">Finance your dream vehicle with easy EMIs</p>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Amount:</span> <strong>₹50,000 – ₹25,00,000</strong></p>
                <p><span className="text-gray-500">Tenure:</span> <strong>12 – 84 months</strong></p>
              </div>
              <button
                onClick={handleApplyNow}
                className="mt-4 w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ───────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy">Why Choose Us</h2>
            <p className="text-gray-500 mt-2">Your trusted partner for financial solutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-pink mb-2">5000+</div>
              <p className="text-gray-600">Active Clients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-pink mb-2">₹250Cr+</div>
              <p className="text-gray-600">Loan Portfolio</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-pink mb-2">50+</div>
              <p className="text-gray-600">Expert Team</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-brand-pink mb-2">15+</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-brand-navy">Quick Approval</h4>
              <p className="text-sm text-gray-500">Get your loan approved within 24-48 hours</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h4 className="font-bold text-brand-navy">Secure Process</h4>
              <p className="text-sm text-gray-500">Bank-level security for all transactions</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow text-center">
              <div className="text-3xl mb-2">📊</div>
              <h4 className="font-bold text-brand-navy">Flexible EMI</h4>
              <p className="text-sm text-gray-500">Choose EMI plans that suit your budget</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy">What Our Clients Say</h2>
            <p className="text-gray-500 mt-2">Real experiences from satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">"The loan approval process was incredibly smooth and fast. I got my home loan approved within 48 hours. Highly recommended!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold">RS</div>
                <div>
                  <p className="font-semibold">Rajesh Sharma</p>
                  <p className="text-sm text-gray-500">Home Loan Customer</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">"Excellent customer service and flexible EMI options. The team helped me choose the best plan for my business loan."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold">PK</div>
                <div>
                  <p className="font-semibold">Priya Kumar</p>
                  <p className="text-sm text-gray-500">Business Loan Customer</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">"Great rates and transparent terms. The online payment system makes EMI payments very convenient. Very satisfied!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-pink rounded-full flex items-center justify-center text-white font-bold">AG</div>
                <div>
                  <p className="font-semibold">Amit Gupta</p>
                  <p className="text-sm text-gray-500">Vehicle Loan Customer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Section ──────────────────────────────────────── */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">About PNRG Finance</h2>
              <p className="text-gray-600 mb-4">
                Your trusted partner in achieving financial goals with transparent, accessible, and customer-centric loan solutions.
              </p>
              <p className="text-gray-600 mb-6">
                We are a leading financial services provider committed to offering hassle-free loan solutions to individuals and businesses across India. With years of experience and thousands of satisfied customers, we make your financial dreams a reality.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-brand-navy">Our Mission</h4>
                  <p className="text-sm text-gray-500">To provide accessible, transparent, and customer-centric financial services.</p>
                </div>
                <div>
                  <h4 className="font-bold text-brand-navy">Our Vision</h4>
                  <p className="text-sm text-gray-500">To become India's most trusted financial services partner.</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow">
              <h3 className="text-xl font-bold text-brand-navy mb-4">Our Core Values</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h4 className="font-semibold">Trust</h4>
                    <p className="text-sm text-gray-500">Building lasting relationships through honesty and reliability</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <h4 className="font-semibold">Customer First</h4>
                    <p className="text-sm text-gray-500">Putting customer needs at the heart of everything we do</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="font-semibold">Innovation</h4>
                    <p className="text-sm text-gray-500">Continuously improving our services with modern technology</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⭐</span>
                  <div>
                    <h4 className="font-semibold">Excellence</h4>
                    <p className="text-sm text-gray-500">Maintaining the highest standards in service delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Apply for a loan today and get instant approval with competitive interest rates
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-brand-pink font-semibold rounded-lg hover:scale-105 transition shadow-lg"
            >
              Apply Now
            </Link>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-pink transition"
            >
              Contact Us
            </button>
            <button
              onClick={() => setShowEMICalculator(true)}
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-brand-pink transition"
            >
              EMI Calculator
            </button>
          </div>
        </div>
      </section>

      {/* ─── Contact Section ────────────────────────────────────── */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-navy">Contact Us</h2>
            <p className="text-gray-500 mt-2">Have questions? We're here to help.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">📧</div>
              <h4 className="font-bold text-brand-navy">Email Us</h4>
              <p className="text-gray-500">contact@pnrg.in</p>
              <p className="text-sm text-gray-400">We reply within 24 hours</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">📍</div>
              <h4 className="font-bold text-brand-navy">Visit Us</h4>
              <p className="text-gray-500">Bhagwanpur Kamla Andaha</p>
              <p className="text-sm text-gray-400">Satanpur, Samastipur, Bihar - 848132</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="text-3xl mb-2">🕐</div>
              <h4 className="font-bold text-brand-navy">Working Hours</h4>
              <p className="text-gray-500">Mon - Sat: 9AM - 6PM</p>
              <p className="text-sm text-gray-400">Sunday Closed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-brand-navy text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3">PNRG FINANCE</h3>
              <p className="text-sm opacity-80">
                Your trusted partner for quick and secure loan solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-1 text-sm opacity-80">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-brand-pink transition">Home</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-brand-pink transition">About Us</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-brand-pink transition">Contact</button></li>
                <li><Link to="/login" className="hover:text-brand-pink transition">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Loan Products</h4>
              <ul className="space-y-1 text-sm opacity-80">
                <li>Personal Loan</li>
                <li>Business Loan</li>
                <li>Home Loan</li>
                <li>Education Loan</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-1 text-sm opacity-80">
                <li>contact@pnrg.in</li>
                <li>Bhagwanpur Kamla Andaha</li>
                <li>Satanpur, Samastipur</li>
                <li>Bihar - 848132</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 text-center text-sm opacity-70">
            © 2026 Loan Management System. All rights reserved. | Privacy Policy | Terms & Conditions
          </div>
        </div>
      </footer>

      {/* ─── EMI Calculator Modal ──────────────────────────────── */}
      {showEMICalculator && (
        <EMICalculatorModal onClose={() => setShowEMICalculator(false)} />
      )}
    </div>
  );
};

export default Home;