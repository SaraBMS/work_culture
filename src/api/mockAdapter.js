import axios from 'axios';

/**
 * Local mock API layer.
 *
 * Serves the JSON files in `public/data` through the real axios pipeline so the
 * whole app works without any backend server. Every axios request whose URL
 * resolves to one of the resources below is handled in memory instead of over
 * the network.
 *
 * Resources (one JSON file each, keyed by the resource name):
 *   - SignUpAPI      users / teammates
 *   - DashboardAPI   goals + percentages
 *   - QuestionAPI    questions & answers
 *   - Notifications  admin notifications / reminders
 *
 * Writes (POST/PUT/DELETE) are kept in memory for the current session.
 */

const DATA_BASE = `${process.env.PUBLIC_URL || ''}/data`;

const RESOURCES = ['SignUpAPI', 'DashboardAPI', 'QuestionAPI', 'Notifications'];

const store = {};
let loadPromise = null;

const loadData = () => {
    if (loadPromise) return loadPromise;

    loadPromise = Promise.all(
        RESOURCES.map(async (resource) => {
            try {
                const response = await fetch(`${DATA_BASE}/${resource}.json`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const json = await response.json();
                store[resource] = Array.isArray(json) ? json : json[resource] || [];
            } catch (error) {
                console.warn(`[mockAPI] Could not load ${resource}: ${error.message}`);
                store[resource] = [];
            }
        })
    ).then(() => store);

    return loadPromise;
};

// Exposed so the data can be re-fetched from disk during development.
export const reloadMockData = () => {
    loadPromise = null;
    return loadData();
};

const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));

const parseBody = (data) => {
    if (data == null) return null;
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch {
            return data;
        }
    }
    return data;
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const makeToken = (email) => `mock.${btoa(String(email || 'guest'))}.${Date.now()}`;

const respond = (status, data, config) => ({
    data,
    status,
    statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
    headers: {},
    config,
    request: {},
});

const mockAdapter = async (config) => {
    await loadData();

    const method = (config.method || 'get').toLowerCase();
    const rawUrl = `${config.baseURL || ''}${config.url || ''}`;
    const path = rawUrl.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];
    const segments = path.split('/').filter(Boolean);

    // --- Auth endpoints (http://localhost:3200/api/auth/*) ---
    if (segments[0] === 'api' && segments[1] === 'auth') {
        const action = segments[2];
        const body = parseBody(config.data) || {};

        if (action === 'register') {
            return respond(201, { message: 'User registered successfully', email: body.email }, config);
        }
        if (action === 'login') {
            return respond(200, { token: makeToken(body.email), email: body.email }, config);
        }
        return respond(404, { error: 'Unknown auth endpoint' }, config);
    }

    const resource = segments[0];
    const id = segments[1] ? decodeURIComponent(segments[1]) : undefined;
    const collection = store[resource];

    // Unknown endpoint: return an empty list so optional callers stay safe.
    if (!collection) {
        return respond(200, [], config);
    }

    const findBySuffix = (suffix) => collection.find((item) => item.id != null && String(item.id).endsWith(suffix));

    switch (method) {
        case 'get': {
            if (id !== undefined) {
                const found = collection.find((item) => String(item.id) === String(id)) || findBySuffix(String(id));
                return respond(200, found ? clone(found) : null, config);
            }
            return respond(200, clone(collection), config);
        }
        case 'post': {
            const body = parseBody(config.data) || {};
            const newItem = { id: body.id !== undefined && body.id !== null ? body.id : generateId(), ...body };
            collection.push(newItem);
            const status = resource === 'Notifications' ? 201 : 200;
            return respond(status, clone(newItem), config);
        }
        case 'put':
        case 'patch': {
            const body = parseBody(config.data) || {};
            const index = collection.findIndex((item) => String(item.id) === String(id));
            if (index === -1) return respond(404, { error: 'Not found' }, config);
            collection[index] = { ...collection[index], ...body, id: collection[index].id };
            return respond(200, clone(collection[index]), config);
        }
        case 'delete': {
            const index = collection.findIndex((item) => String(item.id) === String(id));
            if (index === -1) return respond(404, { error: 'Not found' }, config);
            const [removed] = collection.splice(index, 1);
            return respond(200, clone(removed), config);
        }
        default:
            return respond(200, null, config);
    }
};

// Route every axios instance/request through the mock by default.
axios.defaults.adapter = mockAdapter;

export default mockAdapter;
