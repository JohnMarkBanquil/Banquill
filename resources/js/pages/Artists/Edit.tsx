import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';

interface Artist {
    id: number;
    artist_code: string;
    artist_name: string;
    bank_account: string;
}

interface Props {
    artist: Artist;
}

export default function EditArtist({ artist }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        artist_name: artist.artist_name,
        bank_account: artist.bank_account,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(`/artists/${artist.id}`);
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'Artists', href: '/artists' },
            { title: 'Edit Artist', href: `/artists/${artist.id}/edit` },
        ]}>
            <Head title="Edit Artist" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">
                <div className="mx-auto max-w-3xl">

                    <Link
                        href="/artists"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                    >
                        <ArrowLeft size={17} />
                        Back to Artists
                    </Link>

                    <h1 className="text-3xl font-bold">Edit Artist</h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Update the artist information.
                    </p>

                    <form
                        onSubmit={submit}
                        className="mt-7 space-y-6 rounded-2xl border border-white/10 bg-[#151518] p-6"
                    >
                        <div>
                            <label className="mb-2 block text-sm">
                                Artist Code
                            </label>

                            <input
                                value={artist.artist_code}
                                disabled
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-orange-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Artist Name
                            </label>

                            <input
                                value={data.artist_name}
                                onChange={(e) =>
                                    setData('artist_name', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.artist_name && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.artist_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm">
                                Bank Account
                            </label>

                            <input
                                value={data.bank_account}
                                onChange={(e) =>
                                    setData('bank_account', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.bank_account && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.bank_account}
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 border-t border-white/10 pt-5">
                            <Link
                                href="/artists"
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