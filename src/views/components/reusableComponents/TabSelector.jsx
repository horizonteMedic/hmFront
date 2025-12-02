import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function TabSelector({ tieneVista, tabsConfig }) {
    const [activeTab, setActiveTab] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const tabRefs = useRef({});
    const navRef = useRef(null);

    // Helper function to update indicator position
    const updateIndicatorPosition = () => {
        if (activeTab !== -1 && tabRefs.current[activeTab] && navRef.current) {
            const activeTabElement = tabRefs.current[activeTab];
            const navElement = navRef.current;
            const navRect = navElement.getBoundingClientRect();
            const tabRect = activeTabElement.getBoundingClientRect();
            
            setIndicatorStyle({
                left: tabRect.left - navRect.left,
                width: tabRect.width
            });
        }
    };

    useEffect(() => {
        // Find the first available tab based on permissions
        const firstAvailableTab = tabsConfig.find(tab => tieneVista(tab.permission));
        setActiveTab(firstAvailableTab ? firstAvailableTab.id : -1);
    }, []);

    // Update indicator position when active tab changes
    useEffect(() => {
        updateIndicatorPosition();
    }, [activeTab]);

    // Add window resize listener to recalculate indicator position
    useEffect(() => {
        const handleResize = () => {
            updateIndicatorPosition();
        };

        window.addEventListener('resize', handleResize);
        
        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [activeTab]);

    // Get available tabs based on permissions
    const availableTabs = tabsConfig.filter(tab => tieneVista(tab.permission));

    // Get active tab component
    const ActiveComponent = tabsConfig.find(tab => tab.id === activeTab)?.component;

    return (
        <div className="space-y-4">
            <div className="bg-white border-t border-gray-200 rounded-lg p-3">
                {/* Tab Navigation */}
                <nav ref={navRef} className="flex bg-white border-b border-gray-200 mb-4 relative">
                    {/* Animated sliding indicator */}
                    <div 
                        className="absolute bottom-0 h-1 bg-[#233245] transition-all duration-300 ease-in-out"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`
                        }}
                    />
                    {availableTabs.map(tab => (
                        <button
                            key={tab.id}
                            ref={el => tabRefs.current[tab.id] = el}
                            className={`flex-1 px-4 py-3 uppercase tracking-wider transition-colors duration-200 cursor-pointer hover:bg-gray-100 ${activeTab === tab.id
                                ? "font-semibold text[#233245]"
                                : "text-gray-600"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon && (
                                <FontAwesomeIcon icon={tab.icon} className="mr-2" />
                            )}
                            {tab.label}
                        </button>
                    ))}
                </nav>
                {/* Tab Content */}
                <div className="max-w-full">
                    {ActiveComponent && <ActiveComponent tieneVista={tieneVista}/>}
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
