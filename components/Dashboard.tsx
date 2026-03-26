import React from 'react';
import { AppView, UserRole } from '../types';
import { 
  Activity, 
  Stethoscope, 
  Sprout, 
  Microscope, 
  Heart,
  Globe
} from 'lucide-react';

interface DashboardProps {
  userRole: UserRole;
  onChangeView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole, onChangeView }) => {
  const getGreeting = () => {
    switch(userRole) {
      case UserRole.VET: return "Кабинет врача";
      case UserRole.FARMER: return "Управление фермой";
      case UserRole.SCIENTIST: return "Лаборатория";
      case UserRole.ECO_ACTIVIST: return "Эко-мониторинг";
      default: return "Мой питомец";
    }
  };

  const getDescription = () => {
    switch(userRole) {
      case UserRole.VET: return "Доступ к базе знаний, картам пациентов и AI диагностике.";
      case UserRole.FARMER: return "Мониторинг погоды, здоровья стада и агро-аналитика.";
      case UserRole.SCIENTIST: return "Исследования, статистика популяций и научные публикации.";
      case UserRole.ECO_ACTIVIST: return "Отслеживание экологических инициатив и защита фауны.";
      default: return "Следите за здоровьем, активностью и питанием вашего любимца.";
    }
  };

  const StatCard = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{getGreeting()}</h1>
          <p className="text-slate-600 text-lg max-w-2xl">{getDescription()}</p>
        </div>

        {/* Quick Stats (Mock Data based on role) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label={userRole === UserRole.FARMER ? "Голов скота" : "Активность сегодня"} 
            value={userRole === UserRole.FARMER ? "1,240" : "High"} 
            color="text-emerald-600" 
          />
          <StatCard 
            label={userRole === UserRole.VET ? "Пациентов сегодня" : "Состояние здоровья"} 
            value={userRole === UserRole.VET ? "12" : "100%"} 
            color="text-blue-600" 
          />
          <StatCard 
            label="AI Запросов" 
            value="24" 
            color="text-purple-600" 
          />
        </div>

        {/* Action Modules */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-6">Доступные модули</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <button 
              onClick={() => onChangeView(AppView.CHAT)}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-48"
            >
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI Консультант</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Мгновенные ответы на вопросы о здоровье и уходе.
                </p>
              </div>
            </button>

            <button 
              onClick={() => onChangeView(AppView.DIAGNOSTICS)}
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-48"
            >
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <Stethoscope size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Визуальная диагностика</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Анализ симптомов, пород и растений по фото.
                </p>
              </div>
            </button>

            <button className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-48">
              <div className="bg-amber-100 w-12 h-12 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
                <Sprout size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Эко-мониторинг</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Карта экологической обстановки вашего региона.
                </p>
              </div>
            </button>

             {userRole === UserRole.SCIENTIST && (
              <button className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-48">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  <Microscope size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Research Data</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Доступ к глобальной базе данных исследований.
                  </p>
                </div>
              </button>
            )}

            <button className="group bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left flex flex-col justify-between h-48 text-white">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 backdrop-blur-sm">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Petsgram Social</h3>
                <p className="text-emerald-50 text-sm mt-1">
                  Общайтесь с владельцами животных по всему миру.
                </p>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
