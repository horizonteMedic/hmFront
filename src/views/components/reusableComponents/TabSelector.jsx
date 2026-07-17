import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function TabSelector({ tieneVista, tabsConfig }) {
    const [activeTab, setActiveTab] = useState(0);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [fades, setFades] = useState({ left: false, right: false });
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
                // left: tabRect.left - navRect.left,
                left: tabRect.left - navRect.left + navElement.scrollLeft,
                width: tabRect.width
            });
        }
    };

    // Muestra los degradados laterales solo cuando hay contenido oculto
    // hacia ese lado, para insinuar de forma sutil que se puede desplazar.
    const updateFades = () => {
        const navElement = navRef.current;
        if (!navElement) return;
        const { scrollLeft, scrollWidth, clientWidth } = navElement;
        const maxScroll = scrollWidth - clientWidth;
        setFades({
            left: scrollLeft > 1,
            right: scrollLeft < maxScroll - 1
        });
    };

    useEffect(() => {
        // Find the first available tab based on permissions
        const firstAvailableTab = tabsConfig.find(tab => tieneVista(tab.permission));
        setActiveTab(firstAvailableTab ? firstAvailableTab.id : -1);
    }, []);

    // Update indicator position when active tab changes
    useEffect(() => {
        updateIndicatorPosition();
        updateFades();
        if (activeTab !== -1 && tabRefs.current[activeTab]) {
            tabRefs.current[activeTab].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest"
            });
        }
    }, [activeTab]);

    // Add window resize listener to recalculate indicator position
    useEffect(() => {
        const handleResize = () => {
            updateIndicatorPosition();
            updateFades();
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
            <div className="bg-white border-t border-gray-200 rounded-lg px-3">
                {/* Tab Navigation */}
                <div className="relative mb-4">
                    <nav
                        ref={navRef}
                        onScroll={updateFades}
                        className="flex bg-white border-b border-gray-200 relative overflow-x-auto no-scrollbar scroll-smooth"
                    >
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
                                    ? "font-semibold text-[#233245]"
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

                    {/* Degradados suaves que insinúan que hay más pestañas al desplazar */}
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent transition-opacity duration-300 ${fades.left ? "opacity-100" : "opacity-0"}`}
                    />
                    <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent transition-opacity duration-300 ${fades.right ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
                {/* Tab Content */}
                <div className="max-w-full">
                    {ActiveComponent && <ActiveComponent tieneVista={tieneVista} />}
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
