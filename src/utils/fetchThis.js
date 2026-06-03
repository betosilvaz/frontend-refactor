import { API_URL } from "@config/api/api.js";

/**
 * fetchThises data from a REST API endpoint with 
 * @param {String} url 
 * @param {Object} options 
 * @returns 
 */
async function fetchThis(url, options = {}) {
    let response = await fetch(url, options);
    if (response.status === 401) {
        console.log("Access token expirado. Tentando renovar...");
        try {
            const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // envia cookies (refresh token) automaticamente
            });

            console.log("Resposta do refresh token:", refreshResponse);

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                const newAccessToken = data.jwt; // pega o access token renovado
                localStorage.setItem("jwt", newAccessToken);
                options.headers = {
                    ...options.headers,
                    'Authorization': `Bearer ${newAccessToken}`
                };
                response = await fetch(url, options);
            } else {
                console.error("Falha ao renovar o token. O usuário precisa fazer login novamente.");
                localStorage.removeItem('jwt'); // remove o access token antigo
                // window.location.href = '/login';
            }
        } catch (error) {
            console.error("Erro na comunicação com o endpoint de refresh token:", error);
        }
    }
    return response;
}
export default fetchThis;