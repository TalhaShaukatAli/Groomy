import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BaseNote, Note } from '$lib/types';
import { AppointmentNoteServiceSingleton, CustomerNoteServiceSingleton, ServiceNoteServiceSingleton } from './noteHelper';

// Mock the API module
vi.mock('./api', () => ({
    default: {
        GetNoteByID: vi.fn(),
        UpdateNoteByID: vi.fn(),
        DeleteNoteByID: vi.fn(),
        getServiceNotes: vi.fn(),
        createServiceNote: vi.fn(),
        getAppointmentNotes: vi.fn(),
        createAppointmentNote: vi.fn()
    }
}));

// Import API after mocking
import API from './api';

describe('NoteService Abstract Class Methods', () => {
    // Test implementations using ServiceNoteService instance
    const noteService = ServiceNoteServiceSingleton;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('getNote', () => {
        it('should successfully retrieve a note by ID', async () => {
            const mockNote = {
                id: 1,
                title: 'Test Note',
                note: 'Test content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.GetNoteByID).mockResolvedValueOnce({
                success: true,
                data: mockNote,
                message: 'Note retrieved'
            });

            const result = await noteService.getNote(1);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockNote);
            expect(API.GetNoteByID).toHaveBeenCalledWith(1);
        });

        it('should handle failure to retrieve a note', async () => {
            vi.mocked(API.GetNoteByID).mockResolvedValueOnce({
                success: false,
                message: 'Note not found'
            });

            const result = await noteService.getNote(1);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Note not found');
            expect(API.GetNoteByID).toHaveBeenCalledWith(1);
        });
    });

    describe('updateNote', () => {
        it('should successfully update a note', async () => {
            const mockNote: Note = {
                id: 1,
                title: 'Updated Note',
                note: 'Updated content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.UpdateNoteByID).mockResolvedValueOnce({
                success: true,
                message: 'Note updated'
            });

            const result = await noteService.updateNote(mockNote);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Note updated');
            expect(API.UpdateNoteByID).toHaveBeenCalledWith(mockNote);
        });

        it('should handle failure to update a note', async () => {
            const mockNote: Note = {
                id: 1,
                title: 'Updated Note',
                note: 'Updated content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.UpdateNoteByID).mockResolvedValueOnce({
                success: false,
                message: 'Failed to update note'
            });

            const result = await noteService.updateNote(mockNote);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to update note');
            expect(API.UpdateNoteByID).toHaveBeenCalledWith(mockNote);
        });
    });

    describe('deleteNote', () => {
        it('should successfully delete a note', async () => {
            vi.mocked(API.DeleteNoteByID).mockResolvedValueOnce({
                success: true,
                message: 'Note deleted'
            });

            const result = await noteService.deleteNote(1);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Note deleted');
            expect(API.DeleteNoteByID).toHaveBeenCalledWith(1);
        });

        it('should handle failure to delete a note', async () => {
            vi.mocked(API.DeleteNoteByID).mockResolvedValueOnce({
                success: false,
                message: 'Failed to delete note'
            });

            const result = await noteService.deleteNote(1);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to delete note');
            expect(API.DeleteNoteByID).toHaveBeenCalledWith(1);
        });
    });
});

describe('ServiceNoteService', () => {
    const serviceNoteService = ServiceNoteServiceSingleton;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getNotes', () => {
        it('should successfully retrieve service notes', async () => {
            const mockNotes = [
                {
                    id: 1,
                    title: 'Service Note 1',
                    note: 'Content 1',
                    createdDate: Date.now(),
                    deleted: 0
                }
            ];

            vi.mocked(API.getServiceNotes).mockResolvedValueOnce({
                success: true,
                data: mockNotes,
                message: 'Notes retrieved'
            });

            const result = await serviceNoteService.getNotes(1);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockNotes);
            expect(API.getServiceNotes).toHaveBeenCalledWith(1);
        });

        it('should handle failure to retrieve service notes', async () => {
            vi.mocked(API.getServiceNotes).mockResolvedValueOnce({
                success: false,
                message: 'Failed to retrieve notes'
            });

            const result = await serviceNoteService.getNotes(1);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to retrieve notes');
            expect(API.getServiceNotes).toHaveBeenCalledWith(1);
        });
    });

    describe('createNote', () => {
        it('should successfully create a service note', async () => {
            const mockNote: BaseNote = {
                title: 'New Service Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createServiceNote).mockResolvedValueOnce({
                success: true,
                message: 'Note created'
            });

            const result = await serviceNoteService.createNote(1, mockNote);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Note created');
            expect(API.createServiceNote).toHaveBeenCalledWith(1, mockNote);
        });

        it('should handle failure to create a service note', async () => {
            const mockNote: BaseNote = {
                title: 'New Service Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createServiceNote).mockResolvedValueOnce({
                success: false,
                message: 'Failed to create note'
            });

            const result = await serviceNoteService.createNote(1, mockNote);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to create note');
            expect(API.createServiceNote).toHaveBeenCalledWith(1, mockNote);
        });
    });
});

describe('AppointmentNoteService', () => {
    const appointmentNoteService = AppointmentNoteServiceSingleton;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getNotes', () => {
        it('should successfully retrieve appointment notes', async () => {
            const mockNotes = [
                {
                    id: 1,
                    title: 'Appointment Note 1',
                    note: 'Content 1',
                    createdDate: Date.now(),
                    deleted: 0
                }
            ];

            vi.mocked(API.getAppointmentNotes).mockResolvedValueOnce({
                success: true,
                data: mockNotes,
                message: 'Notes retrieved'
            });

            const result = await appointmentNoteService.getNotes(1);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockNotes);
            expect(API.getAppointmentNotes).toHaveBeenCalledWith(1);
        });

        it('should handle failure to retrieve appointment notes', async () => {
            vi.mocked(API.getAppointmentNotes).mockResolvedValueOnce({
                success: false,
                message: 'Failed to retrieve notes'
            });

            const result = await appointmentNoteService.getNotes(1);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to retrieve notes');
            expect(API.getAppointmentNotes).toHaveBeenCalledWith(1);
        });
    });

    describe('createNote', () => {
        it('should successfully create an appointment note', async () => {
            const mockNote: BaseNote = {
                title: 'New Appointment Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createAppointmentNote).mockResolvedValueOnce({
                success: true,
                message: 'Note created'
            });

            const result = await appointmentNoteService.createNote(1, mockNote);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Note created');
            expect(API.createAppointmentNote).toHaveBeenCalledWith(1, mockNote);
        });

        it('should handle failure to create an appointment note', async () => {
            const mockNote: BaseNote = {
                title: 'New Appointment Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createAppointmentNote).mockResolvedValueOnce({
                success: false,
                message: 'Failed to create note'
            });

            const result = await appointmentNoteService.createNote(1, mockNote);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to create note');
            expect(API.createAppointmentNote).toHaveBeenCalledWith(1, mockNote);
        });
    });
});

describe('CustomerNoteService', () => {
    const customerNoteService = CustomerNoteServiceSingleton;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getNotes', () => {
        it('should successfully retrieve customer notes', async () => {
            const mockNotes = [
                {
                    id: 1,
                    title: 'Customer Note 1',
                    note: 'Content 1',
                    createdDate: Date.now(),
                    deleted: 0
                }
            ];

            vi.mocked(API.getAppointmentNotes).mockResolvedValueOnce({
                success: true,
                data: mockNotes,
                message: 'Notes retrieved'
            });

            const result = await customerNoteService.getNotes(1);

            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockNotes);
            expect(API.getAppointmentNotes).toHaveBeenCalledWith(1);
        });

        it('should handle failure to retrieve customer notes', async () => {
            vi.mocked(API.getAppointmentNotes).mockResolvedValueOnce({
                success: false,
                message: 'Failed to retrieve notes'
            });

            const result = await customerNoteService.getNotes(1);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to retrieve notes');
            expect(API.getAppointmentNotes).toHaveBeenCalledWith(1);
        });
    });

    describe('createNote', () => {
        it('should successfully create a customer note', async () => {
            const mockNote: BaseNote = {
                title: 'New Customer Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createAppointmentNote).mockResolvedValueOnce({
                success: true,
                message: 'Note created'
            });

            const result = await customerNoteService.createNote(1, mockNote);

            expect(result.success).toBe(true);
            expect(result.message).toBe('Note created');
            expect(API.createAppointmentNote).toHaveBeenCalledWith(1, mockNote);
        });

        it('should handle failure to create a customer note', async () => {
            const mockNote: BaseNote = {
                title: 'New Customer Note',
                note: 'New content',
                createdDate: Date.now(),
                deleted: 0
            };

            vi.mocked(API.createAppointmentNote).mockResolvedValueOnce({
                success: false,
                message: 'Failed to create note'
            });

            const result = await customerNoteService.createNote(1, mockNote);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Failed to create note');
            expect(API.createAppointmentNote).toHaveBeenCalledWith(1, mockNote);
        });
    });
});
