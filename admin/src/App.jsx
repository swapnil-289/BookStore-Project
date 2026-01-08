import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import AddBooks from './components/AddBook';
import ListBooks from './components/BookList';
import Orders from './components/Orders';

const App = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>  
          <Route path="/" element={<AddBooks />} />
          <Route path="/list-books" element={<ListBooks />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;