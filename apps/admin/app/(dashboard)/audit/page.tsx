'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/admin/audit-logs').then(res => {
      setLogs(res.data);
    }).catch(() => {
      setLogs([
        { id: 'l1', actor: { email: 'employee@example.com' }, action: 'WS.send_message', targetUser: { email: 'model1@example.com' }, createdAt: '2026-09-08 09:00' },
        { id: 'l2', actor: { email: 'admin@example.com' }, action: 'ASSIGN_MODEL', targetUser: { email: 'employee@example.com' }, createdAt: '2026-09-08 08:30' },
      ]);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.actor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600">{log.action}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.targetUser?.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
