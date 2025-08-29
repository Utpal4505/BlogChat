import React, { useState } from 'react';

// Reusable Components
const StatCard = ({ title, value, change, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600 text-white",
    green: "from-emerald-500 to-teal-600 text-white",
    purple: "from-purple-500 to-pink-600 text-white",
    orange: "from-orange-500 to-red-600 text-white"
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">{project.name}</h3>
          <p className="text-slate-500 text-sm mt-1">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'active' ? 'bg-blue-100 text-blue-700' :
          project.status === 'review' ? 'bg-amber-100 text-amber-700' :
          'bg-green-100 text-green-700'
        }`}>
          {project.status}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="font-medium text-slate-800">{project.progress}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm text-slate-600">{project.team} members</span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

const ActivityItem = ({ activity }) => {
  const getIcon = (type) => {
    const iconClasses = "w-4 h-4";
    switch (type) {
      case 'user':
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
      case 'project':
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case 'payment':
        return <svg className={iconClasses} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>;
      default:
        return <div className="w-2 h-2 bg-slate-400 rounded-full"></div>;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'user': return 'bg-blue-100 text-blue-600';
      case 'project': return 'bg-green-100 text-green-600';
      case 'payment': return 'bg-emerald-100 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-slate-50/50 rounded-lg transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getBgColor(activity.type)}`}>
        {getIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-800">{activity.action}</p>
        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [user] = useState({
    name: 'Alex Johnson',
    avatar: '👨‍💼',
    email: 'alex@company.com'
  });

  const stats = [
    { title: 'Total Revenue', value: '$54,239', change: '+12.5%', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>, color: 'green' },
    { title: 'Active Users', value: '2,543', change: '+8.2%', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, color: 'blue' },
    { title: 'Projects', value: '28', change: '+3', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, color: 'purple' },
    { title: 'Tasks Done', value: '156', change: '+24', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'orange' }
  ];

  const projects = [
    { id: 1, name: 'E-commerce Platform', progress: 85, status: 'active', team: 5, dueDate: '2025-09-15' },
    { id: 2, name: 'Mobile Banking App', progress: 60, status: 'active', team: 3, dueDate: '2025-10-20' },
    { id: 3, name: 'Social Dashboard', progress: 95, status: 'review', team: 4, dueDate: '2025-08-30' },
    { id: 4, name: 'AI Chatbot', progress: 30, status: 'active', team: 2, dueDate: '2025-11-10' }
  ];

  const activities = [
    { id: 1, action: 'New user Alex registered', time: '2 minutes ago', type: 'user' },
    { id: 2, action: 'Payment of $2,500 received', time: '1 hour ago', type: 'payment' },
    { id: 3, action: 'Project Mobile App completed', time: '2 hours ago', type: 'project' },
    { id: 4, action: 'Sarah joined the team', time: '4 hours ago', type: 'user' },
    { id: 5, action: 'Monthly revenue target achieved', time: '6 hours ago', type: 'payment' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5 5-5h-5m-6 5l-5 5m5-5l-5-5m5 5h14" />
                </svg>
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-600">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800">Active Projects</h3>
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
                New Project
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {activities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
              <div className="p-4 border-t border-slate-200">
                <button className="w-full text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Add Team Member', icon: '👥' },
              { name: 'Create Task', icon: '✅' },
              { name: 'Generate Report', icon: '📊' },
              { name: 'Schedule Meeting', icon: '📅' }
            ].map((action, index) => (
              <button
                key={index}
                className="flex flex-col items-center p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:shadow-md"
              >
                <span className="text-2xl mb-2">{action.icon}</span>
                <span className="text-sm font-medium text-slate-700">{action.name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
