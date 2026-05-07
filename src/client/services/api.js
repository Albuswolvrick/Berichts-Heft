const API_BASE = '/api';

/**
 * Generic fetch wrapper with error handling and JSON parsing.
 */
async function request(url, options = {}) {
  const config = {
    credentials: 'include',
    headers: { ...(options.headers || {}) },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${url}`, config);

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() };

  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
}

const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body }),
  put: (url, body) => request(url, { method: 'PUT', body }),
  delete: (url) => request(url, { method: 'DELETE' }),
};

// --- Auth ---
const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

// --- Users ---
const userApi = {
  getMe: () => api.get('/users/me'),
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  updatePassword: (id, password) => api.put(`/users/${id}/password`, { password }),
  remove: (id) => api.delete(`/users/${id}`),
};

// --- Reports (generic factory) ---
function createReportApi(basePath) {
  return {
    list: () => api.get(basePath),
    listAll: (params) => {
      const query = new URLSearchParams(params).toString();
      return api.get(`${basePath}/all${query ? `?${query}` : ''}`);
    },
    getById: (id) => api.get(`${basePath}/${id}`),
    create: (data) => api.post(basePath, data),
    update: (id, data) => api.put(`${basePath}/${id}`, data),
    remove: (id) => api.delete(`${basePath}/${id}`),
  };
}

const dailyReportApi = createReportApi('/daily-reports');
const weeklyReportApi = createReportApi('/weekly-reports');
const monthlyReportApi = createReportApi('/monthly-reports');
const yearlyReportApi = createReportApi('/yearly-reports');

const reportsApi = {
    getAll: (params) => {
        const query = new URLSearchParams(params).toString();
        return api.get(`/reports/all-types${query ? `?${query}` : ''}`);
    },
    remove: (type, id) => api.delete(`/reports/${type.toLowerCase()}/${id}`),
};

export {
  api,
  authApi,
  userApi,
  dailyReportApi,
  weeklyReportApi,
  monthlyReportApi,
  yearlyReportApi,
  reportsApi
};
