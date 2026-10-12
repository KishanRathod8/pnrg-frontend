import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CustomerApplyLoan = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    amount: '',
    tenureMonths: '',
    branch: '',
  });
  const [calculatedEmi, setCalculatedEmi] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { size: 100 } });
      setProducts(res.data.content || []);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateEMI = () => {
    const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
    if (!selectedProduct) return;
    const amount = parseFloat(formData.amount);
    const tenure = parseInt(formData.tenureMonths);
    if (amount > 0 && tenure > 0) {
      const rate = selectedProduct.interestRate / 12 / 100;
      const emi = amount * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
      setCalculatedEmi(Math.round(emi * 100) / 100);
    } else {
      setCalculatedEmi(null);
    }
  };

  useEffect(() => {
    calculateEMI();
  }, [formData.amount, formData.tenureMonths, formData.productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        tenureMonths: parseInt(formData.tenureMonths),
        memberId: null, // will be filled by backend from authenticated user
        appliedBy: 'CUSTOMER',
      };
      await api.post('/loans', payload);
      toast.success('Loan application submitted successfully');
      navigate('/customer/my-loans');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-brand-navy mb-4">Apply for Loan</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg focus:ring-brand-pink"
            >
              <option value="">Select Product</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-2 border rounded-lg focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenure (Months) *</label>
            <input
              type="number"
              name="tenureMonths"
              value={formData.tenureMonths}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border rounded-lg focus:ring-brand-pink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-brand-pink"
            />
          </div>
          {calculatedEmi !== null && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-600">Estimated EMI: </span>
              <span className="text-lg font-bold text-brand-pink">₹{calculatedEmi.toFixed(2)}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Apply'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerApplyLoan;