import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

import {
  createProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/profileService";

export default function ProfileForm() {
  const {
    user,
    profile,
    setProfile,
  } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEdit = !!profile;

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setPhone(profile.phone || "");
      setPreview(profile.avatar_url || "");
    }
  }, [profile]);

  function handleImageChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
  setImage(null);
  setPreview("");
}

  async function handleSubmit(e) {
    setError("");
    setSuccess("");
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let avatarUrl = preview || "";

      if (image) {
        avatarUrl = await uploadProfileImage(
          image,
          user.id
        );
      }

      if (!displayName.trim()) {
        setError("Display name is required.");
        return;
      }

      if (phone && !/^[0-9]{10}$/.test(phone)) {
        setError("Enter a valid 10-digit phone number.");
        return;
      }

      if (isEdit) {
        const { error } = await updateProfile(user.id, {
          display_name: displayName,
          phone,
          avatar_url: avatarUrl,
        });

        if (error) throw error;

        setProfile({
          ...profile,
          display_name: displayName,
          phone,
          avatar_url: avatarUrl,
        });

      } else {
        const { error } = await createProfile({
          user_id: user.id,
          display_name: displayName,
          phone,
          avatar_url: avatarUrl,
        });

        if (error) throw error;

        setProfile({
          user_id: user.id,
          display_name: displayName,
          phone,
          avatar_url: avatarUrl,
        });
      }

      setSuccess("Profile updated successfully.");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Avatar */}

      <div>

        <label className="block mb-3 text-sm font-medium text-gray-700">
          Profile Picture
        </label>

        <div className="flex items-center gap-5">

          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">

            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-slate-700">
                {(displayName || user.email)
                  ?.charAt(0)
                  .toUpperCase()}
              </span>
            )}

          </div>

          <div className="flex flex-col gap-2">

            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-center">

              {preview ? "Change" : "Upload"}

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

            </label>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl"
              >
                Remove
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Display Name */}

      <div>

        <label className="block mb-2 text-sm font-medium">
          Display Name
        </label>

        <input
          type="text"
          className="input-field w-full"
          value={displayName}
          onChange={(e) =>
            setDisplayName(e.target.value)
          }
        />

      </div>

      {/* Phone */}

      <div>

        <label className="block mb-2 text-sm font-medium">
          Phone Number
        </label>

        <input
          type="tel"
          className="input-field w-full"
          placeholder="+91 XXXXX XXXXX"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

      </div>

      {/* Email */}

      <div>

        <label className="block mb-2 text-sm font-medium">
          Email
        </label>

        <input
          disabled
          value={user?.email}
          className="input-field w-full bg-gray-100"
        />

      </div>

      {/* Joined */}

      <div>

        <label className="block mb-2 text-sm font-medium">
          Joined
        </label>

        <input
          disabled
          value={new Date(
            user.created_at
          ).toLocaleDateString()}
          className="input-field w-full bg-gray-100"
        />

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
        className="w-full bg-navy-900 text-white py-3 rounded-xl font-semibold"
      >
        {loading
          ? "Saving..."
          : "Update Profile"}
      </button>

    </form>
  );
}