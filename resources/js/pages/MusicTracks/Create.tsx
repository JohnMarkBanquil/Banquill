import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Music, Save } from 'lucide-react';

interface Artist {
    id: number;
    artist_code: string;
    artist_name: string;
}

interface Props {
    artists: Artist[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Music Tracks', href: '/music-tracks' },
    { title: 'Add Track', href: '/music-tracks/create' },
];

export default function CreateTrack({ artists }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        track_title: '',
        track_isrc: '',
        artist_id: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        post('/music-tracks');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Music Track" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">
                <div className="mx-auto max-w-3xl">

                    <Link
                        href="/music-tracks"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                    >
                        <ArrowLeft size={17} />
                        Back to Music Tracks
                    </Link>

                    <div className="mb-7">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                            <Music className="text-orange-500" size={25} />
                        </div>

                        <h1 className="text-3xl font-bold">
                            Add Music Track
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Register a new song in your music platform.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-2xl border border-white/10 bg-[#151518] p-6"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Track Title
                            </label>

                            <input
                                type="text"
                                value={data.track_title}
                                onChange={(e) =>
                                    setData('track_title', e.target.value)
                                }
                                placeholder="Example: Just the Way You Are"
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.track_title && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.track_title}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                ISRC Code
                            </label>

                            <input
                                type="text"
                                value={data.track_isrc}
                                onChange={(e) =>
                                    setData('track_isrc', e.target.value.toUpperCase())
                                }
                                placeholder="Example: USRC17607839"
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white uppercase outline-none focus:border-orange-500"
                            />

                            {errors.track_isrc && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.track_isrc}
                                </p>
                            )}

                            <p className="mt-2 text-xs text-gray-500">
                                ISRC codes are automatically converted to uppercase.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Select Artist
                            </label>

                            <select
                                value={data.artist_id}
                                onChange={(e) =>
                                    setData('artist_id', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            >
                                <option value="">Choose an artist</option>

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

                            {artists.length === 0 && (
                                <p className="mt-2 text-sm text-yellow-400">
                                    Register an artist before adding a track.
                                </p>
                            )}
                        </div>

                        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                            <p className="text-sm font-semibold text-orange-400">
                                Track Information
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                Each track must have a unique ISRC code and belong to a registered artist.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">
                            <Link
                                href="/music-tracks"
                                className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm text-gray-300"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing || artists.length === 0}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-50"
                            >
                                <Save size={17} />
                                {processing ? 'Saving...' : 'Save Track'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}