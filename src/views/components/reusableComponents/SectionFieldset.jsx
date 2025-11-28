
import { useEffect, useRef, useState } from "react";

export default function SectionFieldset({
    legend,
    children,
    fieldsetClassName = "",
    className = "",
    collapsible = false,
    defaultOpen = true
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const open = collapsible ? isOpen : true;
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState("0px");

    useEffect(() => {
        if (!collapsible) return;
        if (!contentRef.current) return;
        if (open) {
            const measure = () => {
                const h = contentRef.current.scrollHeight;
                setMaxHeight(h + "px");
            };
            measure();
            let ro;
            if (typeof ResizeObserver !== "undefined") {
                ro = new ResizeObserver(() => measure());
                ro.observe(contentRef.current);
            }
            const onWindowResize = () => measure();
            window.addEventListener("resize", onWindowResize);
            return () => {
                window.removeEventListener("resize", onWindowResize);
                if (ro) ro.disconnect();
            };
        } else {
            setMaxHeight("0px");
        }
    }, [open, collapsible, children]);

    const contentSpacing = legend ? (open ? "mb-4" : "mb-0") : (open ? "my-4" : "my-0");
    return (
        <fieldset className={`bg-white border  rounded ${fieldsetClassName}`}>
            {legend ? (
                <legend
                    aria-expanded={open}
                    onClick={collapsible ? () => setIsOpen(!open) : undefined}
                    className={`font-semibold ${open ? "mb-4" : ""} text-[10px] bg-[#233245] py-2 px-4 text-white rounded-t flex items-center justify-between ${collapsible ? "cursor-pointer select-none" : ""}`}
                >
                    <span>{legend}</span>
                    {collapsible ? (
                        <span className="ml-4 text-lg font-bold">{open ? "-" : "+"}</span>
                    ) : null}
                </legend>
            ) : null}
            <div
                ref={contentRef}
                aria-hidden={!open}
                className={`px-4 ${contentSpacing} ${className} ${collapsible ? "transition-all duration-300 ease-in-out overflow-hidden" : ""} ${open ? "opacity-100" : "opacity-0"}`}
                style={collapsible ? { maxHeight: open ? maxHeight : "0px" } : undefined}
            >
                {children}
            </div>
        </fieldset>
    );
}
