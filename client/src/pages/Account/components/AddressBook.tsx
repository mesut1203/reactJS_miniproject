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

type View = "list" | "add" | "edit";

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const [view, setView] = useState<View>("list");
  const [editingId, setEditingId] = useState<string | null>(null);
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
      toast.error("Failed to load addresses");
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

  // When country changes, load states
  const handleCountryChange = async (code: string) => {
    setForm((prev) => ({ ...prev, country: code, state: "" }));
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

  // ──────────────────── actions ────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setStates([]);
    setEditingId(null);
    setView("add");
  };

  const openEdit = async (addr: Address) => {
    setEditingId(addr.id);
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
    // Load states for the selected country
    if (addr.country) {
      try {
        setLoadingStates(true);
        const detail = await getCountryDetail(addr.country);
        setStates(detail.country.states || []);
      } catch {
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    } else {
      setStates([]);
    }
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    try {
      setDeletingId(id);
      const res = await deleteAddress(id);
      toast.success(res.message || "Address removed");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove address");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setSettingDefaultId(id);
      await setDefaultAddress(id);
      toast.success("Default address updated");
      await fetchAddresses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to set default");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "country") handleCountryChange(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: AddressPayload = {
        ...form,
        alternativeMobileNumber: form.alternativeMobileNumber || undefined,
      };
      if (view === "edit" && editingId) {
        await updateAddress(editingId, payload);
        toast.success("Address updated successfully!");
      } else {
        await addAddress(payload);
        toast.success("Address added successfully!");
      }
      await fetchAddresses();
      setView("list");
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

  const formTitle =
    view === "edit" ? "Your Addresses / Edit Address" : "Your Addresses / Add Address";

  // ──────────────────── FORM VIEW ────────────────────
  if (view === "add" || view === "edit") {
    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">{formTitle}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Country/Region</label>
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
              <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flat, House no., Building, Company, Apartment</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Mobile Number <span className="text-gray-400">(optional)</span></label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
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
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <svg className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            ) : (
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                placeholder={loadingStates ? "Loading states..." : "State / Province"}
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
              {saving ? "Saving..." : view === "edit" ? "Update Address" : "Add Address"}
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
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
        {sortedAddresses.map((addr) => (
          <div
            key={addr.id}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            {addr.isDefault && (
              <div className="text-xs font-semibold text-gray-600 border border-gray-300 rounded px-2 py-0.5 inline-block mb-3">
                Default
              </div>
            )}
            <div className="text-sm text-gray-800 font-semibold">{addr.name}</div>
            <div className="text-sm text-gray-600 mt-1 leading-relaxed">
              {addr.address}<br />
              {addr.city}<br />
              {addr.state}, {addr.country} {addr.pincode}<br />
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
                onClick={() => handleDelete(addr.id)}
                disabled={deletingId === addr.id}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition disabled:opacity-50"
              >
                {deletingId === addr.id ? "Removing..." : "Remove"}
              </button>
              {!addr.isDefault && (
                <>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    disabled={settingDefaultId === addr.id}
                    className="text-sm text-gray-500 hover:text-gray-800 font-medium transition disabled:opacity-50"
                  >
                    {settingDefaultId === addr.id ? "Setting..." : "Set as Default"}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Add address card */}
        <button
          onClick={openAdd}
          className="bg-white border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 transition group"
        >
          <span className="text-4xl font-thin leading-none group-hover:scale-110 transition-transform">+</span>
          <span className="text-sm font-medium">Add address</span>
        </button>
      </div>
    </div>
  );
}
