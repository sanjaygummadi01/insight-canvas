import React, { useState, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  FileText, 
  TrendingUp,
  Camera,
  Edit2,
  Save,
  X,
  MapPin,
  Phone,
  Info
} from 'lucide-react';

const Profile: React.FC = () => {
  const { datasets, data } = useData();
  const { user, updateProfile, updateProfileImage } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.profile.name || '',
    email: user?.profile.email || '',
    role: user?.profile.role || '',
    bio: user?.profile.bio || '',
    location: user?.profile.location || '',
    phone: user?.profile.phone || '',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = {
    datasetsUploaded: datasets.length,
    totalRecords: data.length,
    lastActive: new Date().toLocaleDateString(),
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel - reset form
      setEditForm({
        name: user?.profile.name || '',
        email: user?.profile.email || '',
        role: user?.profile.role || '',
        bio: user?.profile.bio || '',
        location: user?.profile.location || '',
        phone: user?.profile.phone || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    updateProfile({
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      bio: editForm.bio,
      location: editForm.location,
      phone: editForm.phone,
      avatar: editForm.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    });
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      updateProfileImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const profile = user?.profile;

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Please log in to view your profile</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account information
            </p>
          </div>
          <button
            onClick={isEditing ? handleSave : handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card rounded-xl p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              {profile.avatarImage ? (
                <img 
                  src={profile.avatarImage} 
                  alt={profile.name}
                  className="w-24 h-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {profile.avatar}
                </div>
              )}
              
              {/* Upload Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 w-full">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="+1 234 567 890"
                        className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full px-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.role}</p>
                  </div>

                  {profile.bio && (
                    <p className="text-foreground/80">{profile.bio}</p>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">{profile.role}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        Joined {new Date(profile.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{profile.location}</span>
                      </div>
                    )}
                    {profile.phone && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{profile.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">Active Member</span>
                    </div>
                  </div>
                </>
              )}
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
