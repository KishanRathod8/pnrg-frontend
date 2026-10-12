const RecentMembers = ({ members }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5 overflow-x-auto">
      <h4 className="font-bold text-brand-navy mb-4">👤 Recent Members</h4>
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="py-2 text-left">SR. NO.</th>
            <th className="py-2 text-left">CUST NAME</th>
            <th className="py-2 text-left">CUST CODE</th>
            <th className="py-2 text-left">MOBILE</th>
            <th className="py-2 text-left">ADDRESS</th>
          </tr>
        </thead>
        <tbody>
          {members?.map((m, i) => (
            <tr key={m.id || i} className="border-b last:border-0">
              <td className="py-2">{i + 1}</td>
              <td className="font-medium">{m.name}</td>
              <td className="text-brand-navy font-semibold">{m.code}</td>
              <td>{m.mobile}</td>
              <td>{m.address || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right text-xs text-gray-400 mt-2">
        Showing 1 to {members?.length || 0} of 375 entries
      </div>
    </div>
  );
};

export default RecentMembers;