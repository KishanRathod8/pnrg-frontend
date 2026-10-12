const ProfitLossSummary = ({ data }) => {
  const { totalIncome, totalExpense, netProfit, startDate, endDate, branch } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Total Income</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
        </div>
        <div className={`bg-white p-4 rounded-xl shadow border-l-4 ${netProfit >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <p className="text-sm text-gray-500">Net Profit</p>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netProfit)}
            {netProfit >= 0 ? ' 📈' : ' 📉'}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-500 mb-4 flex flex-wrap gap-4">
        <span><strong>Period:</strong> {startDate} to {endDate}</span>
        {branch && <span><strong>Branch:</strong> {branch}</span>}
        <span><strong>Total Transactions:</strong> {data.incomeCategories.length + data.expenseCategories.length} categories</span>
      </div>
    </>
  );
};

export default ProfitLossSummary;