import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { User, Mail, Briefcase, Calendar, FileText, TrendingUp } from 'lucide-react';

const Profile: React.FC = () => {
  const { userProfile, datasets, data } = useData();

  const stats = {
    datasetsUploaded: datasets.length,
    totalRecords: data.length,
    lastActive: new Date().toLocaleDateString(),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-xl p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-3xl font-bold text-primary-foreground">
              {userProfile.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{userProfile.name}</h2>
                <p className="text-muted-foreground">{userProfile.role}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{userProfile.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">
                    Joined {new Date(userProfile.joinedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Active Member</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Datasets Uploaded</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.datasetsUploaded}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-chart-2" />
              </div>
              <span className="text-sm text-muted-foreground">Total Records</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{stats.totalRecords}</p>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Calendar className="w-5 h-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Last Active</span>
            </div>
            <p className="text-lg font-bold text-foreground">{stats.lastActive}</p>
          </div>
        </div>

        {/* Recent Datasets */}
        {datasets.length > 0 && (
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Your Datasets</h3>
            <div className="space-y-3">
              {datasets.slice(-5).reverse().map((ds, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{ds.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {ds.rows.length} rows
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ds.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
