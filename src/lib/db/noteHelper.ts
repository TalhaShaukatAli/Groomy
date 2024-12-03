import type { BaseNote, DatabaseDataResponse, DatabaseResponse, Note } from '$lib/types';
import API from './api';

export abstract class NoteService {
	abstract getNotes(id: number): Promise<DatabaseDataResponse<Note[]>>;
	abstract createNote(correspondingID: number, noteData: BaseNote): Promise<DatabaseResponse>;

	async getNote(noteID: number) {
		let response = await API.GetNoteByID(noteID);
		return response;
	}

	async updateNote(note: Note) {
		let response = await API.UpdateNoteByID(note);
		return response;
	}

	async deleteNote(noteID: number) {
		let response = await API.DeleteNoteByID(noteID);
		return response;
	}
}

class ServiceNoteService extends NoteService {
	async getNotes(id: number) {
		let response = await API.getServiceNotes(id);
		return response;
	}

	async createNote(correspondingID: number, noteData: BaseNote) {
		let response = await API.createServiceNote(correspondingID, noteData);
		return response;
	}
}

class AppointmentNoteService extends NoteService {
	async getNotes(id: number) {
		let response = await API.getAppointmentNotes(id);
		return response;
	}

	async createNote(correspondingID: number, noteData: BaseNote) {
		let response = await API.createAppointmentNote(correspondingID, noteData);
		return response;
	}
}

class CustomerNoteService extends NoteService {
	async getNotes(id: number) {
		let response = await API.getAppointmentNotes(id);
		return response;
	}

	async createNote(correspondingID: number, noteData: BaseNote) {
		let response = await API.createAppointmentNote(correspondingID, noteData);
		return response;
	}
}

export const CustomerNoteServiceSingleton = new CustomerNoteService()
export const AppointmentNoteServiceSingleton = new AppointmentNoteService()
export const ServiceNoteServiceSingleton = new ServiceNoteService()
