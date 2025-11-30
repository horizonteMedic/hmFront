import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SubTabSelector({ tieneVista, tabsConfig }) {
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
            <div className="bg-white ">
                <div className="flex space-x-1 overflow-x-auto mb-4">
                    {availableTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 border rounded-t-lg transition duration-150 text-base font-semibold focus:outline-none flex items-center whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#233245] text-white font-bold'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tab.icon && (
                                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                            )}
                            {tab.label}
                        </button>
                    ))}
                </div>
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
