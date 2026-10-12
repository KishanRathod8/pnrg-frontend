import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <CustomerHeader />
      <div className="flex flex-1">
        <CustomerSidebar />
        <main className="flex-1 p-4 md:p-6 bg-gray-100 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomerLayout;