import React from 'react';
import { BarChart3, ShoppingBag } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-slate-900">ShopAudit Pro</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center text-sm text-slate-500">
                <ShoppingBag className="w-4 h-4 mr-1" />
                <span>이커머스 분석 전문가</span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;