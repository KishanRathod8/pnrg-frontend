import { useState, useEffect } from 'react';
import api from '../services/api';
import MemberList from '../components/Members/MemberList';
import MemberForm from '../components/Members/MemberForm';
import toast from 'react-hot-toast';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const fetchMembers = async (pageNum = 0, searchTerm = '') => {
    setLoading(true);
    try {
      const params = { page: pageNum, size: 10 };
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/members', { params });
      setMembers(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(pageNum);
    } catch (err) {
      toast.error('Failed to load members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(0, search);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (newPage) => {
    fetchMembers(newPage, search);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setShowForm(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`);
        toast.success('Member deleted successfully');
        fetchMembers(page, search);
      } catch (err) {
        toast.error('Failed to delete member');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleFormSave = () => {
    fetchMembers(page, search);
    setShowForm(false);
    setEditingMember(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-brand-navy">Members</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-brand text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
        >
          + Add Member
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, code, or mobile..."
          value={search}
          onChange={handleSearch}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-pink focus:border-transparent"
        />
      </div>

      <MemberList
        members={members}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <MemberForm
          member={editingMember}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
};

export default Members;