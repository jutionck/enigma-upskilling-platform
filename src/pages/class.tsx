import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, Avatar, Button, Textarea } from '@heroui/react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { ChevronDown, ChevronRight } from 'lucide-react'

import DefaultLayout from '@/layouts/default'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuthListener } from '@/hooks/useAuthListener'
import { db } from '@/config/firebase'

const videoSections = [
	{
		section: 'Intro to Cybersecurity',
		videos: [
			{
				id: '1',
				title: 'Introduction to Cybersecurity',
				url: 'https://videos.dyntube.com/iframes/5AXyqbQZUkimLIpPE8CA',
				description: 'Memahami dasar-dasar Cybersecurity.',
			},
		],
	},
]

interface Summary {
	id?: string
	name: string
	email: string
	photoURL?: string
	videoId: string
	videoTitle: string
	summary: string
	timestamp: Date
}

export default function ClassPage() {
	useAuthListener()
	const { user } = useAuthStore()
	const navigate = useNavigate()
	const [selectedVideo, setSelectedVideo] = useState(videoSections[0]?.videos[0] || null)
	const [summary, setSummary] = useState('')
	const [message, setMessage] = useState('')
	const [summaries, setSummaries] = useState<Summary[]>([])

	useEffect(() => {
		if (!user) {
			navigate('/login', { replace: true })
		}
	}, [user, navigate])

	const fetchSummaries = useCallback(async () => {
		if (!user || !selectedVideo) return

		try {
			const summariesCollection = collection(db, 'videoSummaries')
			const q = query(summariesCollection, where('videoId', '==', selectedVideo.id))
			const querySnapshot = await getDocs(q)

			setSummaries(
				querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...(doc.data() as Summary),
					photoURL: doc.data().photoURL || '',
				})),
			)
		} catch (error) {}
	}, [user, selectedVideo])

	useEffect(() => {
		fetchSummaries()
	}, [fetchSummaries])

	const handleSummarySubmit = async () => {
		if (!summary.trim()) {
			setMessage('Harap tulis rangkuman sebelum mengirim.')

			return
		}

		if (!user || !selectedVideo) {
			setMessage('Terjadi kesalahan, silakan coba lagi.')

			return
		}

		const newSummary: Summary = {
			name: user.displayName || 'User',
			email: user.email || 'unknown@example.com',
			photoURL: user.photoURL || '/default-avatar.png',
			videoId: selectedVideo.id,
			videoTitle: selectedVideo.title,
			summary,
			timestamp: new Date(),
		}

		try {
			await addDoc(collection(db, 'videoSummaries'), newSummary)
			setSummaries((prev) => [...prev, newSummary])
			setMessage('Rangkuman telah disimpan.')
			setSummary('')
		} catch (error) {
			setMessage('Terjadi kesalahan saat menyimpan rangkuman.')
		}
	}

	return (
		<DefaultLayout>
			<div className="flex flex-col md:flex-row h-screen p-6 gap-4">
				<VideoSidebar
					selectedVideo={selectedVideo}
					setSelectedVideo={setSelectedVideo}
					videoSections={videoSections}
				/>

				<div className="flex-1">
					{selectedVideo ? (
						<VideoPlayer video={selectedVideo} />
					) : (
						<p className="text-center text-gray-700 dark:text-gray-500">
							Tidak ada video yang tersedia.
						</p>
					)}

					{user?.role !== 'admin' && selectedVideo && (
						<SummaryForm
							handleSubmit={handleSummarySubmit}
							message={message}
							setSummary={setSummary}
							summary={summary}
						/>
					)}

					{user?.role === 'admin' && (
						<SummaryList summaries={summaries} videoTitle={selectedVideo?.title} />
					)}
				</div>
			</div>
		</DefaultLayout>
	)
}

function VideoSidebar({ videoSections, selectedVideo, setSelectedVideo }: any) {
	const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

	const toggleSection = (section: string) => {
		setOpenSections((prev) => ({
			...prev,
			[section]: !prev[section],
		}))
	}

	return (
		<div className="w-full md:w-80 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow">
			{videoSections.map((section: any) => (
				<div key={section.section} className="mt-4">
					{/* Header Section dengan Toggle */}
					<div
						className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-md"
						onClick={() => toggleSection(section.section)}
					>
						<h2 className="font-semibold text-gray-900 dark:text-white">{section.section}</h2>
						{openSections[section.section] ? (
							<ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
						) : (
							<ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
						)}
					</div>

					{/* List Video (Hanya muncul jika section terbuka) */}
					{openSections[section.section] && (
						<div className="pl-4">
							{section.videos.map((video: any) => (
								<Button
									key={video.id}
									className={`w-full mt-2 ${
										selectedVideo?.id === video.id
											? 'bg-blue-600 text-white'
											: 'bg-gray-300 dark:bg-gray-700 dark:text-white'
									}`}
									onPress={() => setSelectedVideo(video)}
								>
									{video.title}
								</Button>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	)
}

function VideoPlayer({ video }: any) {
	return (
		<Card className="shadow-lg bg-gray-100 dark:bg-gray-800">
			<CardHeader className="text-gray-900 dark:text-white">
				{video?.title || 'Judul Tidak Diketahui'}
			</CardHeader>
			<CardBody>
				<iframe
					allowFullScreen
					className="w-full aspect-video rounded-lg"
					sandbox="allow-scripts allow-same-origin allow-presentation"
					src={video?.url || ''}
					title={video?.title || 'Video Tidak Diketahui'}
				/>
			</CardBody>
		</Card>
	)
}

function SummaryForm({ summary, setSummary, handleSubmit, message }: any) {
	return (
		<div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tulis Rangkuman</h3>
			<Textarea
				className="w-full mt-2 bg-white dark:bg-gray-700 dark:text-white"
				placeholder="Tulis rangkuman dari video..."
				value={summary}
				onChange={(e) => setSummary(e.target.value)}
			/>
			<Button className="mt-4 bg-blue-600 text-white" onPress={handleSubmit}>
				Simpan Rangkuman
			</Button>
			{message && <p className="mt-2 text-green-600 dark:text-green-400">{message}</p>}
		</div>
	)
}

function SummaryList({ summaries, videoTitle }: any) {
	return (
		<div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg">
			<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
				Hasil Review User - {videoTitle}
			</h3>
			{summaries.length > 0 ? (
				summaries.map((item: any) => (
					<Card className="max-w-[340px] mb-4">
						<CardHeader className="justify-between">
							<div className="flex gap-5">
								<Avatar
									isBordered
									radius="full"
									size="md"
									src={
										item.photoURL ||
										'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
									}
								/>
								<div className="flex flex-col gap-1 items-start justify-center">
									<h4 className="text-small font-semibold leading-none text-default-600">
										{item.name}
									</h4>
									<h5 className="text-small tracking-tight text-gray-900 dark:text-white">
										@{item.email.split('@')[0]}
									</h5>
								</div>
							</div>
						</CardHeader>
						<CardBody className="px-3 py-0 text-small text-gray-900 dark:text-white mb-4">
							<p>{item.summary}</p>
						</CardBody>
					</Card>
				))
			) : (
				<p className="text-gray-400">Belum ada review untuk video ini.</p>
			)}
		</div>
	)
}
