const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, fieldErrors, status) {
    super(message);
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

function getCsrfToken() {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith('csrftoken='))
    ?.split('=')[1];
}

function parseErrorBody(body) {
  if (!body) {
    return { message: 'Something went wrong.', fieldErrors: {} };
  }

  if (body.detail) {
    return { message: String(body.detail), fieldErrors: {} };
  }

  const fieldErrors = {};
  let firstMessage = null;

  for (const [key, value] of Object.entries(body)) {
    const messages = Array.isArray(value) ? value : [String(value)];
    if (key === 'non_field_errors') {
      firstMessage = firstMessage ?? messages[0];
    } else {
      fieldErrors[key] = messages;
      firstMessage = firstMessage ?? messages[0];
    }
  }

  return { message: firstMessage ?? 'Validation error.', fieldErrors };
}

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken() ?? '',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const { message, fieldErrors } = parseErrorBody(body);
    throw new ApiError(message, fieldErrors, res.status);
  }

  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export async function ensureCsrfCookie() {
  await apiFetch('/auth/csrf/');
}