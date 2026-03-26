import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatInterface from './components/ChatInterface';
import DiagnosticsView from './components/DiagnosticsView';
import { AppView, UserRole } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.OWNER);

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard userRole={userRole} onChangeView={setCurrentView} />;
      case AppView.CHAT:
        return <ChatInterface userRole={userRole} />;
      case AppView.DIAGNOSTICS:
        return <DiagnosticsView userRole={userRole} />;
      case AppView.COMMUNITY:
        return (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center p-8">
              <h2 className="text-2xl font-bold text-slate-400 mb-2">Раздел в разработке</h2>
              <p className="text-slate-500">Скоро здесь появится социальная сеть Petsgram.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard userRole={userRole} onChangeView={setCurrentView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView}
      userRole={userRole}
      setRole={setUserRole}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
