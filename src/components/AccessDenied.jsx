const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow p-8 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
      <p className="text-gray-600 max-w-md">
        You do not have permission to view this page. Please contact your administrator if you believe this is an error.
      </p>
    </div>
  );
};

export default AccessDenied;