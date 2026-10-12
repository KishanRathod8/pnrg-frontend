const Widgets = ({ data }) => {
  const { profitLoss, settlement, loanRecord } = data;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="font-bold text-brand-navy">📊 Profit &amp; Loss</h4>
          <div className="flex justify-between py-2 border-b">
            <span>💰 Total Income</span>
            <span className="text-green-600">₹{profitLoss.income.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>📉 Total Expense</span>
            <span className="text-red-500">₹{profitLoss.expense.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>📈 Net Profit</span>
            <span className="text-green-600">₹{profitLoss.net.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="font-bold text-brand-navy">📋 Settlement Record</h4>
          <div className="flex justify-between py-2 border-b">
            <span>⏳ Due Amount</span>
            <span className="text-red-500">₹{settlement.due.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>✅ Paid Amount</span>
            <span className="text-green-600">₹{settlement.paid.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-xl shadow">
          <h4 className="font-bold text-brand-navy">📂 Loan Record</h4>
          <div className="flex justify-between py-2 border-b">
            <span>🟢 Active Loans</span>
            <span className="bg-gradient-brand px-3 py-0.5 rounded-full text-white font-bold text-sm">{loanRecord.active}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>✅ Complete Loans</span>
            <span className="bg-gradient-brand px-3 py-0.5 rounded-full text-white font-bold text-sm">{loanRecord.complete}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>⚖️ Settled Loans</span>
            <span className="bg-gradient-brand px-3 py-0.5 rounded-full text-white font-bold text-sm">{loanRecord.settled}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>📌 Principal Outstanding</span>
            <span className="font-bold">₹{loanRecord.principalOutstanding.toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow flex justify-around text-center">
          <div>
            <span className="text-sm text-gray-500">📅 Today</span>
            <br />
            <span className="font-bold">₹4,230</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">📅 Weekly</span>
            <br />
            <span className="font-bold">₹4,230</span>
          </div>
          <div>
            <span className="text-sm text-gray-500">📅 Monthly</span>
            <br />
            <span className="font-bold">₹4,230</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widgets;