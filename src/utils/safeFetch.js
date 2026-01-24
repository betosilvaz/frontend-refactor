import AppError from '@utils/AppError.js'

export const ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  HTTP: 'HTTP_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  PARSE: 'PARSE_ERROR',
};

export default async function safeFetch(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    throw new AppError({
      code: ERROR_CODES.NETWORK,
      message: 'Falha de rede',
    });
  }

  if (!response.ok) {
    throw new AppError({
      code: ERROR_CODES.HTTP,
      message: 'Erro na API',
      status: response.status,
    });
  }

  try {
    return await response.json();
  } catch {
    throw new AppError({
      code: ERROR_CODES.PARSE,
      message: 'Resposta inválida',
    });
  }
}

