
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import UrlInput from './components/UrlInput';
import AuditDashboard from './components/AuditDashboard';
import AdminDashboard from './components/AdminDashboard';
import { analyzeUrl } from './services/geminiService';
import { saveHistory } from './services/historyService';
import { getClientIp, checkIpLimit, incrementIpUsage } from './services/ipService';
import { AuditReport, AnalysisState } from './types';
import { Activity, Lock } from 'lucide-react';

const App: React.FC = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.IDLE);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAnalyze = async (url: string) => {
    setAnalysisState(AnalysisState.ANALYZING);
    setError(null);
    setReport(null);

    try {
      setLoadingStep('사용자 접속 환경 확인 중...');
      
      // 1. Check IP Limit
      const clientIp = await getClientIp();
      const isAllowed = checkIpLimit(clientIp);

      if (!isAllowed) {
        throw new Error("일일 무료 분석 횟수(3회)를 초과했습니다. 내일 다시 시도해주세요.");
      }

      // Simulate initial connection steps for better UX
      setLoadingStep('서버 연결 중...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setLoadingStep('DNS 조회 및 SSL 인증서 확인 중...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setLoadingStep('페이지 리소스 크롤링 중...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      setLoadingStep('AI가 데이터를 분석하고 리포트를 생성 중입니다...');
      
      // Call Gemini API
      const result = await analyzeUrl(url);
      
      // Increment Usage Count
      incrementIpUsage(clientIp);

      // Save for admin review with IP
      saveHistory(result, clientIp);

      setReport(result);
      setAnalysisState(AnalysisState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "분석 중 오류가 발생했습니다. URL을 확인하거나 잠시 후 다시 시도해주세요.");
      setAnalysisState(AnalysisState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col">
        {analysisState === AnalysisState.IDLE && (
          <div className="flex-grow flex items-center justify-center">
            <UrlInput onAnalyze={handleAnalyze} isLoading={false} />
          </div>
        )}

        {analysisState === AnalysisState.ANALYZING && (
          <div className="flex-grow flex flex-col items-center justify-center p-8 animate-pulse">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 relative">
               <Activity className="w-10 h-10 text-primary animate-bounce" />
               <div className="absolute inset-0 border-4 border-primary/20 rounded-2xl animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">사이트 분석 중</h2>
            <p className="text-slate-500 text-center max-w-md">{loadingStep}</p>
            <div className="mt-8 w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-[width_2s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
            </div>
          </div>
        )}

        {analysisState === AnalysisState.COMPLETE && report && (
          <div className="w-full animate-fade-in-up">
            <div className="bg-white border-b border-slate-200 py-4">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <button 
                        onClick={() => setAnalysisState(AnalysisState.IDLE)}
                        className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1 text-sm"
                    >
                        ← 다른 사이트 분석하기
                    </button>
                </div>
            </div>
            <AuditDashboard report={report} />
          </div>
        )}

        {analysisState === AnalysisState.ERROR && (
           <div className="flex-grow flex flex-col items-center justify-center p-4">
             <div className="bg-red-50 p-8 rounded-2xl max-w-md text-center border border-red-100 shadow-sm">
               <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">⚠️</span>
               </div>
               <h3 className="text-lg font-bold text-red-800 mb-2">분석 불가</h3>
               <p className="text-red-600 mb-6">{error}</p>
               <button 
                 onClick={() => setAnalysisState(AnalysisState.IDLE)}
                 className="px-6 py-2 bg-white border border-red-200 text-red-600 rounded-full font-medium hover:bg-red-50 transition-colors"
               >
                 확인
               </button>
             </div>
           </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 ShopAudit Pro. Powered by Gemini AI.
          </p>
          <button 
            onClick={() => setShowAdmin(true)}
            className="flex items-center gap-1 text-xs text-slate-300 hover:text-slate-500 transition-colors"
          >
            <Lock className="w-3 h-3" />
            Admin Access
          </button>
        </div>
      </footer>

      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </div>
  );
};

export default App;