import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Search, Send, Paperclip, Smile, MoreVertical, CheckCheck, Download, User } from 'lucide-react'

interface Message {
	id: number
	sender: 'user' | 'agent'
	senderName: string
	content: string
	timestamp: string
	status?: 'sent' | 'delivered' | 'read'
}

interface Conversation {
	id: number
	userName: string
	userEmail: string
	userAvatar: string
	lastMessage: string
	timestamp: string
	unread: number
	priority: 'normal' | 'high' | 'urgent'
	status: 'active' | 'pending' | 'resolved'
	accountType: string
	totalBookings: number
}

const mockConversations: Conversation[] = [
	{
		id: 1,
		userName: 'John Doe',
		userEmail: 'john@example.com',
		userAvatar: 'JD',
		lastMessage: 'I need help with my booking',
		timestamp: '2m ago',
		unread: 2,
		priority: 'urgent',
		status: 'active',
		accountType: 'VIP',
		totalBookings: 15
	},
	{
		id: 2,
		userName: 'Sarah Smith',
		userEmail: 'sarah@example.com',
		userAvatar: 'SS',
		lastMessage: 'Thank you for your help!',
		timestamp: '15m ago',
		unread: 0,
		priority: 'normal',
		status: 'resolved',
		accountType: 'Premium',
		totalBookings: 8
	},
	{
		id: 3,
		userName: 'Mike Johnson',
		userEmail: 'mike@example.com',
		userAvatar: 'MJ',
		lastMessage: 'When will I receive my refund?',
		timestamp: '1h ago',
		unread: 1,
		priority: 'high',
		status: 'pending',
		accountType: 'Basic',
		totalBookings: 3
	},
]

const mockMessages: Message[] = [
	{
		id: 1,
		sender: 'user',
		senderName: 'John Doe',
		content: 'Hello, I need help with my booking',
		timestamp: '10:30 AM',
		status: 'read'
	},
	{
		id: 2,
		sender: 'agent',
		senderName: 'Support Agent',
		content: 'Hello! I\'d be happy to help you with your booking. Could you please provide your booking reference number?',
		timestamp: '10:31 AM',
		status: 'read'
	},
	{
		id: 3,
		sender: 'user',
		senderName: 'John Doe',
		content: 'Sure, it\'s BK-12345',
		timestamp: '10:32 AM',
		status: 'read'
	},
	{
		id: 4,
		sender: 'agent',
		senderName: 'Support Agent',
		content: 'Thank you! Let me check that for you.',
		timestamp: '10:33 AM',
		status: 'delivered'
	},
]

const cannedResponses = [
	'Thank you for contacting us. How can I help you today?',
	'I\'d be happy to help you with that.',
	'Let me check that information for you.',
	'Your booking has been confirmed.',
	'Is there anything else I can help you with?',
]

export function SupportPage() {
	const { toast } = useToast()
	const [conversations] = useState<Conversation[]>(mockConversations)
	const [activeTab, setActiveTab] = useState('active')
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0])
	const [messages] = useState<Message[]>(mockMessages)
	const [messageInput, setMessageInput] = useState('')
	const [searchTerm, setSearchTerm] = useState('')
	const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'busy'>('online')
	const [showCannedResponses, setShowCannedResponses] = useState(false)

	const filteredConversations = conversations.filter(conv => {
		const matchesSearch = conv.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			conv.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
		const matchesTab = activeTab === 'all' || conv.status === activeTab
		return matchesSearch && matchesTab
	})

	const handleSendMessage = () => {
		if (!messageInput.trim()) return

		toast({
			title: "Message Sent",
			description: "Your message has been delivered",
		})
		setMessageInput('')
	}

	const handleAssignAgent = (agent: string) => {
		toast({
			title: "Conversation Assigned",
			description: `Assigned to ${agent}`,
		})
	}

	const handleChangePriority = (priority: string) => {
		toast({
			title: "Priority Updated",
			description: `Priority changed to ${priority}`,
		})
	}

	const handleResolve = () => {
		toast({
			title: "Conversation Resolved",
			description: "This conversation has been marked as resolved",
		})
	}

	const handleExportConversation = () => {
		toast({
			title: "Exporting Conversation",
			description: "Conversation history is being exported",
		})
	}

	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'urgent': return 'bg-red-500'
			case 'high': return 'bg-yellow-500'
			default: return 'bg-green-500'
		}
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'online': return 'bg-green-500'
			case 'away': return 'bg-yellow-500'
			case 'busy': return 'bg-red-500'
			default: return 'bg-gray-500'
		}
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground">Support</h1>
					<p className="text-muted-foreground mt-2 text-sm sm:text-base">
						Live chat with customers and agents
					</p>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto">
					<span className="text-sm text-gray-600">Status:</span>
					<Select value={agentStatus} onValueChange={(value: 'online' | 'away' | 'busy') => setAgentStatus(value)}>
						<SelectTrigger className="w-32">
							<div className="flex items-center gap-2">
								<div className={`w-2 h-2 rounded-full ${getStatusColor(agentStatus)}`} />
								<SelectValue />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="online">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-green-500" />
									Online
								</div>
							</SelectItem>
							<SelectItem value="away">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-yellow-500" />
									Away
								</div>
							</SelectItem>
							<SelectItem value="busy">
								<div className="flex items-center gap-2">
									<div className="w-2 h-2 rounded-full bg-red-500" />
									Busy
								</div>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Chat Interface */}
			<div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)]">
				{/* Left Sidebar - Conversation List */}
				<Card className="w-full lg:w-96 flex-shrink-0 flex flex-col max-h-[50vh] sm:max-h-[40vh] lg:max-h-full">
					<CardHeader className="pb-3">
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList className="grid w-full grid-cols-4">
								<TabsTrigger value="active">Active</TabsTrigger>
								<TabsTrigger value="pending">Pending</TabsTrigger>
								<TabsTrigger value="resolved">Resolved</TabsTrigger>
								<TabsTrigger value="all">All</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>
					<CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
						{/* Search */}
						<div className="px-4 pb-3">
							<div className="relative">
								<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
								<Input
									placeholder="Search conversations..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>

						{/* Conversation List */}
						<div className="flex-1 overflow-y-auto">
							{filteredConversations.map((conv) => (
								<button
									key={conv.id}
									onClick={() => setSelectedConversation(conv)}
									className={`w-full text-left p-3 border-b hover:bg-gray-50 transition-colors min-h-[70px] ${selectedConversation?.id === conv.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
										}`}
								>
									<div className="flex items-start gap-3">
										<div className="relative">
											<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
												<span className="text-sm font-medium text-indigo-600">
													{conv.userAvatar}
												</span>
											</div>
											<div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getPriorityColor(conv.priority)}`} />
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h4 className="font-semibold text-sm truncate">{conv.userName}</h4>
												<span className="text-xs text-gray-500 flex-shrink-0">{conv.timestamp}</span>
											</div>
											<p className="text-sm text-gray-600 truncate mb-1">{conv.lastMessage}</p>
											<div className="flex items-center gap-2">
												<Badge variant="secondary" className="text-xs">
													{conv.accountType}
												</Badge>
												{conv.unread > 0 && (
													<Badge className="bg-primary text-white text-xs">
														{conv.unread} new
													</Badge>
												)}
											</div>
										</div>
									</div>
								</button>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Right Panel - Chat */}
				<Card className="flex-1 flex flex-col">
					{selectedConversation ? (
						<>
							{/* Chat Header */}
							<CardHeader className="border-b">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
											<span className="text-sm font-medium text-indigo-600">
												{selectedConversation.userAvatar}
											</span>
										</div>
										<div>
											<h3 className="font-semibold">{selectedConversation.userName}</h3>
											<div className="flex items-center gap-2 text-sm text-gray-600">
												<span>{selectedConversation.userEmail}</span>
												<span>•</span>
												<span>{selectedConversation.totalBookings} bookings</span>
											</div>
										</div>
									</div>

									<div className="flex items-center gap-2">
										<Select onValueChange={handleAssignAgent}>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Assign" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="agent1">Agent 1</SelectItem>
												<SelectItem value="agent2">Agent 2</SelectItem>
												<SelectItem value="agent3">Agent 3</SelectItem>
											</SelectContent>
										</Select>

										<Select onValueChange={handleChangePriority}>
											<SelectTrigger className="w-32">
												<SelectValue placeholder="Priority" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="normal">Normal</SelectItem>
												<SelectItem value="high">High</SelectItem>
												<SelectItem value="urgent">Urgent</SelectItem>
											</SelectContent>
										</Select>

										<Button variant="outline" size="sm" onClick={handleResolve}>
											Resolve
										</Button>

										<Button variant="outline" size="sm" onClick={handleExportConversation}>
											<Download className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</CardHeader>

							{/* Messages */}
							<CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
								{messages.map((message) => (
									<div
										key={message.id}
										className={`flex gap-3 ${message.sender === 'agent' ? 'flex-row-reverse' : ''}`}
									>
										<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
											<User className="h-4 w-4 text-gray-600" />
										</div>

										<div className={`flex flex-col ${message.sender === 'agent' ? 'items-end' : 'items-start'} max-w-[70%]`}>
											<div className="text-xs text-gray-500 mb-1">
												{message.senderName} • {message.timestamp}
											</div>
											<div
												className={`px-4 py-2 rounded-lg ${message.sender === 'agent'
													? 'bg-primary text-white'
													: 'bg-gray-100 text-gray-900'
													}`}
											>
												{message.content}
											</div>
											{message.sender === 'agent' && message.status && (
												<div className="flex items-center gap-1 mt-1">
													{message.status === 'read' && (
														<CheckCheck className="h-3 w-3 text-blue-500" />
													)}
													{message.status === 'delivered' && (
														<CheckCheck className="h-3 w-3 text-gray-400" />
													)}
													<span className="text-xs text-gray-500 capitalize">{message.status}</span>
												</div>
											)}
										</div>
									</div>
								))}

								<div className="text-center text-xs text-gray-500 italic">
									User is typing...
								</div>
							</CardContent>

							{/* Message Input */}
							<div className="border-t p-4">
								{showCannedResponses && (
									<div className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
										<div className="text-xs font-semibold text-gray-700 mb-2">Quick Responses</div>
										{cannedResponses.map((response, idx) => (
											<button
												key={idx}
												onClick={() => {
													setMessageInput(response)
													setShowCannedResponses(false)
												}}
												className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded transition-colors"
											>
												{response}
											</button>
										))}
									</div>
								)}

								<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-2">
									<div className="flex-1">
										<Input
											placeholder="Type your message..."
											value={messageInput}
											onChange={(e) => setMessageInput(e.target.value)}
											onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
											className="resize-none text-sm w-full"
										/>
									</div>

									<div className="flex gap-1 justify-end sm:justify-start">
										<Button
											variant="outline"
											size="sm"
											onClick={() => setShowCannedResponses(!showCannedResponses)}
											title="Canned responses"
											className="hidden sm:inline-flex"
										>
											<MoreVertical className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm" title="Attach file" className="hidden sm:inline-flex">
											<Paperclip className="h-4 w-4" />
										</Button>
										<Button variant="outline" size="sm" title="Emoji" className="hidden sm:inline-flex">
											<Smile className="h-4 w-4" />
										</Button>
										<Button onClick={handleSendMessage} size="sm" className="w-full sm:w-auto">
											<Send className="h-4 w-4 sm:mr-1" />
											<span className="hidden sm:inline">Send</span>
										</Button>
									</div>
								</div>
							</div>
						</>
					) : (
						<div className="flex-1 flex items-center justify-center text-gray-500">
							Select a conversation to start chatting
						</div>
					)}
				</Card>
			</div>
		</div>
	)
}
