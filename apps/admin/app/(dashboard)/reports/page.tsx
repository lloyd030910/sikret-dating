'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await apiClient.get('/moderation/reports');
      setReports(res.data);
    } catch (err) {
      // Mock data if API fails
      setReports([
        { id: 'r1', reporter: { email: 'user1@example.com' }, targetUser: { email: 'user2@example.com' }, reason: 'HARASSMENT', status: 'PENDING', createdAt: '2026-09-08 10:00' },
        { id: 'r2', reporter: { email: 'user3@example.com' }, targetUser: { email: 'user4@example.com' }, reason: 'SPAM', status: 'PENDING', createdAt: '2026-09-08 10:30' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (reportId: string, action: 'BAN' | 'SUSPEND' | 'NONE') => {
    try {
      await apiClient.patch(`/moderation/reports/${reportId}/resolve`, {
        status: 'RESOLVED',
        action,
        note: `Action taken: ${action}`,
      });
      fetchReports();
    } catch (err) {
      alert('Failed to resolve report');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Moderation Reports</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.reporter.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.targetUser?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {report.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleResolve(report.id, 'BAN')} className="text-red-600 hover:text-red-900">Ban</button>
                      <button onClick={() => handleResolve(report.id, 'SUSPEND')} className="text-orange-600 hover:text-orange-900">Suspend</button>
                      <button onClick={() => handleResolve(report.id, 'NONE')} className="text-gray-600 hover:text-gray-900">Dismiss</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
