import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	BaseCustomerRecord,
	BaseAppointmentRecord,
	BaseServiceRecord,
	BaseNote,
} from '$lib/types';
import API from './api';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper function to create mock responses
const createMockResponse = (data: any, status = 200) => {
	return Promise.resolve({
		status,
		json: () => Promise.resolve(data)
	});
};

beforeEach(() => {
	vi.clearAllMocks();
});

afterEach(() => {
	vi.clearAllMocks();
});

describe('API', () => {
	describe('Customer Methods', () => {
		const mockCustomer: BaseCustomerRecord = {
			userID: 1,
			firstName: 'John',
			lastName: 'Doe',
			email: 'john@example.com',
			phone: '1234567890',
			address: {
				street: '123 Test St',
				city: 'Testville',
				state: 'TS',
				zip: 12345
			},
			deleted: 0
		};

		describe('createCustomer', () => {
			it('should successfully create a customer', async () => {
				const mockResponse = { success: true, message: 'Customer created successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.createCustomer(mockCustomer);

				expect(mockFetch).toHaveBeenCalledWith('/api/customers/create', {
					method: 'POST',
					body: JSON.stringify(mockCustomer),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});

			it('should handle errors when creating a customer', async () => {
				mockFetch.mockRejectedValueOnce(new Error('Network error'));

				await expect(API.createCustomer(mockCustomer)).rejects.toThrow('Network error');
			});
		});

		describe('getCustomers', () => {
			it('should successfully retrieve customers', async () => {
				const mockResponse = {
					success: true,
					data: [mockCustomer]
				};
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.getCustomers(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/customers/getCustomersByUserID', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('updateCustomer', () => {
			it('should successfully update a customer', async () => {
				const mockResponse = { success: true, message: 'Customer updated successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.updateCustomer(mockCustomer);

				expect(mockFetch).toHaveBeenCalledWith('/api/customers/update', {
					method: 'POST',
					body: JSON.stringify(mockCustomer),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('deleteCustomer', () => {
			it('should successfully delete a customer', async () => {
				const mockResponse = { success: true, message: 'Customer deleted successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.deleteCustomer(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/customers/delete', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});
	});

	describe('Appointment Methods', () => {
		const mockAppointment: BaseAppointmentRecord = {
			userID: 1,
			customerID: 1,
			title: 'Test Appointment',
			description: 'Test description',
			time: {
				date: '2023-01-01',
				start: '10:00',
				end: '11:00',
				exact: 0
			},
			address: {
				street: '123 Test St',
				city: 'Testville',
				state: 'TS',
				zip: 12345
			},
			deleted: 0
		};

		describe('createAppointment', () => {
			it('should successfully create an appointment', async () => {
				const mockResponse = { success: true, message: 'Appointment created successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.createAppointment(mockAppointment);

				expect(mockFetch).toHaveBeenCalledWith('/api/appointments/create', {
					method: 'POST',
					body: JSON.stringify(mockAppointment),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('getAppointmentsByUserID', () => {
			it('should successfully retrieve appointments by user ID', async () => {
				const mockResponse = {
					success: true,
					data: [mockAppointment]
				};
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.getAppointmentsByUserID(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/appointments/getByUserID', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});
	});

	describe('Service Methods', () => {
		const mockService: BaseServiceRecord = {
			userID: 1,
			name: 'Test Service',
			description: 'Test service description',
			price: 100,
			deleted: 0
		};

		describe('createService', () => {
			it('should successfully create a service', async () => {
				const mockResponse = { success: true, message: 'Service created successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.createService(mockService);

				expect(mockFetch).toHaveBeenCalledWith('/api/services/create', {
					method: 'POST',
					body: JSON.stringify(mockService),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('getServicesByUserID', () => {
			it('should successfully retrieve services by user ID', async () => {
				const mockResponse = {
					success: true,
					data: [mockService]
				};
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.getServicesByUserID(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/services/getServicesByUserID', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});
	});

	describe('Note Methods', () => {
		const mockNote: BaseNote = {
			title: 'Test Note',
			note: 'Test note content',
			createdDate: Date.now(),
			deleted: 0
		};

		describe('createCustomerNote', () => {
			it('should successfully create a customer note', async () => {
				const mockResponse = { success: true, message: 'Note created successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.createCustomerNote(1, mockNote);

				expect(mockFetch).toHaveBeenCalledWith('/api/notes/createCustomerNote', {
					method: 'POST',
					body: JSON.stringify([1, mockNote]),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('getCustomerNotes', () => {
			it('should successfully retrieve customer notes', async () => {
				const mockResponse = {
					success: true,
					data: [mockNote]
				};
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.getCustomerNotes(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/notes/getCustomerNotes', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});

		describe('DeleteNoteByID', () => {
			it('should successfully delete a note', async () => {
				const mockResponse = { success: true, message: 'Note deleted successfully' };
				mockFetch.mockImplementationOnce(() => createMockResponse(mockResponse));

				const result = await API.DeleteNoteByID(1);

				expect(mockFetch).toHaveBeenCalledWith('/api/notes/deleteNoteByID', {
					method: 'POST',
					body: JSON.stringify(1),
					headers: { 'Content-Type': 'application/json' }
				});
				expect(result).toEqual(mockResponse);
			});
		});
	});

	describe('Error Handling', () => {
		it('should handle network errors', async () => {
			mockFetch.mockRejectedValueOnce(new Error('Network error'));

			await expect(API.getCustomers(1)).rejects.toThrow('Network error');
		});

		it('should handle non-JSON responses', async () => {
			mockFetch.mockImplementationOnce(() =>
				Promise.resolve({
					status: 200,
					json: () => Promise.reject(new Error('Invalid JSON'))
				})
			);

			await expect(API.getCustomers(1)).rejects.toThrow('Invalid JSON');
		});

		it('should handle 204 responses', async () => {
			mockFetch.mockImplementationOnce(() =>
				Promise.resolve({
					status: 204
				})
			);

			const result = await API.deleteCustomer(1);
			expect(result).toBe(true);
		});
	});
});
