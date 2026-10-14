'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';

export default function ModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const endpoint = user?.role === 'EMPLOYEE' ? '/management/employee/models' : '/admin/models';
    apiClient.get(endpoint).then(res => {
      setModels(res.data);
    }).catch(() => {
      setModels([
        { id: 'm1', email: 'model1@example.com', displayName: 'Angelina', status: 'ACTIVE' },
        { id: 'm2', email: 'model2@example.com', displayName: 'Scarlett', status: 'ACTIVE' },
      ]);
    });
  }, [user]);

  const handleActAs = (modelId: string) => {
    localStorage.setItem('acting_as_model', modelId);
    window.location.href = '/chat'; // Redirect to a chat management view
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Model Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <div key={model.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{model.displayName}</h2>
              <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-50 rounded-full">
                {model.status}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6">{model.email}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => handleActAs(model.id)}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Act as Model
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
