
export default function SectionFieldset({
    legend,
    children,
    fieldsetClassName = "",
    className = ""
}) {
    return (
        <fieldset className={`bg-white border  rounded ${fieldsetClassName}`}>
            {legend ? (
                <legend className={`font-semibold mb-4 text-[10px] bg-[#233245] py-2 px-4 text-white rounded-t `}>
                    {legend}
                </legend>
            ) : null}
            <div className={`px-4 ${legend ? "mb-4" : "my-4"} ${className}`}>
                {children}
            </div>
        </fieldset>
    );
}