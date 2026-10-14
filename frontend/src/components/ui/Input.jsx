export default function Input({ label, error, id, className = '', ...props }) {
    const inputId = id || props.name;

    return (
        <div className={className}>
            {label && (
                <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-ink">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`w-full rounded-lg border bg-white px-3 py-2 text-ink outline-none transition focus:ring-2 focus:ring-brand-500 ${error ? 'border-danger' : 'border-gray-300'
                    }`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}