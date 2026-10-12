const StatsCards = ({ data }) => {
  const { totalBalance, bankBalance, cashBalance, smsBalance } = data;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-400">
        <p className="text-sm text-gray-500 uppercase">💰 Total Balance</p>
        <p className="text-2xl font-bold">₹{totalBalance.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-brand-pink">
        <p className="text-sm text-gray-500 uppercase">🏦 Bank Balance</p>
        <p className="text-2xl font-bold">₹{bankBalance.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-brand-orange">
        <p className="text-sm text-gray-500 uppercase">💵 Cash Balance</p>
        <p className="text-2xl font-bold">₹{cashBalance.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow border-l-4 border-brand-purple">
        <p className="text-sm text-gray-500 uppercase">📱 SMS Balance</p>
        <p className="text-2xl font-bold">{smsBalance}</p>
      </div>
    </div>
  );
};

export default StatsCards;