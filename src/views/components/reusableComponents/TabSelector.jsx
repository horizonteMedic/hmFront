import { useEffect, useState } from "react";
export default function TabSelector({ tieneVista, tabsConfig }) {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        // Find the first available tab based on permissions
        const firstAvailableTab = tabsConfig.find(tab => tieneVista(tab.permission));
        setActiveTab(firstAvailableTab ? firstAvailableTab.id : -1);
    }, []);

    // Get available tabs based on permissions
    const availableTabs = tabsConfig.filter(tab => tieneVista(tab.permission));

    // Get active tab component
    const ActiveComponent = tabsConfig.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="space-y-4">
            <div className="bg-white border-t border-gray-200 rounded-lg p-3">
                {/* Tab Navigation */}
                <nav className="flex bg-white border-b border-gray-200 mb-4">
                    {availableTabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`flex-1 px-4 py-3 uppercase tracking-wider border-b-4 transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === tab.id
                                ? "border-[#233245] font-semibold"
                                : "border-transparent"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
                {/* Tab Content */}
                <div className="max-w-full">
                    {ActiveComponent && <ActiveComponent />}
                    {activeTab === -1 && (
                        <div className="text-center text-gray-500">
                            No tiene permisos para ver ningún examen.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
