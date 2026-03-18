import api from './api';

export const billingApi = {
    getInvoices: () => api.get('/invoices'),
    createInvoice: (data) => api.post('/invoices', data),
};
