import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const ApplyLoan = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    memberId: '',
    productId: '',
    amount: '',
    tenureMonths: '',
    branch: '',
    remarks: '',
  });
  const [members, setMembers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculatedEmi, setCalculatedEmi] = useState(null);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is a customer
        const role = user?.role?.toUpperCase() || 'CUSTOMER';
        setIsCustomer(role === 'CUSTOMER');

        // Fetch products
        const productsRes = await api.get('/products', { params: { size: 100 } });
        setProducts(productsRes.data.content || []);

        if (role === 'CUSTOMER') {
          // For customers: fetch their own member profile
          try {
            const memberRes = await api.get('/customer/profile');
            const member = memberRes.data;
            setMembers([member]);
            setFormData(prev => ({
              ...prev,
              memberId: member.id || '',
            }));
          } catch (err) {
            console.error('Failed to fetch customer profile:', err);
            toast.error('Could not load your profile. Please complete your KYC first.');
          }
        } else {
          // For admin/staff: fetch all members
          const membersRes = await api.get('/members', { params: { size: 100 } });
          setMembers(membersRes.data.content || []);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        toast.error('Failed to load data');
      }
    };
    fetchData();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Recalculate EMI when amount, product, or tenure changes
    if (['amount', 'productId', 'tenureMonths'].includes(name)) {
      const selectedProduct = products.find(p => p.id === parseInt(formData.productId || 0));
      const amount = parseFloat(formData.amount || 0);
      const tenure = parseInt(formData.tenureMonths || 0);
      if (selectedProduct && amount > 0 && tenure > 0) {
        const rate = selectedProduct.interestRate / 12 / 100;
        const emi = amount * rate * Math.pow(1 + rate, tenure) / (Math.pow(1 + rate, tenure) - 1);
        setCalculatedEmi(Math.round(emi * 100) / 100);
      } else {
        setCalculatedEmi(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        tenureMonths: parseInt(formData.tenureMonths),
        appliedBy: user?.code || 'ADMIN',
        branch: formData.branch || 'SHREEJA GROUP',
      };
      await api.post('/loans', payload);
      toast.success('Loan application submitted successfully');
      // Reset form
      setFormData({
        memberId: isCustomer ? formData.memberId : '',
        productId: '',
        amount: '',
        tenureMonths: '',
        branch: '',
        remarks: '',
      });
      setCalculatedEmi(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Apply for Loan</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Member Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {isCustomer ? 'Member (You)' : 'Member *'}
              </label>
              <select
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                disabled={isCustomer}
                className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent ${
                  isCustomer ? 'bg-gray-100' : ''
                }`}
              >
                <option value="">
                  {isCustomer ? members[0]?.name || 'Loading...' : 'Select Member'}
                </option>
                {!isCustomer && members.map(m => (
                  <option key={m.id} value={m.id}>{m.code} - {m.name}</option>
                ))}
              </select>
              {isCustomer && members[0] && (
                <p className="text-xs text-gray-500 mt-1">
                  {members[0].code} - {members[0].name}
                </p>
              )}
            </div>

            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product *</label>
              <select
                name="productId"
                value={formData.productId}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name} ({p.interestRate}%)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
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
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-2">
              {calculatedEmi ? (
                <div>
                  <span className="text-sm text-gray-600">Estimated EMI: </span>
                  <span className="text-lg font-bold text-brand-pink">₹{calculatedEmi.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Enter amount, product, tenure to calculate EMI</span>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="2"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  memberId: isCustomer ? formData.memberId : '',
                  productId: '',
                  amount: '',
                  tenureMonths: '',
                  branch: '',
                  remarks: '',
                });
                setCalculatedEmi(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-brand text-white rounded-lg hover:scale-105 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Apply Loan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;