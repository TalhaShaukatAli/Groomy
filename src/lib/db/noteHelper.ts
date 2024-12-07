import type { BaseNote, DatabaseDataResponse, DatabaseResponse, Note } from '$lib/types';
import API from './api';

/**
 * Abstract base class for managing different types of notes in the application.
 * Provides common methods for retrieving, creating, updating, and deleting notes.
 * @abstract
 */
export abstract class NoteService {
    /**
     * Retrieves a list of notes associated with a specific ID.
     * @abstract
     * @param {number} id - The identifier to retrieve notes for (e.g., service, appointment, or customer ID)
     * @returns {Promise<DatabaseDataResponse<Note[]>>} A promise resolving to a database response with an array of notes
     */
    abstract getNotes(id: number): Promise<DatabaseDataResponse<Note[]>>;

    /**
     * Creates a new note associated with a specific corresponding ID.
     * @abstract
     * @param {number} correspondingID - The ID of the entity the note is associated with
     * @param {BaseNote} noteData - The data for the new note
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response indicating success or failure
     */
    abstract createNote(correspondingID: number, noteData: BaseNote): Promise<DatabaseResponse>;

    /**
     * Retrieves a specific note by its unique identifier.
     * @param {number} noteID - The unique identifier of the note to retrieve
     * @returns {Promise<DatabaseDataResponse<Note>>} A promise resolving to the requested note
     */
    async getNote(noteID: number) {
        let response = await API.GetNoteByID(noteID);
        return response;
    }

    /**
     * Updates an existing note with new information.
     * @param {Note} note - The note with updated information, including its ID
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response indicating update success
     */
    async updateNote(note: Note) {
        let response = await API.UpdateNoteByID(note);
        return response;
    }

    /**
     * Deletes a note by its unique identifier.
     * @param {number} noteID - The unique identifier of the note to delete
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response indicating deletion success
     */
    async deleteNote(noteID: number) {
        let response = await API.DeleteNoteByID(noteID);
        return response;
    }
}

/**
 * Concrete implementation of NoteService for managing service-related notes.
 * @extends NoteService
 */
class ServiceNoteService extends NoteService {
    /**
     * Retrieves notes associated with a specific service.
     * @param {number} id - The service ID to retrieve notes for
     * @returns {Promise<DatabaseDataResponse<Note[]>>} A promise resolving to service notes
     */
    async getNotes(id: number) {
        let response = await API.getServiceNotes(id);
        return response;
    }

    /**
     * Creates a new note for a specific service.
     * @param {number} correspondingID - The service ID to associate the note with
     * @param {BaseNote} noteData - The data for the new service note
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response
     */
    async createNote(correspondingID: number, noteData: BaseNote) {
        let response = await API.createServiceNote(correspondingID, noteData);
        return response;
    }
}

/**
 * Concrete implementation of NoteService for managing appointment-related notes.
 * @extends NoteService
 */
class AppointmentNoteService extends NoteService {
    /**
     * Retrieves notes associated with a specific appointment.
     * @param {number} id - The appointment ID to retrieve notes for
     * @returns {Promise<DatabaseDataResponse<Note[]>>} A promise resolving to appointment notes
     */
    async getNotes(id: number) {
        let response = await API.getAppointmentNotes(id);
        return response;
    }

    /**
     * Creates a new note for a specific appointment.
     * @param {number} correspondingID - The appointment ID to associate the note with
     * @param {BaseNote} noteData - The data for the new appointment note
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response
     */
    async createNote(correspondingID: number, noteData: BaseNote) {
        let response = await API.createAppointmentNote(correspondingID, noteData);
        return response;
    }
}

/**
 * Concrete implementation of NoteService for managing customer-related notes.
 * @extends NoteService
 */
class CustomerNoteService extends NoteService {
    /**
     * Retrieves notes associated with a specific customer.
     * @param {number} id - The customer ID to retrieve notes for
     * @returns {Promise<DatabaseDataResponse<Note[]>>} A promise resolving to customer notes
     */
    async getNotes(id: number) {
        let response = await API.getAppointmentNotes(id);
        return response;
    }

    /**
     * Creates a new note for a specific customer.
     * @param {number} correspondingID - The customer ID to associate the note with
     * @param {BaseNote} noteData - The data for the new customer note
     * @returns {Promise<DatabaseResponse>} A promise resolving to a database response
     */
    async createNote(correspondingID: number, noteData: BaseNote) {
        let response = await API.createAppointmentNote(correspondingID, noteData);
        return response;
    }
}

/**
 * Singleton instance of CustomerNoteService for global access.
 */
export const CustomerNoteServiceSingleton = new CustomerNoteService()

/**
 * Singleton instance of AppointmentNoteService for global access.
 */
export const AppointmentNoteServiceSingleton = new AppointmentNoteService()

/**
 * Singleton instance of ServiceNoteService for global access.
 */
export const ServiceNoteServiceSingleton = new ServiceNoteService()
