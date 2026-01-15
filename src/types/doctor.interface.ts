import { IDoctorSchedule } from './schedule.interface'

export interface IDoctor {
	id?: string
	name: string
	email: string
	password: string
	contactNumber: string
	address?: string
	registrationNumber: string
	experience?: number
	gender: 'MALE' | 'FEMALE'
	appointmentFee: number
	qualification: string
	currentWorkingPlace: string
	designation: string
	specialties?: string[]
	removeSpecialties?: string[]
	profilePhoto?: string
	isDeleted?: boolean
	averageRating?: number
	createdAt?: string
	updatedAt?: string
	doctorSchedules?: IDoctorSchedule[]
	doctorSpecialties?: Array<{
		title: string
		specialtiesId: string
		specialties?: {
			id: string
			title: string
			icon?: string
		}
	}>
}
