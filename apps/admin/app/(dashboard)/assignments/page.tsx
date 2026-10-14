'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';

export default function AssignmentsPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Mock fetching employees and models
    setEmployees([
      { id: 'e1', email: 'emp1@example.com' },
      { id: 'e2', email: 'emp2@example.com' },
    ]);
    setModels([
      { id: 'm1', displayName: 'Angelina' },
      { id: 'm2', displayName: 'Scarlett' },
    ]);
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/management/assignments', {
        employeeId: selectedEmployee,
        modelId: selectedModel,
      });
      setMessage('Assignment successful!');
    } catch (err: any) {
      setMessage('Error creating assignment');
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Employee Assignments</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleAssign} className="space-y-6">
          {message && <div className="p-3 bg-blue-50 text-blue-700 rounded-md text-sm">{message}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Choose an employee...</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.email}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Select Model</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Choose a model...</option>
              {models.map(m => <option key={m.id} value={m.id}>{m.displayName}</option>)}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            Create Assignment
          </button>
        </form>
      </div>
    </div>
  );
}
