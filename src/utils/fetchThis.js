import { API_URL } from "@config/api/api.js";

const refreshConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
};

const refreshEndpoint = `${API_URL}/api/auth/refresh`;

/**
 * fetchThises data from a REST API endpoint with 
 * @param {String} url 
 * @param {Object} options 
 * @returns 
 */
async function fetchThis(url, options = {}) {
    let response = await fetch(url, options);
    if (response.status === 401) {
        try {
            const refreshResponse = await fetch(refreshEndpoint, refreshConfig);

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                const newAccessToken = data.jwt;
                localStorage.setItem("jwt", newAccessToken);
                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Authorization': `Bearer ${newAccessToken}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem('jwt');
                    location.href = '/login';
                }
            } else {
                localStorage.removeItem('jwt');
                location.href = '/login';
            }
        } catch (error) {
            location.href = '/login';
        }
    }
    return response;
}

export default fetchThis;