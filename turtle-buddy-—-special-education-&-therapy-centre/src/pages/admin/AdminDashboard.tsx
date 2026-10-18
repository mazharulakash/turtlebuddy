import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import {
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { EnquiryRecord, AdminActivity } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { adminToken, services, blogs, navigateTo } = useApp();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [enqRes, actRes] = await Promise.all([
          fetch('/api/admin/enquiries', {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
          fetch('/api/admin/activities', {
            headers: { Authorization: `Bearer ${adminToken}` },
          }),
        ]);

        if (enqRes.ok) {
          const enqData = await enqRes.json();
          setEnquiries(enqData);
        }
        if (actRes.ok) {
          const actData = await actRes.json();
          setActivities(actData);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, [adminToken]);

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const scheduledCount = enquiries.filter((e) => e.status === 'Scheduled').length;
  const publishedServicesCount = services.filter((s) => s.published).length;
  const publishedBlogsCount = blogs.filter((b) => b.published).length;

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Centre Executive Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Welcome back. Real-time overview of Turtle Buddy enquiries, clinical services, and site activity.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('/admin/enquiries')}
              className="px-3.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs"
              style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
            >
              View New Enquiries ({newEnquiriesCount})
            </button>
            <button
              onClick={() => navigateTo('/admin/content')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
            >
              Edit Homepage
            </button>
          </div>
        </div>

        {/* 4 Stat Cards with Tabular Real Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enquiries</span>
              <ClipboardList className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {enquiries.length}
            </div>
            <p className="text-[11px] text-slate-500">All-time received intake requests</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-700">
              <span className="text-xs font-bold uppercase tracking-wider">New Action Items</span>
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
              {newEnquiriesCount}
            </div>
            <p className="text-[11px] text-amber-800">Awaiting clinical callback</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Published Services</span>
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {publishedServicesCount}
            </div>
            <p className="text-[11px] text-slate-500">Active therapy programs online</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Blog Articles</span>
              <BookOpen className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {publishedBlogsCount}
            </div>
            <p className="text-[11px] text-slate-500">Parent education guides published</p>
          </div>
        </div>

        {/* 2-Column Grid: Recent Enquiries + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Enquiries Table */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recent Enquiries & Intakes</h3>
                <p className="text-xs text-slate-500">Submitted directly via the website forms</p>
              </div>
              <button
                onClick={() => navigateTo('/admin/enquiries')}
                className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
              >
                <span>View All ({enquiries.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-2.5">Parent / Child</th>
                    <th className="pb-2.5">Service</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr
                      key={enq.id}
                      onClick={() => navigateTo('/admin/enquiries')}
                      className="hover:bg-slate-50 cursor-pointer"
                    >
                      <td className="py-3 pr-2">
                        <div className="font-bold text-slate-900">{enq.parentName}</div>
                        <div className="text-[11px] text-slate-500">
                          {enq.childName ? `${enq.childName} (${enq.childAge})` : enq.childAge}
                        </div>
                      </td>
                      <td className="py-3 pr-2 text-slate-600 max-w-[150px] truncate">
                        {enq.serviceOfInterest}
                      </td>
                      <td className="py-3 pr-2">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            enq.status === 'New'
                              ? 'bg-amber-100 text-amber-800'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-800'
                              : enq.status === 'Scheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400 font-mono tabular-nums">
                        {new Date(enq.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-slate-400">
                        No enquiries submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Administrative Activity</h3>
                <p className="text-xs text-slate-500">Recent audits and updates</p>
              </div>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {activities.slice(0, 8).map((act) => (
                <div key={act.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <p className="text-xs text-slate-800 font-medium leading-snug">{act.action}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{act.user}</span>
                    <span className="font-mono tabular-nums">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
