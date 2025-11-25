import React from 'react';
import { AuditSection } from '../types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ScoreCardProps {
  section: AuditSection;
  icon: React.ReactNode;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ section, icon }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-100';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-red-600 bg-red-50 border-red-100';
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'poor') => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'poor': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            {icon}
          </div>
          <h3 className="font-semibold text-lg text-slate-800">{section.title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(section.score)}`}>
          {section.score}점
        </div>
      </div>
      
      <div className="p-6">
        <ul className="space-y-4">
          {section.items.map((item, idx) => (
            <li key={idx} className="flex items-start justify-between group">
              <div className="flex gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {getStatusIcon(item.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                </div>
              </div>
              <span className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScoreCard;