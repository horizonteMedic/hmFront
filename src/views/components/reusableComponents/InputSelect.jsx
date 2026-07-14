export function SelectField({ label, name, value, onChange, options, placeholder = "Seleccionar...", inline = false, labelWidth = "120px" }) {
    if (inline) {
        return (
            <div className="flex items-center gap-4 flex-grow">
                {label && (
                    <label className="font-semibold" style={{ minWidth: labelWidth, maxWidth: labelWidth }}>
                        {label} :
                    </label>
                )}
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
                >
                    <option value="">{placeholder}</option>
                    {options.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>
        );
    }
    return (
        <div className="flex flex-col flex-grow">
            <p className="font-semibold">{label}</p>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="pointer border border-gray-300 px-3 py-2 rounded-md w-full focus:outline-none"
            >
                <option value="">{placeholder}</option>
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                ))}
            </select>
        </div>
    );
}