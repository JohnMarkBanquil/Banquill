import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Users, Search, Pencil, Trash2, Music } from 'lucide-react';
import { useState } from 'react';

interface Artist {
    id: number;
    artist_code: string;
    artist_name: string;
    bank_account: string;
    created_at: string;
}

interface Props {
    artists: Artist[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Artists', href: '/artists' },
];

export default function ArtistsIndex({ artists }: Props) {
    const [search, setSearch] = useState('');

    const filteredArtists = artists.filter((artist) =>
        `${artist.artist_name} ${artist.artist_code}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    function deleteArtist(id: number) {
        if (confirm('Are you sure you want to delete this artist?')) {
            router.delete(`/artists/${id}`);
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Artist Management" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">

                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-semibold text-orange-500">
                            MUSIC MANAGEMENT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold">
                            Artist Management
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Register and manage your music artists.
                        </p>
                    </div>

                    <Link
                        href="/artists/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-black hover:bg-orange-400"
                    >
                        <Plus size={18} />
                        Register Artist
                    </Link>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-[#151518] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Total Registered Artists
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {artists.length}
                                </h2>
                            </div>

                            <Users size={28} className="text-orange-500" />
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-[#151518] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Artist Records
                                </p>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {filteredArtists.length}
                                </h2>
                            </div>

                            <Music size={28} className="text-orange-500" />
                        </div>
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
                                placeholder="Search artist name or code..."
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
                                    <th className="px-6 py-4">Artist Code</th>
                                    <th className="px-6 py-4">Artist Name</th>
                                    <th className="px-6 py-4">Bank Account</th>
                                    <th className="px-6 py-4">Date Registered</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {filteredArtists.map((artist) => (
                                    <tr key={artist.id} className="hover:bg-white/[0.03]">
                                        <td className="px-6 py-5 font-semibold text-orange-400">
                                            {artist.artist_code}
                                        </td>

                                        <td className="px-6 py-5 font-medium">
                                            {artist.artist_name}
                                        </td>

                                        <td className="px-6 py-5 text-gray-400">
                                            {artist.bank_account}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-gray-400">
                                            {new Date(artist.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/artists/${artist.id}/edit`}
                                                    className="text-blue-400 hover:text-blue-300"
                                                    title="Edit artist"
                                                >
                                                    <Pencil size={18} />
                                                </Link>

                                                <button
                                                    onClick={() => deleteArtist(artist.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                    title="Delete artist"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredArtists.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-12 text-center text-gray-500"
                                        >
                                            No artists found. Register your first artist!
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