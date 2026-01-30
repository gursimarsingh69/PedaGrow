import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { getUserProfile, clearUserProfile } from "@/lib/user";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getUserProfile());
  const [activeItem, setActiveItem] = useState("/profile");

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleLogout = () => {
    if (!confirm("Clear saved profile and logout?")) return;
    clearUserProfile();
    setProfile(null);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl w-full p-6 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">Profile</h2>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/login")}>Edit Profile</Button>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          {profile ? (
            <ProfileCard profile={{
              name: profile.name,
              class: profile.class ?? "-",
              curriculum: profile.curriculum ?? "-",
              age: profile.age ?? 0,
              scopeOfInterest: profile.scopeOfInterest ?? [],
            }} />
          ) : (
            <div className="bg-card p-6 rounded-2xl border border-border">
              <p className="mb-4">No profile found. Please log in to save your profile.</p>
              <Button onClick={() => navigate("/login")}>Login / Create Profile</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;