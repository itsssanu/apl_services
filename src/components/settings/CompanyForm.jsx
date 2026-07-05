import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

import {
  createCompany,
  updateCompany,
  uploadCompanyLogo,
} from "../../services/companyService";

export default function CompanyForm({
  isFirstSetup = false,
}) {
  const navigate = useNavigate();

  const {
    user,
    company,
    setCompany,
  } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!company) return;

    setCompanyName(company.company_name || "");

    if (company.logo_url) {
      setPreview(`${company.logo_url}?t=${Date.now()}`);
    } else {
      setPreview("");
    }
  }, [company]);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveLogo() {
    setLogo(null);
    setPreview("");
  }

  async function handleSubmit(e) {
    setError("");
    setSuccess("");
    e.preventDefault();

    setError("");

    if (!companyName.trim()) {
      setError("Company name is required.");
      return;
    }

    setLoading(true);

    try {
      let logoUrl = preview || "";

      if (logo) {
        logoUrl = await uploadCompanyLogo(
          logo,
          user.id
        );
      }

      if (company) {
        const { error } = await updateCompany(user.id, {
          company_name: companyName,
          logo_url: logoUrl,
        });

        if (error) throw error;

        // Update AuthContext immediately
        setCompany({
          ...company,
          company_name: companyName,
          logo_url: logoUrl
        });

        setSuccess("Company updated successfully.");
      } else {
        const { error } = await createCompany({
          user_id: user.id,
          company_name: companyName,
          logo_url: logoUrl,
        });

        if (error) throw error;

        // Save immediately into AuthContext
        setCompany({
          user_id: user.id,
          company_name: companyName,
          logo_url: logoUrl,
        });

        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Company Name
        </label>

        <input
          type="text"
          className="input-field w-full"
          placeholder="Enter company name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)
          }
        />
      </div>

      <div>
        <label className="block mb-3 text-sm font-medium text-gray-700">
          Company Logo
        </label>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="Company Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-400 text-center">
                No Logo
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">

            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-medium text-center transition">

              {preview ? "Change Logo" : "Upload Logo"}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoChange}
              />

            </label>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition"
              >
                Remove Logo
              </button>
            )}

          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-600 text-sm">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-navy-900 hover:bg-navy-800 text-white py-3 rounded-xl font-semibold transition"
      >
        {loading
          ? "Saving..."
          : isFirstSetup
            ? "Continue"
            : "Save Changes"}
      </button>
    </form>
  );
}