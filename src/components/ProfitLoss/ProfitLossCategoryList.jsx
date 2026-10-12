const ProfitLossCategoryList = ({ title, categories, total, type }) => {
  const isIncome = type === 'income';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className={`text-lg font-bold mb-3 ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
        {title} ({categories.length})
      </h3>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No {type.toLowerCase()} recorded</p>
      ) : (
        <div className="space-y-2">
          {categories.map((category, idx) => (
            <div key={idx} className="flex justify-between items-center border-b pb-2">
              <div className="flex-1">
                <span className="font-medium">{category.name}</span>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${isIncome ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${category.percentage || 0}%` }}
                  />
                </div>
              </div>
              <div className="text-right ml-4">
                <span className="font-medium">{formatCurrency(category.amount)}</span>
                <span className="text-xs text-gray-400 block">{category.percentage || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between font-bold">
        <span>Total {title}</span>
        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
};

export default ProfitLossCategoryList;