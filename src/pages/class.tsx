import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Textarea,
} from '@heroui/react';
import DefaultLayout from '@/layouts/default';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuthListener } from '@/hooks/useAuthListener';
import { db } from '@/config/firebase';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';

const videoSections = [
  {
    section: 'Intro to Cybersecurity',
    videos: [
      {
        id: '1',
        title: 'Introduction to Cybersecurity',
        url: 'https://www.youtube.com/embed/P4vHx4Ym0S8',
        description: 'Memahami dasar-dasar Cybersecurity.',
      },
    ],
  },
];

interface Summary {
  id?: string;
  name: string;
  email: string;
  photoURL?: string;
  videoId: string;
  videoTitle: string;
  summary: string;
  timestamp: Date;
}

export default function ClassPage() {
  useAuthListener();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState(
    videoSections[0]?.videos[0] || null
  );
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');
  const [summaries, setSummaries] = useState<Summary[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const fetchSummaries = useCallback(async () => {
    if (!user || !selectedVideo) return;

    try {
      const summariesCollection = collection(db, 'videoSummaries');
      const q = query(
        summariesCollection,
        where('videoId', '==', selectedVideo.id)
      );
      const querySnapshot = await getDocs(q);

      setSummaries(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Summary),
          photoURL: doc.data().photoURL || '',
        }))
      );
    } catch (error) {
      console.error('Error fetching summaries:', error);
    }
  }, [user, selectedVideo]);

  useEffect(() => {
    fetchSummaries();
  }, [fetchSummaries]);

  const handleSummarySubmit = async () => {
    if (!summary.trim()) {
      setMessage('Harap tulis rangkuman sebelum mengirim.');
      return;
    }

    if (!user || !selectedVideo) {
      setMessage('Terjadi kesalahan, silakan coba lagi.');
      return;
    }

    const newSummary: Summary = {
      name: user.displayName || 'User',
      email: user.email || 'unknown@example.com',
      photoURL: user.photoURL || '/default-avatar.png',
      videoId: selectedVideo.id,
      videoTitle: selectedVideo.title,
      summary,
      timestamp: new Date(),
    };

    try {
      await addDoc(collection(db, 'videoSummaries'), newSummary);
      setSummaries((prev) => [...prev, newSummary]);
      setMessage('Rangkuman telah disimpan.');
      setSummary('');
    } catch (error) {
      console.error('Error submitting summary:', error);
      setMessage('Terjadi kesalahan saat menyimpan rangkuman.');
    }
  };

  return (
    <DefaultLayout>
      <div className='flex flex-col md:flex-row h-screen p-6 gap-4'>
        {/* Sidebar Video List */}
        <VideoSidebar
          videoSections={videoSections}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
        />

        {/* Video Player & Review Section */}
        <div className='flex-1'>
          {selectedVideo ? (
            <VideoPlayer video={selectedVideo} />
          ) : (
            <p className='text-center text-gray-700 dark:text-gray-500'>
              Tidak ada video yang tersedia.
            </p>
          )}

          {/* Form untuk Menulis Review */}
          {user?.role !== 'admin' && selectedVideo && (
            <SummaryForm
              summary={summary}
              setSummary={setSummary}
              handleSubmit={handleSummarySubmit}
              message={message}
            />
          )}

          {/* Admin hanya melihat hasil review berdasarkan video ID */}
          {user?.role === 'admin' && (
            <SummaryList
              summaries={summaries}
              videoTitle={selectedVideo?.title}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}

/* Component untuk Sidebar Video */
function VideoSidebar({ videoSections, selectedVideo, setSelectedVideo }: any) {
  return (
    <div className='w-full md:w-80 bg-gray-200 dark:bg-gray-800 p-4 rounded-lg shadow'>
      <h2 className='text-lg font-semibold text-center text-gray-900 dark:text-white'>
        Course Cybersecurity
      </h2>
      {videoSections.map((section: any) => (
        <div key={section.section} className='mt-4'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            {section.section}
          </h3>
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
      ))}
    </div>
  );
}

/* Component untuk Menampilkan Video */
function VideoPlayer({ video }: any) {
  return (
    <Card className='shadow-lg bg-white bg-gray-100 dark:bg-gray-800'>
      <CardHeader className='text-gray-900 dark:text-white'>
        {video?.title || 'Judul Tidak Diketahui'}
      </CardHeader>
      <CardBody>
        <iframe
          className='w-full aspect-video rounded-lg'
          src={video?.url || ''}
          title={video?.title || 'Video Tidak Diketahui'}
          allowFullScreen
        ></iframe>
      </CardBody>
    </Card>
  );
}

/* Component Form Summary */
function SummaryForm({ summary, setSummary, handleSubmit, message }: any) {
  return (
    <div className='mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
        Tulis Rangkuman
      </h3>
      <Textarea
        className='w-full mt-2 bg-white dark:bg-gray-700 dark:text-white'
        placeholder='Tulis rangkuman dari video...'
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <Button className='mt-4 bg-blue-600 text-white' onPress={handleSubmit}>
        Simpan Rangkuman
      </Button>
      {message && (
        <p className='mt-2 text-green-600 dark:text-green-400'>{message}</p>
      )}
    </div>
  );
}

/* Component List Summary */
function SummaryList({ summaries, videoTitle }: any) {
  return (
    <div className='mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
        Hasil Review User - {videoTitle}
      </h3>
      {summaries.length > 0 ? (
        summaries.map((item: any) => (
          <Card className='max-w-[340px] mb-4'>
            <CardHeader className='justify-between'>
              <div className='flex gap-5'>
                <Avatar
                  isBordered
                  radius='full'
                  size='md'
                  src={
                    item.photoURL ||
                    'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png'
                  }
                />
                <div className='flex flex-col gap-1 items-start justify-center'>
                  <h4 className='text-small font-semibold leading-none text-default-600'>
                    {item.name}
                  </h4>
                  <h5 className='text-small tracking-tight text-gray-900 dark:text-white'>
                    @{item.email.split('@')[0]}
                  </h5>
                </div>
              </div>
            </CardHeader>
            <CardBody className='px-3 py-0 text-small text-gray-900 dark:text-white mb-4'>
              <p>{item.summary}</p>
            </CardBody>
          </Card>
        ))
      ) : (
        <p className='text-gray-400'>Belum ada review untuk video ini.</p>
      )}
    </div>
  );
}
