import AppError from '@utils/AppError.js'
import fetchThis from "@utils/fetchThis.js";

export const ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  HTTP: 'HTTP_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  PARSE: 'PARSE_ERROR',
};

export default async function safefetchThis(url, options) {
  let response;

  try {
    response = await fetchThis(url, options);
  } catch {
    throw new AppError({
      code: ERROR_CODES.NETWORK,
      message: 'Falha de rede',
    });
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new AppError({
      code: ERROR_CODES.PARSE,
      message: 'Resposta inválida',
    });
  }

  if (!response.ok) {
    throw new AppError({
      code: ERROR_CODES.HTTP,
      message: data.message,
      status: response.status,
    });
  }

  return data;
}

