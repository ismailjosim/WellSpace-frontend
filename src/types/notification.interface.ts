export type NotificationType =
	| 'APPOINTMENT_BOOKED'
	| 'APPOINTMENT_STATUS_UPDATED'
	| 'PRESCRIPTION_CREATED'
	| 'PAYMENT_COMPLETED'
	| 'SYSTEM'

export interface INotification {
	id: string
	recipientId: string
	type: NotificationType
	title: string
	message: string
	appointmentId?: string | null
	isRead: boolean
	createdAt: string
	updatedAt: string
}

export interface INotificationResponse {
	unreadCount: number
	notifications: INotification[]
}
