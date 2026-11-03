import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Music, Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Track {
    id: number;
    track_title: string;
    track_isrc: string;
    artist: {
        id: number;
        artist_name: string;
        artist_code: string;
    };
}

interface Props {
    tracks: Track[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Music Tracks', href: '/music-tracks' },
];

export default function TracksIndex({ tracks }: Props) {
    const [search, setSearch] = useState('');

    const filteredTracks = tracks.filter((track) =>
        `${track.track_title} ${track.track_isrc} ${track.artist?.artist_name ?? ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    function deleteTrack(id: number) {
        if (confirm('Are you sure you want to delete this track?')) {
            router.delete(`/music-tracks/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Music Track Management" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-orange-500">
                            MUSIC MANAGEMENT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Music Tracks
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Manage songs and connect them to registered artists.
                        </p>
                    </div>

                    <Link
                        href="/music-tracks/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-black hover:bg-orange-400"
                    >
                        <Plus size={18} />
                        Add Music Track
                    </Link>
                </div>

                <div className="mb-6 rounded-2xl border border-white/10 bg-[#151518] p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">
                                Total Music Tracks
                            </p>

                            <h2 className="mt-2 text-3xl font-bold">
                                {tracks.length}
                            </h2>
                        </div>

                        <Music size={30} className="text-orange-500" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#151518]">

                    <div className="border-b border-white/10 p-5">
                        <div className="relative max-w-md">
                            <Search
                                size={18}
                                className="absolute left-3 top-3 text-gray-500"
                            />

                            <input
                                type="text"
                                placeholder="Search title, ISRC, or artist..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#202024] py-3 pl-10 pr-4 text-sm text-white outline-none focus:border-orange-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#202024] text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Track Title</th>
                                    <th className="px-6 py-4">ISRC Code</th>
                                    <th className="px-6 py-4">Artist</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {filteredTracks.map((track) => (
                                    <tr key={track.id} className="hover:bg-white/[0.03]">
                                        <td className="whitespace-nowrap px-6 py-5 font-semibold">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-orange-500/10 p-2">
                                                    <Music size={18} className="text-orange-500" />
                                                </div>

                                                {track.track_title}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 font-mono text-orange-400">
                                            {track.track_isrc}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-gray-300">
                                            {track.artist?.artist_name ?? 'Unknown artist'}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/music-tracks/${track.id}/edit`}
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    <Pencil size={18} />
                                                </Link>

                                                <button
                                                    onClick={() => deleteTrack(track.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredTracks.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                            No music tracks found. Add your first song!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}