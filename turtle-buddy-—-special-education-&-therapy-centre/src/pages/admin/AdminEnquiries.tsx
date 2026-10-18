import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  Search,
  Download,
  Filter,
  Eye,
  Trash2,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  Save,
} from 'lucide-react';
import { EnquiryRecord, EnquiryStatus } from '../../types';

export const AdminEnquiries: React.FC = () => {
  const { adminToken } = useApp();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryRecord | null>(null);

  // Modal edit state
  const [editStatus, setEditStatus] = useState<EnquiryStatus>('New');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [adminToken]);

  const openDetails = (enq: EnquiryRecord) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setAdminNotes(enq.adminNotes || '');
    setStatusMsg(null);
  };

  const handleUpdateStatusAndNotes = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: editStatus,
          adminNotes,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedEnquiry(updated);
        setStatusMsg('Enquiry status and clinical notes updated.');
        await fetchEnquiries();
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to update enquiry.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from ${name}?`)) return;
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      await fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCsv = () => {
    window.location.href = `/api/admin/enquiries/export.csv`;
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      (e.parentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.phone || '').includes(searchQuery) ||
      (e.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.serviceOfInterest || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout activeTab="enquiries">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Enquiries & Enrolments CRM</h1>
            <p className="text-xs text-slate-500">
              Review intake submissions, update clinical triage status, and maintain notes.
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by parent name, child name, phone, or therapy..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['All', 'New', 'Contacted', 'Scheduled', 'Completed', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Parent & Child</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((enq) => (
                <tr
                  key={enq.id}
                  onClick={() => openDetails(enq)}
                  className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{enq.parentName}</div>
                    <div className="text-[11px] text-slate-500">
                      Child: {enq.childName || 'N/A'} ({enq.childAge})
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{enq.phone}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{enq.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700 max-w-[160px] truncate">
                    {enq.serviceOfInterest}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        enq.status === 'New'
                          ? 'bg-amber-100 text-amber-800'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : enq.status === 'Scheduled'
                          ? 'bg-purple-100 text-purple-800'
                          : enq.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono tabular-nums">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openDetails(enq)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(enq.id, enq.parentName)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No enquiries found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Detailed Modal */}
        {selectedEnquiry && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setSelectedEnquiry(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full font-mono">
                    ID: {selectedEnquiry.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    Enquiry from {selectedEnquiry.parentName}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Submitted: {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {statusMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {statusMsg}
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 font-semibold block">Phone Number</span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-sky-700 hover:underline">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Email Address</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="font-bold text-sky-700 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Child Details</span>
                  <span className="font-bold text-slate-800">
                    {selectedEnquiry.childName || 'Child'} (Age: {selectedEnquiry.childAge})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">Service of Interest</span>
                  <span className="font-bold text-slate-800">{selectedEnquiry.serviceOfInterest}</span>
                </div>
              </div>

              {/* Message from parent */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">Parent Message / Child Background:</h4>
                <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
                  {selectedEnquiry.message || 'No additional message was included in this request.'}
                </div>
              </div>

              {/* Status & Clinical Notes */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Update Case Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as EnquiryStatus)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Appointment Date
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedEnquiry.preferredDate || 'Not specified'}
                      className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-100 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Internal Clinical Triage Notes
                  </label>
                  <textarea
                    rows={3}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Enter phone notes, therapist assignment, or intake comments..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleUpdateStatusAndNotes}
                    disabled={updating}
                    className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5"
                    style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{updating ? 'Saving...' : 'Update Status & Notes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
