
import React from 'react';
import { AuditReport } from '../types';
import ScoreCard from './ScoreCard';
import { Zap, Search, Layout, Shield, Download, TrendingUp, Users } from 'lucide-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from 'recharts';

interface AuditDashboardProps {
  report: AuditReport;
}

const AuditDashboard: React.FC<AuditDashboardProps> = ({ report }) => {
  const chartData = [
    { name: 'Performance', value: report.performance.score, fill: '#F59E0B' },
    { name: 'SEO', value: report.seo.score, fill: '#10B981' },
    { name: 'UX', value: report.ux.score, fill: '#4F46E5' },
    { name: 'Security', value: report.security.score, fill: '#64748B' }
  ];

  const getGrade = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const overallGrade = getGrade(report.overallScore);

  const handleConsultingClick = () => {
    const subject = encodeURIComponent(`쇼핑몰 분석 컨설팅 문의 (${report.url})`);
    const body = encodeURIComponent(`안녕하세요,\n\nShopAudit Pro를 통해 제 쇼핑몰(${report.url})을 분석했습니다.\n분석 결과에 대해 전문가의 상세한 컨설팅을 받고 싶습니다.\n\n감사합니다.`);
    window.location.href = `mailto:bostonbluejazzy@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="bg-slate-900 text-white px-3 py-1 rounded text-base">REPORT</span>
            {report.url}
          </h2>
          <p className="text-slate-500 mt-1">
            분석 완료 시간: {new Date().toLocaleString()} • 플랫폼: {report.platform}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-slate-700 text-sm font-medium shadow-sm">
          <Download className="w-4 h-4" />
          PDF 다운로드
        </button>
      </div>

      {/* Hero Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
          <h3 className="text-slate-500 font-medium mb-4 uppercase tracking-wide text-sm">종합 점수</h3>
          
          <div className="relative w-48 h-48">
             <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart 
                innerRadius="80%" 
                outerRadius="100%" 
                barSize={10} 
                data={[{ value: report.overallScore, fill: report.overallScore > 80 ? '#10B981' : report.overallScore > 60 ? '#F59E0B' : '#EF4444' }]} 
                startAngle={90} 
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={30} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-900">{report.overallScore}</span>
              <span className={`text-2xl font-bold mt-1 ${report.overallScore > 80 ? 'text-green-500' : report.overallScore > 60 ? 'text-amber-500' : 'text-red-500'}`}>
                {overallGrade}등급
              </span>
            </div>
          </div>
          <p className="text-center text-slate-600 mt-4 text-sm px-4">
            {report.summary}
          </p>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="font-bold text-lg text-slate-900 mb-6">개선이 필요한 항목</h3>
          <div className="space-y-4">
            {report.recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="bg-red-100 p-2 rounded-full mt-0.5">
                  <Zap className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-900 text-sm mb-1">우선순위 {idx + 1}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Competitor Analysis Section */}
      {report.competitorAnalysis && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Users className="w-32 h-32 text-slate-900" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
               <div className="bg-indigo-100 p-2 rounded-lg">
                 <TrendingUp className="w-6 h-6 text-indigo-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">동종 업계 경쟁사 분석</h3>
            </div>
            
            <p className="text-slate-600 mb-6 max-w-3xl">
              {report.competitorAnalysis.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.competitorAnalysis.items.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">VS</span>
                    <h4 className="font-bold text-slate-800">{item.name}</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    "{item.comparison}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ScoreCard section={report.performance} icon={<Zap className="w-5 h-5" />} />
        <ScoreCard section={report.seo} icon={<Search className="w-5 h-5" />} />
        <ScoreCard section={report.ux} icon={<Layout className="w-5 h-5" />} />
        <ScoreCard section={report.security} icon={<Shield className="w-5 h-5" />} />
      </div>

      {/* Footer CTA */}
      <div className="bg-slate-900 rounded-2xl p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">전문가와 상담이 필요하신가요?</h3>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          AI 분석 리포트를 바탕으로 개발자 및 마케터가 직접 사이트를 개선해드립니다.
          지금 바로 심층 컨설팅을 신청하세요.
        </p>
        <button 
          onClick={handleConsultingClick}
          className="px-8 py-3 bg-primary hover:bg-primary/90 rounded-full font-medium transition-colors"
        >
          컨설팅 신청하기
        </button>
      </div>
    </div>
  );
};

export default AuditDashboard;
