import { environment } from '../../environments/environment';

export const API_CONSTANTS = {
  BASE_URL: environment.apiUrl,
  APPOINTMENTS: {
    GET_ALL: '/appointments',
    GET_BY_ID: (id: number) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE: (id: number) => `/appointments/${id}`,
    DELETE: (id: number) => `/appointments/${id}`
  },
  DOCTORS: {
    GET_ALL: '/doctors'
  }
};