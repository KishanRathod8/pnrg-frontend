import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const SmsTesting = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    smsType: 'LOAN_DISBURSEMENT',
    message: '',
    recipientName: '',
  });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const smsTypes = [
    { value: 'LOAN_DISBURSEMENT', label: 'Loan Disbursement' },
    { value: 'MEMBER_REGISTRATION', label: 'Member Registration' },
    { value: 'DOCUMENT_VERIFICATION', label: 'Document Verification' },
    { value: 'DUE_EMI', label: 'Due EMI' },
    { value: 'EMI_COLLECTION', label: 'EMI Collection' },
    { value: 'EMI_AGENT_COLLECTION', label: 'EMI Agent Collection' },
    { value: 'OTP', label: 'OTP SMS' },
    { value: 'LOGIN_CREDENTIALS', label: 'Login Credentials' },
    { value: 'SALARY_DISBURSEMENT', label: 'Salary Disbursement' },
    { value: 'SETTLEMENT', label: 'Settlement Alert' },
    { value: 'OVERDUE_REMINDER', label: 'Overdue Reminder' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const payload = {
        mobile: formData.mobile,
        smsType: formData.smsType,
        message: formData.message,
        recipientName: formData.recipientName || 'Customer',
      };

      const res = await api.post('/sms/test', payload);
      setResponse(res.data);
      toast.success('SMS sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send SMS');
      setResponse({
        success: false,
        message: err.response?.data?.message || 'Failed to send SMS',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">SMS Testing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMS Form */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Send Test SMS</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                pattern="\d{10}"
                placeholder="Enter 10-digit mobile number"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">SMS Type *</label>
              <select
                name="smsType"
                value={formData.smsType}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              >
                {smsTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="e.g., John Doe"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Custom Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                placeholder="Leave blank to use default template"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-brand text-white py-2 rounded-lg hover:scale-105 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send SMS'}
            </button>
          </form>
        </div>

        {/* Response Display */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-brand-navy mb-4">Response</h2>
          {response ? (
            <div className={`p-4 rounded-lg ${response.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-lg ${response.success ? 'text-green-600' : 'text-red-600'}`}>
                  {response.success ? '✅' : '❌'}
                </span>
                <span className={`font-semibold ${response.success ? 'text-green-700' : 'text-red-700'}`}>
                  {response.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <p className="text-gray-700 text-sm mb-1"><strong>Message:</strong> {response.message}</p>
              {response.smsId && (
                <p className="text-gray-500 text-xs"><strong>SMS ID:</strong> {response.smsId}</p>
              )}
              {response.errorDetails && (
                <p className="text-red-500 text-sm"><strong>Error:</strong> {response.errorDetails}</p>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📱</div>
              <p>Send a test SMS to see the response here.</p>
            </div>
          )}

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Available SMS Types</h3>
            <div className="flex flex-wrap gap-1">
              {smsTypes.map((type) => (
                <span key={type.value} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs">
                  {type.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmsTesting;