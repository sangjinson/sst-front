// src/components/AdminTable.jsx
import React from 'react';

const AdminTable = ({ headers, children }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-5 py-3 text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;