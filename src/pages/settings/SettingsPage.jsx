import { useNavigate } from "react-router-dom";

import {
  User,
  Building2,
  Shield,
  Info,
} from "lucide-react";

import SettingsCard from "../../components/settings/SettingsCard";

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="space-y-5">

        <SettingsCard
          icon={User}
          title="My Profile"
          description="Manage your personal profile."
          onClick={() => navigate("/profile")}
        />

        <SettingsCard
          icon={Building2}
          title="Company"
          description="Update company information."
          onClick={() => navigate("/company-setup")}
        />

        <SettingsCard
          icon={Shield}
          title="Security"
          description="Change password and security settings."
          onClick={() => navigate("/security")}
        />

        <SettingsCard
          icon={Info}
          title="About"
          description="Application version and information."
          onClick={() => navigate("/settings/about")}
        />

      </div>

    </div>
  );
}