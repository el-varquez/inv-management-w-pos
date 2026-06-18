import api from '../../../services/api';
import type { SalesReport, ExpenseReport } from '../../../types';

export interface DateRange {
  from?: string;
  to?: string;
}

export const reportsService = {
  getSalesReport: async (range?: DateRange): Promise<SalesReport> => {
    const { data } = await api.get<SalesReport>('/reports/sales', {
      params: range,
    });
    return data;
  },

  getExpenseReport: async (range?: DateRange): Promise<ExpenseReport> => {
    const { data } = await api.get<ExpenseReport>('/reports/expenses', {
      params: range,
    });
    return data;
  },
};
