export const imageUrl = (path) =>
    path ? `${import.meta.env.VITE_API_URL}${path}` : null;