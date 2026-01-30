import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveUserProfile } from "@/lib/user";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [interests, setInterests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }

    saveUserProfile({
      name: name.trim(),
      class: className.trim() || undefined,
      curriculum: curriculum.trim() || undefined,
      age: typeof age === "number" && !Number.isNaN(age) ? age : undefined,
      scopeOfInterest: interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });

    // go to profile after save
    navigate("/profile");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <div className="max-w-3xl w-full p-6 mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Login / Edit Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-6 rounded-2xl border border-border">
          <div>
            <label className="text-sm font-medium">Full name</label>
            <input className="w-full mt-1 px-3 py-2 rounded border border-border" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Class</label>
            <input className="w-full mt-1 px-3 py-2 rounded border border-border" value={className} onChange={(e) => setClassName(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Curriculum</label>
            <input className="w-full mt-1 px-3 py-2 rounded border border-border" value={curriculum} onChange={(e) => setCurriculum(e.target.value)} />
          </div>

          <div>
            <label className="text-sm font-medium">Age</label>
            <input type="number" className="w-full mt-1 px-3 py-2 rounded border border-border" value={age as any} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>

          <div>
            <label className="text-sm font-medium">Scope of Interest (comma separated)</label>
            <input className="w-full mt-1 px-3 py-2 rounded border border-border" value={interests} onChange={(e) => setInterests(e.target.value)} />
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit">Save Profile</Button>
            <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;