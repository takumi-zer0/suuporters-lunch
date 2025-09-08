"use client";

import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-4 border-r dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-4">Pages</h2>
      {/* Page list will go here */}
      <div className="text-sm text-gray-500">
        Search and page tree will be implemented here.
      </div>
    </div>
  );
};

export default Sidebar;
