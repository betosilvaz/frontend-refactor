import { API_URL } from "@config/api/api.js";
import AppError from "@utils/AppError.js";
import { ERROR_CODES } from "@utils/ErrorCodes.js";

const refreshConfig = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
};

const refreshEndpoint = `${API_URL}/api/auth/refresh`;

function throwUnauthorized() {
    localStorage.removeItem('jwt');
    throw new AppError({
        code: ERROR_CODES.UNAUTHORIZED,
        status: 401,
        message: 'Sessão expirada.',
    });
}

/**
 * Busca dados de um endpoint REST com refresh automático de token em caso de 401.
 * @param {String} url
 * @param {Object} options
 * @returns {Promise<Response>}
 * @throws {AppError} UNAUTHORIZED quando a sessão não pode ser restaurada
 */
async function fetchThis(url, options = {}) {
    let response = await fetch(url, options);
    if (response.status !== 401) return response;

    try {
        const refreshResponse = await fetch(refreshEndpoint, refreshConfig);

        if (!refreshResponse.ok) throwUnauthorized();

        const data = await refreshResponse.json();
        const newAccessToken = data?.jwt;

        if (!newAccessToken || typeof newAccessToken !== 'string') throwUnauthorized();

        localStorage.setItem("jwt", newAccessToken);

        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${newAccessToken}`
            }
        });

        if (response.status === 401) throwUnauthorized();

        return response;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throwUnauthorized();
    }
}

export default fetchThis;
