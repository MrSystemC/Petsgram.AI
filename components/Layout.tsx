import React from 'react';
import { 
  Menu, 
  X, 
  Home, 
  MessageCircle, 
  Camera, 
  Users, 
  Settings,
  PawPrint
} from 'lucide-react';
import { AppView, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  userRole: UserRole;
  setRole: (role: UserRole) => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  setView,
  userRole,
  setRole
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: AppView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setView(view);
        setIsMobileMenuOpen(false);
      }}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 ${
        currentView === view 
          ? 'bg-emerald-100 text-emerald-800 font-semibold' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  const RoleSelector = () => (
    <div className="mt-8 px-4">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
        Режим профиля
      </label>
      <select 
        value={userRole}
        onChange={(e) => setRole(e.target.value as UserRole)}
        className="w-full p-2 text-sm bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
      >
        <option value={UserRole.OWNER}>Владелец питомца</option>
        <option value={UserRole.VET}>Ветеринар</option>
        <option value={UserRole.FARMER}>Фермер / Агро</option>
        <option value={UserRole.SCIENTIST}>Ученый / Зоолог</option>
        <option value={UserRole.ECO_ACTIVIST}>Эко-активист</option>
      </select>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-full">
        <div className="p-6 flex items-center space-x-2 border-b border-slate-100">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <PawPrint className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold text-emerald-900 tracking-tight">Petsgram</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem view={AppView.DASHBOARD} icon={Home} label="Экосистема" />
          <NavItem view={AppView.CHAT} icon={MessageCircle} label="AI Ассистент" />
          <NavItem view={AppView.DIAGNOSTICS} icon={Camera} label="Визуальный анализ" />
          <NavItem view={AppView.COMMUNITY} icon={Users} label="Сообщество" />
          
          <RoleSelector />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center space-x-3 w-full p-3 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
            <Settings size={20} />
            <span>Настройки</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <div className="flex items-center space-x-2">
           <div className="bg-emerald-500 p-1.5 rounded-lg">
            <PawPrint className="text-white" size={20} />
          </div>
          <span className="font-bold text-emerald-900">Petsgram</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 pt-20 px-4 animate-fade-in">
           <nav className="space-y-2">
            <NavItem view={AppView.DASHBOARD} icon={Home} label="Экосистема" />
            <NavItem view={AppView.CHAT} icon={MessageCircle} label="AI Ассистент" />
            <NavItem view={AppView.DIAGNOSTICS} icon={Camera} label="Визуальный анализ" />
            <NavItem view={AppView.COMMUNITY} icon={Users} label="Сообщество" />
            <div className="pt-4 border-t border-slate-100">
              <RoleSelector />
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative md:static pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
