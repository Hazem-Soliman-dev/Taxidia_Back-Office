import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Textarea } from '../components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { useToast } from '../hooks/use-toast'
import { Plus, FileText, Tag, Image, MapPin, Grid3x3, List, Search, Edit, Trash2, Eye, Star } from 'lucide-react'

type ContentType = 'offers' | 'blogs' | 'ads' | 'destinations'
type ViewMode = 'grid' | 'list'

interface Offer {
	id: number
	title: string
	discount: number
	validFrom: string
	validTo: string
	status: 'active' | 'expired' | 'scheduled'
	views: number
}

interface BlogPost {
	id: number
	title: string
	author: string
	category: string
	status: 'draft' | 'published' | 'scheduled'
	publishedDate: string
}

interface Advertisement {
	id: number
	title: string
	placement: string
	clickRate: number
	impressions: number
	status: 'active' | 'paused'
}

interface Destination {
	id: number
	name: string
	description: string
	popularity: number
	views: number
	bookings: number
	revenue: number
	featured: boolean
}

const mockOffers: Offer[] = [
	{ id: 1, title: 'Summer Sale - 30% Off', discount: 30, validFrom: '2024-06-01', validTo: '2024-08-31', status: 'active', views: 1234 },
	{ id: 2, title: 'Early Bird Special', discount: 20, validFrom: '2024-09-01', validTo: '2024-09-30', status: 'scheduled', views: 0 },
]

const mockBlogs: BlogPost[] = [
	{ id: 1, title: 'Top 10 Destinations for 2024', author: 'John Doe', category: 'Travel Tips', status: 'published', publishedDate: '2024-01-15' },
	{ id: 2, title: 'How to Pack Light', author: 'Jane Smith', category: 'Travel Tips', status: 'draft', publishedDate: '' },
]

const mockAds: Advertisement[] = [
	{ id: 1, title: 'Homepage Banner - Summer', placement: 'Homepage Banner', clickRate: 3.2, impressions: 15420, status: 'active' },
	{ id: 2, title: 'Sidebar - Hotel Deals', placement: 'Sidebar', clickRate: 1.8, impressions: 8930, status: 'active' },
]

const mockDestinations: Destination[] = [
	{ id: 1, name: 'Paris, France', description: 'The City of Light', popularity: 95, views: 45230, bookings: 1234, revenue: 125000, featured: true },
	{ id: 2, name: 'Tokyo, Japan', description: 'Modern meets traditional', popularity: 92, views: 38920, bookings: 987, revenue: 98000, featured: true },
	{ id: 3, name: 'New York, USA', description: 'The Big Apple', popularity: 88, views: 35410, bookings: 876, revenue: 87000, featured: false },
]

export function ContentPage() {
	const { toast } = useToast()
	const [activeContent, setActiveContent] = useState<ContentType>('offers')
	const [viewMode, setViewMode] = useState<ViewMode>('grid')
	const [searchTerm, setSearchTerm] = useState('')

	const [offers] = useState<Offer[]>(mockOffers)
	const [blogs] = useState<BlogPost[]>(mockBlogs)
	const [ads] = useState<Advertisement[]>(mockAds)
	const [destinations, setDestinations] = useState<Destination[]>(mockDestinations)

	const [addOfferDialogOpen, setAddOfferDialogOpen] = useState(false)
	const [addBlogDialogOpen, setAddBlogDialogOpen] = useState(false)
	const [addAdDialogOpen, setAddAdDialogOpen] = useState(false)
	const [addDestDialogOpen, setAddDestDialogOpen] = useState(false)

	const [newOffer, setNewOffer] = useState({
		title: '',
		description: '',
		discount: 0,
		validFrom: '',
		validTo: '',
		terms: ''
	})

	const [newBlog, setNewBlog] = useState({
		title: '',
		category: 'Travel Tips',
		content: '',
		metaTitle: '',
		metaDescription: '',
		keywords: '',
		status: 'draft'
	})

	const [newAd, setNewAd] = useState({
		title: '',
		description: '',
		placement: 'Homepage Banner',
		linkUrl: '',
		startDate: '',
		endDate: ''
	})

	const [newDest, setNewDest] = useState({
		name: '',
		description: '',
		imageUrl: ''
	})

	const handleAddOffer = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Offer Created",
			description: `${newOffer.title} has been created successfully.`,
		})
		setAddOfferDialogOpen(false)
		setNewOffer({ title: '', description: '', discount: 0, validFrom: '', validTo: '', terms: '' })
	}

	const handleAddBlog = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Blog Post Created",
			description: `${newBlog.title} has been ${newBlog.status === 'published' ? 'published' : 'saved as draft'}.`,
		})
		setAddBlogDialogOpen(false)
		setNewBlog({ title: '', category: 'Travel Tips', content: '', metaTitle: '', metaDescription: '', keywords: '', status: 'draft' })
	}

	const handleAddAd = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Advertisement Created",
			description: `${newAd.title} has been created successfully.`,
		})
		setAddAdDialogOpen(false)
		setNewAd({ title: '', description: '', placement: 'Homepage Banner', linkUrl: '', startDate: '', endDate: '' })
	}

	const handleAddDestination = (e: React.FormEvent) => {
		e.preventDefault()
		toast({
			title: "Destination Added",
			description: `${newDest.name} has been added successfully.`,
		})
		setAddDestDialogOpen(false)
		setNewDest({ name: '', description: '', imageUrl: '' })
	}

	const toggleFeatured = (id: number) => {
		setDestinations(prev => prev.map(d =>
			d.id === id ? { ...d, featured: !d.featured } : d
		))
		const dest = destinations.find(d => d.id === id)
		toast({
			title: dest?.featured ? "Removed from Featured" : "Added to Featured",
			description: `${dest?.name} has been ${dest?.featured ? 'removed from' : 'added to'} featured destinations`,
		})
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
			case 'published':
				return <Badge className="bg-green-100 text-green-800">{status}</Badge>
			case 'draft':
			case 'paused':
				return <Badge variant="secondary">{status}</Badge>
			case 'scheduled':
				return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>
			case 'expired':
				return <Badge variant="destructive">{status}</Badge>
			default:
				return <Badge>{status}</Badge>
		}
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-foreground">Content Management</h1>
					<p className="text-muted-foreground mt-2 text-sm sm:text-base">
						Manage offers, blogs, advertisements, and destinations
					</p>
				</div>
			</div>

			{/* Sidebar Navigation */}
			<div className="w-full flex-shrink-0">
				<Card>
					<CardContent className="p-0">
						<nav className="flex flex-row gap-1 p-2 overflow-x-auto scroll-container md:justify-evenly">
							{[
								{ id: 'offers' as ContentType, label: 'Offers', icon: Tag, count: offers.length },
								{ id: 'blogs' as ContentType, label: 'Blog', icon: FileText, count: blogs.length },
								{ id: 'ads' as ContentType, label: 'Ads', icon: Image, count: ads.length },
								{ id: 'destinations' as ContentType, label: 'Destination', icon: MapPin, count: destinations.length },
							].map((item) => (
								<button
									key={item.id}
									onClick={() => setActiveContent(item.id)}
									className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap min-w-fit ${activeContent === item.id
										? 'bg-primary/10 text-primary'
										: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
										}`}
								>
									<item.icon className="h-4 w-4 flex-shrink-0" />
									<span>{item.label}</span>
									<Badge variant="secondary" className="text-xs">
										{item.count}
									</Badge>
								</button>
							))}
						</nav>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-col lg:flex-row gap-6">

				{/* Main Content Area */}
				<div className="flex-1 space-y-4">
					{/* Toolbar */}
					<Card>
						<CardContent className="p-3 sm:p-4">
							<div className="flex flex-col gap-4">
								<div className="relative">
									<Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
									<Input
										placeholder={`Search ${activeContent}...`}
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="pl-10 w-full"
									/>
								</div>

								<div className="flex flex-wrap gap-2">
									{activeContent === 'offers' && (
										<div className="flex gap-1 border rounded-md">
											<Button
												variant={viewMode === 'grid' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('grid')}
											>
												<Grid3x3 className="h-4 w-4" />
											</Button>
											<Button
												variant={viewMode === 'list' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('list')}
											>
												<List className="h-4 w-4" />
											</Button>
										</div>
									)}

									{activeContent === 'offers' && (
										<Dialog open={addOfferDialogOpen} onOpenChange={setAddOfferDialogOpen}>
											<DialogTrigger asChild>
												<Button>
													<Plus className="h-4 w-4 mr-2" />
													Add
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-2xl">
												<DialogHeader>
													<DialogTitle>Create New Offer</DialogTitle>
													<DialogDescription>Add a new promotional offer</DialogDescription>
												</DialogHeader>
												<form onSubmit={handleAddOffer}>
													<div className="space-y-4 py-4">
														<div className="space-y-2">
															<Label htmlFor="offer-title">Title</Label>
															<Input
																id="offer-title"
																value={newOffer.title}
																onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
																placeholder="Summer Sale - 30% Off"
																required
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="offer-desc">Description</Label>
															<Textarea
																id="offer-desc"
																value={newOffer.description}
																onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewOffer({ ...newOffer, description: e.target.value })}
																placeholder="Describe the offer..."
																rows={3}
															/>
														</div>
														<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
															<div className="space-y-2">
																<Label htmlFor="offer-discount">Discount (%)</Label>
																<Input
																	id="offer-discount"
																	type="number"
																	min="0"
																	max="100"
																	value={newOffer.discount}
																	onChange={(e) => setNewOffer({ ...newOffer, discount: parseInt(e.target.value) })}
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="offer-from">Valid From</Label>
																<Input
																	id="offer-from"
																	type="date"
																	value={newOffer.validFrom}
																	onChange={(e) => setNewOffer({ ...newOffer, validFrom: e.target.value })}
																	required
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="offer-to">Valid To</Label>
																<Input
																	id="offer-to"
																	type="date"
																	value={newOffer.validTo}
																	onChange={(e) => setNewOffer({ ...newOffer, validTo: e.target.value })}
																	required
																/>
															</div>
														</div>
														<div className="space-y-2">
															<Label htmlFor="offer-terms">Terms & Conditions</Label>
															<Textarea
																id="offer-terms"
																value={newOffer.terms}
																onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewOffer({ ...newOffer, terms: e.target.value })}
																placeholder="Terms and conditions..."
																rows={2}
															/>
														</div>
													</div>
													<DialogFooter>
														<Button type="button" variant="outline" onClick={() => setAddOfferDialogOpen(false)}>
															Cancel
														</Button>
														<Button type="submit">Create Offer</Button>
													</DialogFooter>
												</form>
											</DialogContent>
										</Dialog>
									)}

									{activeContent === 'blogs' && (
										<div className="flex gap-1 border rounded-md">
											<Button
												variant={viewMode === 'grid' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('grid')}
											>
												<Grid3x3 className="h-4 w-4" />
											</Button>
											<Button
												variant={viewMode === 'list' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('list')}
											>
												<List className="h-4 w-4" />
											</Button>
										</div>
									)}

									{activeContent === 'blogs' && (
										<Dialog open={addBlogDialogOpen} onOpenChange={setAddBlogDialogOpen}>
											<DialogTrigger asChild>
												<Button>
													<Plus className="h-4 w-4 mr-2" />
													Add
												</Button>
											</DialogTrigger>
											<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
												<DialogHeader>
													<DialogTitle>Create Blog Post</DialogTitle>
													<DialogDescription>Write a new blog post</DialogDescription>
												</DialogHeader>
												<form onSubmit={handleAddBlog}>
													<div className="space-y-4 py-4">
														<div className="space-y-2">
															<Label htmlFor="blog-title">Title</Label>
															<Input
																id="blog-title"
																value={newBlog.title}
																onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
																placeholder="Top 10 Destinations for 2024"
																required
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="blog-category">Category</Label>
															<Select value={newBlog.category} onValueChange={(value) => setNewBlog({ ...newBlog, category: value })}>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Travel Tips">Travel Tips</SelectItem>
																	<SelectItem value="Destinations">Destinations</SelectItem>
																	<SelectItem value="Hotel Reviews">Hotel Reviews</SelectItem>
																	<SelectItem value="News">News</SelectItem>
																</SelectContent>
															</Select>
														</div>
														<div className="space-y-2">
															<Label htmlFor="blog-content">Content</Label>
															<Textarea
																id="blog-content"
																value={newBlog.content}
																onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewBlog({ ...newBlog, content: e.target.value })}
																placeholder="Write your blog post content..."
																rows={8}
																required
															/>
														</div>
														<div className="space-y-4 pt-4 border-t">
															<h4 className="font-semibold text-sm">SEO Settings</h4>
															<div className="space-y-2">
																<Label htmlFor="blog-meta-title">Meta Title</Label>
																<Input
																	id="blog-meta-title"
																	value={newBlog.metaTitle}
																	onChange={(e) => setNewBlog({ ...newBlog, metaTitle: e.target.value })}
																	placeholder="SEO title"
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="blog-meta-desc">Meta Description</Label>
																<Textarea
																	id="blog-meta-desc"
																	value={newBlog.metaDescription}
																	onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewBlog({ ...newBlog, metaDescription: e.target.value })}
																	placeholder="SEO description"
																	rows={2}
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="blog-keywords">Keywords</Label>
																<Input
																	id="blog-keywords"
																	value={newBlog.keywords}
																	onChange={(e) => setNewBlog({ ...newBlog, keywords: e.target.value })}
																	placeholder="travel, destinations, hotels"
																/>
															</div>
														</div>
														<div className="space-y-2">
															<Label htmlFor="blog-status">Status</Label>
															<Select value={newBlog.status} onValueChange={(value) => setNewBlog({ ...newBlog, status: value })}>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="draft">Draft</SelectItem>
																	<SelectItem value="published">Published</SelectItem>
																	<SelectItem value="scheduled">Scheduled</SelectItem>
																</SelectContent>
															</Select>
														</div>
													</div>
													<DialogFooter>
														<Button type="button" variant="outline" onClick={() => setAddBlogDialogOpen(false)}>
															Cancel
														</Button>
														<Button type="submit">
															{newBlog.status === 'published' ? 'Publish' : 'Save Draft'}
														</Button>
													</DialogFooter>
												</form>
											</DialogContent>
										</Dialog>
									)}

									{activeContent === 'ads' && (
										<div className="flex gap-1 border rounded-md">
											<Button
												variant={viewMode === 'grid' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('grid')}
											>
												<Grid3x3 className="h-4 w-4" />
											</Button>
											<Button
												variant={viewMode === 'list' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('list')}
											>
												<List className="h-4 w-4" />
											</Button>
										</div>
									)}

									{activeContent === 'ads' && (
										<Dialog open={addAdDialogOpen} onOpenChange={setAddAdDialogOpen}>
											<DialogTrigger asChild>
												<Button>
													<Plus className="h-4 w-4 mr-2" />
													Add
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Create Advertisement</DialogTitle>
													<DialogDescription>Add a new advertisement</DialogDescription>
												</DialogHeader>
												<form onSubmit={handleAddAd}>
													<div className="space-y-4 py-4">
														<div className="space-y-2">
															<Label htmlFor="ad-title">Title</Label>
															<Input
																id="ad-title"
																value={newAd.title}
																onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
																placeholder="Summer Campaign"
																required
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="ad-desc">Description</Label>
															<Textarea
																id="ad-desc"
																value={newAd.description}
																onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewAd({ ...newAd, description: e.target.value })}
																placeholder="Ad description..."
																rows={2}
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="ad-placement">Placement</Label>
															<Select value={newAd.placement} onValueChange={(value) => setNewAd({ ...newAd, placement: value })}>
																<SelectTrigger>
																	<SelectValue />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="Homepage Banner">Homepage Banner</SelectItem>
																	<SelectItem value="Sidebar">Sidebar</SelectItem>
																	<SelectItem value="Footer">Footer</SelectItem>
																	<SelectItem value="Popup">Popup</SelectItem>
																</SelectContent>
															</Select>
														</div>
														<div className="space-y-2">
															<Label htmlFor="ad-link">Link URL</Label>
															<Input
																id="ad-link"
																type="url"
																value={newAd.linkUrl}
																onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })}
																placeholder="https://example.com/offer"
																required
															/>
														</div>
														<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
															<div className="space-y-2">
																<Label htmlFor="ad-start">Start Date</Label>
																<Input
																	id="ad-start"
																	type="date"
																	value={newAd.startDate}
																	onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
																	required
																/>
															</div>
															<div className="space-y-2">
																<Label htmlFor="ad-end">End Date</Label>
																<Input
																	id="ad-end"
																	type="date"
																	value={newAd.endDate}
																	onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
																	required
																/>
															</div>
														</div>
													</div>
													<DialogFooter>
														<Button type="button" variant="outline" onClick={() => setAddAdDialogOpen(false)}>
															Cancel
														</Button>
														<Button type="submit">Create Ad</Button>
													</DialogFooter>
												</form>
											</DialogContent>
										</Dialog>
									)}

									{activeContent === 'destinations' && (
										<div className="flex gap-1 border rounded-md">
											<Button
												variant={viewMode === 'grid' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('grid')}
											>
												<Grid3x3 className="h-4 w-4" />
											</Button>
											<Button
												variant={viewMode === 'list' ? 'default' : 'ghost'}
												size="sm"
												onClick={() => setViewMode('list')}
											>
												<List className="h-4 w-4" />
											</Button>
										</div>
									)}

									{activeContent === 'destinations' && (
										<Dialog open={addDestDialogOpen} onOpenChange={setAddDestDialogOpen}>
											<DialogTrigger asChild>
												<Button>
													<Plus className="h-4 w-4 mr-2" />
													Add
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Add Destination</DialogTitle>
													<DialogDescription>Add a new top destination</DialogDescription>
												</DialogHeader>
												<form onSubmit={handleAddDestination}>
													<div className="space-y-4 py-4">
														<div className="space-y-2">
															<Label htmlFor="dest-name">Destination Name</Label>
															<Input
																id="dest-name"
																value={newDest.name}
																onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
																placeholder="Paris, France"
																required
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="dest-desc">Description</Label>
															<Textarea
																id="dest-desc"
																value={newDest.description}
																onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewDest({ ...newDest, description: e.target.value })}
																placeholder="Brief description..."
																rows={3}
																required
															/>
														</div>
														<div className="space-y-2">
															<Label htmlFor="dest-image">Image URL</Label>
															<Input
																id="dest-image"
																type="url"
																value={newDest.imageUrl}
																onChange={(e) => setNewDest({ ...newDest, imageUrl: e.target.value })}
																placeholder="https://example.com/image.jpg"
															/>
														</div>
													</div>
													<DialogFooter>
														<Button type="button" variant="outline" onClick={() => setAddDestDialogOpen(false)}>
															Cancel
														</Button>
														<Button type="submit">Add Destination</Button>
													</DialogFooter>
												</form>
											</DialogContent>
										</Dialog>
									)}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Content Display */}
					{activeContent === 'offers' && (
						<div className={viewMode === 'grid' ? 'flex gap-3 overflow-x-auto pb-2 scroll-container sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible sm:pb-0' : 'space-y-3'}>
							{offers.filter(o => o.title.toLowerCase().includes(searchTerm.toLowerCase())).map((offer) => (
								<Card key={offer.id} className="min-w-[320px] flex-shrink-0 sm:min-w-0 hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<div className="min-w-0 flex-1">
														<CardTitle className="text-lg leading-tight truncate">{offer.title}</CardTitle>
														<CardDescription className="text-sm mt-1 text-gray-600">
															{offer.validFrom} - {offer.validTo}
														</CardDescription>
													</div>
												</div>
												<div className="flex items-center justify-between">
													{getStatusBadge(offer.status)}
													<Badge className="bg-primary text-white text-md font-bold px-3 py-1">
														{offer.discount}%
													</Badge>
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-0 space-y-4">
										<div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
											<span className="text-sm font-medium text-gray-600">Views</span>
											<span className="text-lg font-bold text-primary">{offer.views.toLocaleString()}</span>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button variant="outline" size="sm" className="px-3">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{activeContent === 'blogs' && (
						<div className={viewMode === 'grid' ? 'flex gap-3 overflow-x-auto pb-2 scroll-container sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible sm:pb-0' : 'space-y-3'}>
							{blogs.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map((blog) => (
								<Card key={blog.id} className="min-w-[320px] flex-shrink-0 sm:min-w-0 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-200">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<div className="min-w-0 flex-1">
														<CardTitle className="text-lg leading-tight truncate">{blog.title}</CardTitle>
														<div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
															<span className="flex items-center gap-1">
																By {blog.author}
															</span>
															<span>•</span>
															<span className="px-2 py-1 bg-gray-100 rounded-full text-xs">{blog.category}</span>
															{blog.publishedDate && (
																<>
																	<span>•</span>
																	<span>{blog.publishedDate}</span>
																</>
															)}
														</div>
													</div>
												</div>
												<div className="flex items-center justify-between">
													{getStatusBadge(blog.status)}
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-0 space-y-4">
										<div className="p-3 bg-gray-50 rounded-lg">
											<p className="text-sm text-gray-600 line-clamp-2">Blog content preview...</p>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" className="flex-1">
												<Eye className="h-4 w-4 mr-1" />
												Preview
											</Button>
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button variant="outline" size="sm" className="px-3">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{activeContent === 'ads' && (
						<div className={viewMode === 'grid' ? 'flex gap-3 overflow-x-auto pb-2 scroll-container sm:grid sm:grid-cols-2 sm:overflow-x-visible sm:pb-0' : 'space-y-3'}>
							{ads.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())).map((ad) => (
								<Card key={ad.id} className="min-w-[320px] flex-shrink-0 sm:min-w-0 hover:shadow-lg transition-all duration-200 border-l-4 border-l-orange-200">
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<div className="min-w-0 flex-1">
														<CardTitle className="text-lg leading-tight truncate">{ad.title}</CardTitle>
														<CardDescription className="text-sm mt-1 text-gray-600">
															{ad.placement}
														</CardDescription>
													</div>
												</div>
												<div className="flex items-center justify-between">
													{getStatusBadge(ad.status)}
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-0 space-y-4">
										<div className="grid grid-cols-2 gap-3">
											<div className="p-3 bg-gray-50 rounded-lg text-center">
												<div className="text-2xl font-bold text-primary">{ad.clickRate}%</div>
												<div className="text-xs text-gray-600">Click Rate</div>
											</div>
											<div className="p-3 bg-gray-50 rounded-lg text-center">
												<div className="text-2xl font-bold text-gray-900">{ad.impressions.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Impressions</div>
											</div>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
											<Button variant="outline" size="sm" className="px-3">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{activeContent === 'destinations' && (
						<div className={viewMode === 'grid' ? 'flex gap-3 overflow-x-auto pb-2 scroll-container sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-x-visible sm:pb-0' : 'space-y-3'}>
							{destinations.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dest) => (
								<Card key={dest.id} className={`min-w-[320px] flex-shrink-0 sm:min-w-0 hover:shadow-lg transition-all duration-200 border-l-4 ${dest.featured ? 'border-l-yellow-400 border-2 border-primary' : 'border-l-green-200'}`}>
									<CardHeader className="pb-3">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-2">
													<div className="min-w-0 flex-1">
														<div className="flex items-center gap-2">
															<CardTitle className="text-lg leading-tight truncate">{dest.name}</CardTitle>
														</div>
														<CardDescription className="text-sm mt-1 text-gray-600 line-clamp-2">
															{dest.description}
														</CardDescription>
													</div>
												</div>
											</div>
										</div>
									</CardHeader>
									<CardContent className="pt-0 space-y-4">
										<div className="grid grid-cols-3 gap-2">
											<div className="p-2 bg-gray-50 rounded-lg text-center">
												<div className="text-lg font-bold text-gray-900">{dest.views.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Views</div>
											</div>
											<div className="p-2 bg-gray-50 rounded-lg text-center">
												<div className="text-lg font-bold text-gray-900">{dest.bookings.toLocaleString()}</div>
												<div className="text-xs text-gray-600">Bookings</div>
											</div>
											<div className="p-2 bg-gray-50 rounded-lg text-center">
												<div className="text-lg font-bold text-primary">${(dest.revenue / 1000).toFixed(0)}k</div>
												<div className="text-xs text-gray-600">Revenue</div>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-gray-600">Popularity</span>
												<span className="font-semibold">{dest.popularity}%</span>
											</div>
											<div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-full bg-primary rounded-full transition-all duration-300"
													style={{ width: `${dest.popularity}%` }}
												/>
											</div>
										</div>
										<div className="flex gap-2">
											<Button
												variant={dest.featured ? 'default' : 'outline'}
												size="sm"
												className="flex-1"
												onClick={() => toggleFeatured(dest.id)}
											>
												<Star className="h-4 w-4 mr-1" />
												{dest.featured ? 'Featured' : 'Feature'}
											</Button>
											<Button variant="outline" size="sm" className="flex-1">
												<Edit className="h-4 w-4 mr-1" />
												Edit
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
