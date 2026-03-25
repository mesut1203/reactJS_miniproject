import { useState } from "react";
import MyDetails from "./components/MyDetails";
import AddressBook from "./components/AddressBook";
import ChangePassword from "./components/ChangePassword";

type Tab = "my-details" | "address" | "password";

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: "my-details", label: "My Details" },
  { id: "address", label: "Address" },
  { id: "password", label: "Password" },
];

export default function Account() {
  const [activeTab, setActiveTab] = useState<Tab>("my-details");

  const renderContent = () => {
    switch (activeTab) {
      case "my-details":
        return <MyDetails />;
      case "address":
        return <AddressBook />;
      case "password":
        return <ChangePassword />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Settings</h1>
        <hr className="border-gray-200 mb-8" />

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="w-44 shrink-0">
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`text-left text-sm font-medium px-2 py-1.5 rounded transition-colors ${
                    activeTab === item.id
                      ? "text-gray-900 font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1">
            <div className="bg-gray-50 rounded-2xl p-8">{renderContent()}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
