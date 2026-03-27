import { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "@/service/profileService";

export default function ChangePassword() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateChangePassword = () => {
    if (!form.currentPassword) {
      toast.error("Current password is required");
      return false;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New passwords do not match");
      return false;
    }
    if (form.currentPassword === form.newPassword) {
      toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateChangePassword()) return;

    try {
      setSaving(true);
      const payload = {
        password: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      };
      const data = await changePassword(payload);
      toast.success(data.message || "Password changed successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors?.password) {
        toast.error(errors.password);
      } else if (errors?.currentPassword) {
        toast.error(errors.currentPassword);
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to change password",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Choose a strong password and don't reuse it for other accounts. You can
        change your password any time to keep your account secure.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {saving ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
