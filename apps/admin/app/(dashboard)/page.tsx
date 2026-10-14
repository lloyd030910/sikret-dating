'use client';

export default function Home() {
  const stats = [
    { name: 'Total Users', value: '1,234', change: '+12%', changeType: 'increase' },
    { name: 'Active Models', value: '42', change: '+2', changeType: 'increase' },
    { name: 'Daily Matches', value: '156', change: '+5%', changeType: 'increase' },
    { name: 'Unresolved Reports', value: '12', change: '-3', changeType: 'decrease' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="bg-white px-4 py-5 shadow-sm rounded-lg border border-gray-200 overflow-hidden sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
            <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {item.value}
              </div>
              <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0 ${
                item.changeType === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {item.change}
              </div>
            </dd>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Welcome to the Administration Portal</h2>
        <p className="text-gray-600">
          Use the sidebar to manage users, monitor model activity, and review system audit logs.
        </p>
      </div>
    </div>
  );
}
