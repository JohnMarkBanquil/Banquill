import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Artist {
    id: number;
    artist_code: string;
    artist_name: string;
}

interface Track {
    id: number;
    track_title: string;
    track_isrc: string;
    artist_id: number;
}

interface Props {
    track: Track;
    artists: Artist[];
}

export default function EditTrack({ track, artists }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        track_title: track.track_title,
        track_isrc: track.track_isrc,
        artist_id: String(track.artist_id),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/music-tracks/${track.id}`);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Music Tracks', href: '/music-tracks' },
        { title: 'Edit Track', href: `/music-tracks/${track.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Music Track" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">
                <div className="mx-auto max-w-3xl">

                    <Link
                        href="/music-tracks"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                    >
                        <ArrowLeft size={17} />
                        Back to Music Tracks
                    </Link>

                    <h1 className="text-3xl font-bold">Edit Music Track</h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Update the song information.
                    </p>

                    <form
                        onSubmit={submit}
                        className="mt-7 space-y-6 rounded-2xl border border-white/10 bg-[#151518] p-6"
                    >
                        <div>
                            <label className="mb-2 block text-sm">
                                Track Title
                            </label>

                            <input
                                value={data.track_title}
                                onChange={(e) =>
                                    setData('track_title', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.track_title && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.track_title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                ISRC Code
                            </label>

                            <input
                                value={data.track_isrc}
                                onChange={(e) =>
                                    setData('track_isrc', e.target.value.toUpperCase())
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 uppercase text-white outline-none focus:border-orange-500"
                            />

                            {errors.track_isrc && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.track_isrc}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Select Artist
                            </label>

                            <select
                                value={data.artist_id}
                                onChange={(e) =>
                                    setData('artist_id', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            >
                                {artists.map((artist) => (
                                    <option key={artist.id} value={artist.id}>
                                        {artist.artist_name} ({artist.artist_code})
                                    </option>
                                ))}
                            </select>

                            {errors.artist_id && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.artist_id}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                            <Link
                                href="/music-tracks"
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-50"
                            >
                                <Save size={17} />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}