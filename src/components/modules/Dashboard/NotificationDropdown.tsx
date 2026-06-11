'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { notificationService } from '@/services/notification/notification.service'
import { INotification } from '@/types/notification.interface'
import { Bell, CheckCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const formatNotificationTime = (date: string) =>
	new Date(date).toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})

const NotificationDropdown = () => {
	const [notifications, setNotifications] = useState<INotification[]>([])
	const [unreadCount, setUnreadCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	const visibleUnreadCount = useMemo(
		() => (unreadCount > 9 ? '9+' : unreadCount.toString()),
		[unreadCount],
	)

	useEffect(() => {
		let isMounted = true

		const loadNotifications = async () => {
			try {
				const data = await notificationService.getNotifications()

				if (!isMounted) return

				setNotifications(data.notifications || [])
				setUnreadCount(data.unreadCount || 0)
			} catch (error) {
				console.error(
					'[NotificationDropdown] Failed to load notifications:',
					error,
				)
				// Silently fail - notifications are non-critical
				// Set empty state instead of showing error
				if (isMounted) {
					setNotifications([])
					setUnreadCount(0)
				}
			} finally {
				if (isMounted) {
					setIsLoading(false)
				}
			}
		}

		loadNotifications()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		const eventSource = new EventSource(
			notificationService.getNotificationStreamUrl(),
			{ withCredentials: true },
		)

		eventSource.addEventListener('notification', (event) => {
			const notification = JSON.parse(event.data) as INotification

			setNotifications((current) => [
				notification,
				...current.filter((item) => item.id !== notification.id),
			])
			setUnreadCount((current) => current + 1)
		})

		eventSource.onerror = () => {
			eventSource.close()
		}

		return () => {
			eventSource.close()
		}
	}, [])

	const handleMarkAsRead = async (notification: INotification) => {
		if (notification.isRead) return

		try {
			await notificationService.markNotificationAsRead(notification.id)
			setNotifications((current) =>
				current.map((item) =>
					item.id === notification.id ? { ...item, isRead: true } : item,
				),
			)
			setUnreadCount((current) => Math.max(current - 1, 0))
		} catch (error) {
			console.error(error)
		}
	}

	const handleMarkAllAsRead = async () => {
		if (unreadCount === 0) return

		try {
			await notificationService.markAllNotificationsAsRead()
			setNotifications((current) =>
				current.map((item) => ({ ...item, isRead: true })),
			)
			setUnreadCount(0)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' size='icon' className='relative'>
					<Bell className='h-5 w-5' />
					{unreadCount > 0 && (
						<span className='absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white'>
							{visibleUnreadCount}
						</span>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-80 p-0'>
				<div className='flex items-center justify-between px-3 py-2'>
					<DropdownMenuLabel className='p-0'>Notifications</DropdownMenuLabel>
					<Button
						type='button'
						variant='ghost'
						size='sm'
						className='h-8 gap-1 px-2 text-xs'
						onClick={handleMarkAllAsRead}
						disabled={unreadCount === 0}
					>
						<CheckCheck className='h-4 w-4' />
						Read all
					</Button>
				</div>
				<DropdownMenuSeparator className='m-0' />
				<div className='max-h-96 overflow-y-auto py-1'>
					{isLoading ? (
						<p className='px-3 py-6 text-center text-sm text-muted-foreground'>
							Loading notifications...
						</p>
					) : notifications.length === 0 ? (
						<p className='px-3 py-6 text-center text-sm text-muted-foreground'>
							No notifications yet.
						</p>
					) : (
						notifications.map((notification) => (
							<button
								key={notification.id}
								type='button'
								onClick={() => handleMarkAsRead(notification)}
								className='flex w-full gap-3 px-3 py-3 text-left hover:bg-accent'
							>
								<span
									className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
										notification.isRead ? 'bg-muted' : 'bg-red-500'
									}`}
								/>
								<span className='min-w-0 flex-1'>
									<span className='block text-sm font-medium leading-5'>
										{notification.title}
									</span>
									<span className='mt-1 block text-xs leading-5 text-muted-foreground'>
										{notification.message}
									</span>
									<span className='mt-1 block text-[11px] text-muted-foreground'>
										{formatNotificationTime(notification.createdAt)}
									</span>
								</span>
							</button>
						))
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default NotificationDropdown
