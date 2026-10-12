const KPIGrid = ({ data }) => {
  const { totalDisbursement, totalOutstanding, totalCollection, totalInterest } = data;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold gradient-text">₹{totalDisbursement.toLocaleString()}</p>
        <p className="text-sm text-gray-500">📤 Total Disbursement</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold gradient-text">₹{totalOutstanding.toLocaleString()}</p>
        <p className="text-sm text-gray-500">📌 Total Outstanding</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold gradient-text">₹{totalCollection.toLocaleString()}</p>
        <p className="text-sm text-gray-500">📥 Total Collection</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow text-center">
        <p className="text-2xl font-bold gradient-text">₹{totalInterest.toLocaleString()}</p>
        <p className="text-sm text-gray-500">📈 Total Interest</p>
      </div>
    </div>
  );
};

export default KPIGrid;