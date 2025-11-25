
import React, { useState } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }
      onAnalyze(formattedUrl);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        쇼핑몰 상태 <span className="text-primary">완벽 분석</span>
      </h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
        접속 속도, SEO, 헤더/푸터 UX, 보안 설정까지.<br className="hidden sm:block"/> 
        URL 하나로 쇼핑몰의 모든 잠재적 문제를 진단하고 리포트를 받아보세요.
      </p>
      
      <form onSubmit={handleSubmit} className="relative flex items-center max-w-2xl mx-auto mb-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-32 py-4 text-base text-slate-900 bg-white border border-slate-200 rounded-full shadow-lg focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all outline-none"
          placeholder="분석할 쇼핑몰 URL을 입력하세요 (예: coupang.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <div className="absolute right-2 top-2 bottom-2">
          <button
            type="submit"
            disabled={isLoading || !url}
            className="h-full px-6 bg-primary hover:bg-primary/90 text-white font-medium rounded-full transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>분석 중</span>
              </>
            ) : (
              <>
                <span>분석 시작</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>SEO 최적화</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>접속 속도 측정</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
          <span>UX/UI 구조 진단</span>
        </div>
      </div>
    </div>
  );
};

export default UrlInput;
