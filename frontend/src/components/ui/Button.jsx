export default function Button({
    children,
    variant = 'primary',
    loading = false,
    disabled = false,
    className = '',
    ...props
}) {
    const styles = {
        primary: 'bg-brand-700 text-white hover:bg-brand-900',
        gold: 'bg-gold-500 text-ink hover:bg-gold-600',
        outline: 'border border-brand-700 text-brand-700 hover:bg-brand-100',
        danger: 'bg-danger text-white hover:opacity-90',
    };

    return (
        <button
            disabled={loading || disabled}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
            {...props}
        >
            {loading ? 'Please wait...' : children}
        </button>
    );
}