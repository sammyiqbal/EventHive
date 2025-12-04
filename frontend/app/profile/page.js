"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { getCurrentUser, updateUserProfile } from "../../lib/api";
import { useAuth } from "../../contexts/auth-context";
import { User, Mail, Building, Save, Edit } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, login: authLogin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    try {
      const userData = await getCurrentUser();
      setProfile(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
    } catch (error) {
      console.error("Failed to load profile:", error);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);

    try {
      const updated = await updateUserProfile({
        name: formData.name,
      });

      // Update auth context
      authLogin(
        localStorage.getItem("eventhive_token") || sessionStorage.getItem("eventhive_token"),
        { ...user, ...updated },
        !!localStorage.getItem("eventhive_token")
      );

      setProfile(updated);
      setEditing(false);
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateUserProfile({
        password: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      alert("Password updated successfully");
    } catch (error) {
      setError(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>

        {/* Profile Information */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-white/20 hover:bg-white/10"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {editing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-white/5 border-white/10 text-slate-400"
                />
                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
              </div>


              <div className="flex gap-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary-500 hover:bg-primary-600"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name || "",
                      email: profile.email || "",
                    });
                  }}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{profile.name || "No name"}</h3>
                  <p className="text-slate-400">{profile.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-white">{profile.email}</p>
                  </div>
                </div>

                {profile.college && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm text-slate-400">College</p>
                      <p className="text-white">{profile.college.name}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-white capitalize">{profile.role || "student"}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </Card>

        {/* Change Password */}
        <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-6">Change Password</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <Button
              onClick={handlePasswordChange}
              disabled={saving || !passwordData.newPassword || !passwordData.confirmPassword}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </Card>

        {/* Manage Created Events (Admin only) */}
        {user?.role === "admin" && (
          <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/20">
            <h2 className="text-2xl font-semibold text-white mb-4">Manage Events</h2>
            <p className="text-slate-400 mb-4">
              View and manage all events you've created
            </p>
            <Button
              onClick={() => router.push("/dashboard/admin")}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Go to Admin Dashboard
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

