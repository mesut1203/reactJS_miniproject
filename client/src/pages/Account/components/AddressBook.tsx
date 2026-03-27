import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getCountries,
  getCountryDetail,
  type Address,
  type Country,
  type AddressPayload,
} from "@/service/addressService";

const EMPTY_FORM: AddressPayload = {
  name: "",
  country: "",
  address: "",
  mobileNumber: "",
  alternativeMobileNumber: "",
  pincode: "",
  city: "",
  state: "",
  isDefault: false,
};

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // showForm=true → show the form panel
  const [showForm, setShowForm] = useState(false);
  // editingAddress !== null → EDIT mode; null → ADD mode
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<AddressPayload>(EMPTY_FORM);

  // Country / State
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  // ──────────────────── fetch data ────────────────────
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses();
      setAddresses(data.addresses || []);
    } catch {
      toast.error("Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    getCountries()
      .then((d) => setCountries(d.countries))
      .catch(() => {});
  }, []);

  // Load states for a given country code
  const loadStatesForCountry = async (code: string) => {
    setStates([]);
    if (!code) return;
    try {
      setLoadingStates(true);
      const detail = await getCountryDetail(code);
      setStates(detail.country.states || []);
    } catch {
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  // ──────────────────── open ADD ────────────────────
  const openAdd = () => {
    setEditingAddress(null);
    setForm(EMPTY_FORM);
    setStates([]);
    setShowForm(true);
  };

  // ──────────────────── open EDIT ────────────────────
  const openEdit = async (addr: Address) => {
    // Reset states first
    setStates([]);
    setForm({
      name: addr.name,
      country: addr.country,
      address: addr.address,
      mobileNumber: addr.mobileNumber,
      alternativeMobileNumber: addr.alternativeMobileNumber || "",
      pincode: addr.pincode,
      city: addr.city,
      state: addr.state,
      isDefault: addr.isDefault,
    });
    setEditingAddress(addr); // marks EDIT mode - set AFTER form
    setShowForm(true); // show form AFTER editingAddress is set
    // Load states in background (non-blocking for form display)
    loadStatesForCountry(addr.country);
  };

  // ──────────────────── cancel ────────────────────
  const handleCancel = () => {
    setShowForm(false);
    setEditingAddress(null);
    setForm(EMPTY_FORM);
    setStates([]);
  };

  // ──────────────────── delete ────────────────────
  const handleDelete = async (addr: Address) => {
    if (!window.confirm("Bạn có chắc muốn xóa địa chỉ này không?")) return;
    // MongoDB trả _id, fallback sang id
    const id = addr._id || addr.id;
    try {
      setDeletingId(id);
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => (a._id || a.id) !== id));
      toast.success("Đã xóa địa chỉ thành công");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Xóa địa chỉ thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  // ──────────────────── set default ────────────────────
  const handleSetDefault = async (addr: Address) => {
    const id = addr._id || addr.id;
    try {
      setSettingDefaultId(id);
      await setDefaultAddress(id);
      toast.success("Đã cập nhật địa chỉ mặc định");
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSettingDefaultId(null);
    }
  };

  // ──────────────────── form change ────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    if (name === "country") {
      setForm((prev) => ({ ...prev, country: value, state: "" }));
      loadStatesForCountry(value);
      return;
    }
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ──────────────────── submit ────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // editingAddress is read directly — no stale closure possible
    const isEditing = editingAddress !== null;
    // MongoDB trả _id, fallback sang id
    const addressId = editingAddress
      ? editingAddress._id || editingAddress.id
      : null;

    try {
      setSaving(true);
      const payload: AddressPayload = {
        ...form,
        alternativeMobileNumber: form.alternativeMobileNumber || undefined,
      };

      if (isEditing && addressId) {
        await updateAddress(addressId, payload);
        toast.success("Cập nhật địa chỉ thành công!");
      } else {
        await addAddress(payload);
        toast.success("Thêm địa chỉ thành công!");
      }

      handleCancel();
      await fetchAddresses();
    } catch (err: any) {
      const errors = err?.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string;
        toast.error(first);
      } else {
        toast.error(err?.response?.data?.message || "Failed to save address");
      }
    } finally {
      setSaving(false);
    }
  };

  // ──────────────────── render helpers ────────────────────
  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition";

  const formTitle = editingAddress
    ? "Your Addresses / Edit Address"
    : "Your Addresses / Add Address";

  // ──────────────────── FORM VIEW ────────────────────
  if (showForm) {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{formTitle}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              minLength={2}
              placeholder="Full name"
              className={inputClass}
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country/Region
            </label>
            <div className="relative">
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                className={inputClass + " appearance-none pr-10"}
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flat, House no., Building, Company, Apartment
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              minLength={5}
              placeholder="Street address"
              className={inputClass}
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleChange}
              required
              placeholder="+84 123 456 789"
              className={inputClass}
            />
          </div>

          {/* Alt Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternative Mobile Number{" "}
              <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="tel"
              name="alternativeMobileNumber"
              value={form.alternativeMobileNumber}
              onChange={handleChange}
              placeholder="+84 987 654 321"
              className={inputClass}
            />
          </div>

          {/* Pincode & City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                minLength={4}
                placeholder="000000"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="City"
                className={inputClass}
              />
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            {states.length > 0 ? (
              <div className="relative">
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  required
                  className={inputClass + " appearance-none pr-10"}
                >
                  <option value="">Select state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            ) : (
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder={
                  loadingStates ? "Loading states..." : "State / Province"
                }
                disabled={loadingStates}
                className={inputClass}
              />
            )}
          </div>

          {/* Default checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              name="isDefault"
              checked={!!form.isDefault}
              onChange={handleChange}
              className="w-4 h-4 accent-indigo-600"
            />
            Set as default address
          </label>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingAddress
                  ? "Update Address"
                  : "Add Address"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ──────────────────── LIST VIEW ────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Sort: default first
  const sortedAddresses = [...addresses].sort((a, b) =>
    a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1,
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Addresses</h2>

      <div className="flex flex-col gap-4">
        {sortedAddresses.map((addr) => {
          const addrId = addr._id || addr.id;
          return (
            <div
              key={addrId}
              className="bg-white border border-gray-200 rounded-xl p-5"
            >
              {addr.isDefault && (
                <div className="text-xs font-semibold text-gray-600 border border-gray-300 rounded px-2 py-0.5 inline-block mb-3">
                  Default
                </div>
              )}
              <div className="text-sm text-gray-800 font-semibold">
                {addr.name}
              </div>
              <div className="text-sm text-gray-600 mt-1 leading-relaxed">
                {addr.address}
                <br />
                {addr.city}
                <br />
                {addr.state}, {addr.country} {addr.pincode}
                <br />
                Phone number: {addr.mobileNumber}
              </div>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition"
                >
                  Edit
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => handleDelete(addr)}
                  disabled={deletingId === addrId}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
                >
                  {deletingId === addrId ? "Removing..." : "Remove"}
                </button>
                {!addr.isDefault && (
                  <>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => handleSetDefault(addr)}
                      disabled={settingDefaultId === addrId}
                      className="text-sm text-gray-500 hover:text-gray-800 font-medium transition disabled:opacity-50"
                    >
                      {settingDefaultId === addrId
                        ? "Setting..."
                        : "Set as Default"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {/* Add address card */}
        <button
          onClick={openAdd}
          className="bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition group"
        >
          <span className="text-4xl font-thin leading-none group-hover:scale-110 transition-transform">
            +
          </span>
          <span className="text-sm font-medium">Add address</span>
        </button>
      </div>
    </div>
  );
}
