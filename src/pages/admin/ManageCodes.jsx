import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiToggleLeft, FiToggleRight, FiRotateCcw } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ManageCodes() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCode, setNewCode] = useState({ code: '', usage_limit: 1 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await api.get('/api/hr/codes.php');
      setCodes(response.data);
    } catch (error) {
      toast.error('Failed to fetch codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCode.code) return;
    try {
      await api.post('/api/hr/codes.php', newCode);
      toast.success('Code created successfully');
      setNewCode({ code: '', usage_limit: 1 });
      setIsAdding(false);
      fetchCodes();
    } catch (error) {
      toast.error('Failed to create code');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch('/api/hr/codes.php', { id, is_active: !currentStatus });
      toast.success('Status updated');
      fetchCodes();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteCode = async (id) => {
    if (!window.confirm('Are you sure you want to delete this code?')) return;
    try {
      await api.delete(`/api/hr/codes.php?id=${id}`);
      toast.success('Code deleted');
      fetchCodes();
    } catch (error) {
      toast.error('Failed to delete code');
    }
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No similar chars O, 0, I, 1
    let result = 'SS-';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCode(prev => ({ ...prev, code: result }));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading Management Tools...</div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Manage Staff Codes</h2>
          <p className="text-slate-500 text-sm">Issue and revoke authorization codes for new staff members.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="btn-primary">
            <FiPlus className="w-4 h-4" /> Generate New Code
          </button>
        )}
      </div>

      {isAdding && (
        <div className="card p-6 border-2 border-primary-500 bg-primary-50/10 animate-fade-in-up">
          <form onSubmit={handleCreate} className="space-y-4">
            <h4 className="font-bold text-slate-900">Issue New Authorization</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label-lg">Code String</label>
                <div className="flex gap-2">
                  <input 
                    className="input flex-1" 
                    placeholder="e.g. SS-DOCTOR-HP" 
                    value={newCode.code} 
                    onChange={e => setNewCode({...newCode, code: e.target.value.toUpperCase()})}
                    required 
                  />
                  <button type="button" onClick={generateRandomCode} className="btn-outline px-3" title="Generate Random">
                    <FiRotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="label-lg">Usage Limit</label>
                <input 
                  type="number" 
                  className="input" 
                  min="1" 
                  value={newCode.usage_limit} 
                  onChange={e => setNewCode({...newCode, usage_limit: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-semibold hover:text-slate-700">Cancel</button>
              <button type="submit" className="btn-primary px-6">Create Code</button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Auth Code</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {codes.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No authorization codes found.</td>
              </tr>
            )}
            {codes.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">{c.code}</span>
                </td>
                <td className="px-6 py-4">
                  {c.is_active ? (
                    <span className="badge-green">Active</span>
                  ) : (
                    <span className="badge-gray">Revoked</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  <span className="font-bold text-slate-900">{c.times_used}</span> / {c.usage_limit}
                </td>
                <td className="px-6 py-4 text-xs text-slate-400">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(c.id, c.is_active)}
                      className={`p-2 rounded-lg transition-colors ${c.is_active ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                      title={c.is_active ? 'Revoke Code' : 'Activate Code'}
                    >
                      {c.is_active ? <FiToggleRight className="w-5 h-5" /> : <FiToggleLeft className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => deleteCode(c.id)}
                      className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete Permanently"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
