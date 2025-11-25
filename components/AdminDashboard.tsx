
import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../types';
import { getHistory, clearHistory, deleteHistoryItem } from '../services/historyService';
import { resetIpUsage } from '../services/ipService';
import { Lock, Search, Trash2, X, BarChart, Calendar, Globe, Monitor, RefreshCw } from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setHistory(getHistory());
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 올바르지 않습니다.');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('이 기록을 삭제하시겠습니까?')) {
      deleteHistoryItem(id);
      setHistory(getHistory());
    }
  };

  const handleClearAll = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleResetMyIp = () => {
    if (confirm('현재 접속 중인 브라우저의 일일 분석 횟수 제한을 초기화하시겠습니까?')) {
      resetIpUsage();
      alert('초기화되었습니다. 다시 분석할 수 있습니다.');
    }
  };

  const filteredHistory = history.filter(item => 
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.clientIp && item.clientIp.includes(searchTerm))
  );

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) 
    : 0;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
          <div className="bg-slate-900 p-6 flex justify-between items-center">
            <h3 className="text-white font-bold flex items-center gap-2">
              <Lock className="w-5 h-5" /> 관리자 로그인
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                접속하기
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-white overflow-auto animate-fade-in">
      <div className="min-h-screen bg-slate-50">
        <nav className="bg-slate-900 text-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-2 font-bold text-lg">
                <div className="p-1.5 bg-indigo-500 rounded">
                  <BarChart className="w-5 h-5 text-white" />
                </div>
                ShopAudit Admin
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">총 분석 리포트</h3>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{history.length}건</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">평균 점수</h3>
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <BarChart className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{averageScore}점</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-500 text-sm font-medium">최근 분석</h3>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900 truncate">
                {history[0] ? new Date(history[0].timestamp).toLocaleDateString() : '-'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="URL, 플랫폼 또는 IP 검색..." 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleResetMyIp}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" /> 내 IP 제한 초기화
              </button>
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> 전체 데이터 초기화
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">분석 일시</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">접속 IP</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">점수</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">플랫폼</th>
                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                         <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                           <div className="flex items-center gap-2">
                            <Monitor className="w-3 h-3 text-slate-400" />
                            {item.clientIp || 'Unknown'}
                           </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
                            {item.url}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            item.score >= 80 ? 'bg-green-100 text-green-800 border-green-200' :
                            item.score >= 60 ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {item.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {item.platform}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDelete(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        데이터가 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
