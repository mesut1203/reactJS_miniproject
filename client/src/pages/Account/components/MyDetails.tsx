import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "@/service/profileService";

export default function MyDetails() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthDate: "",
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      const u = data.user;
      // API may return full ISO datetime, keep only YYYY-MM-DD
      const birthDate = u.birthDate ? u.birthDate.slice(0, 10) : "";
      setForm({
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        birthDate,
      });
    } catch {
      toast.error("Không thể tải thông tin hồ sơ. Vui lòng đăng nhập lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await updateProfile({
        fullName: form.fullName,
        phone: form.phone,
        birthDate: form.birthDate || undefined,
      });
      // Sync form with server response
      const u = updated.user;
      const birthDate = u.birthDate ? u.birthDate.slice(0, 10) : "";
      setForm({
        fullName: u.fullName || "",
        email: u.email || "",
        phone: u.phone || "",
        birthDate,
      });
      toast.success("Cập nhật thông tin thành công!");
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string;
        toast.error(first);
      } else {
        toast.error(err?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Update your personal details quickly and conveniently right here.
        Whether you've got a new address, phone number, or just want to keep
        things current, this is the place to do it. Keep your profile
        up-to-date hassle-free.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            readOnly
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-500 bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+84 123 456 789"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {saving ? "Saving..." : "Update Details"}
        </button>
      </form>
    </div>
  );
}
