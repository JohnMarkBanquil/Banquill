import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, UserPlus, Save } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Artists', href: '/artists' },
    { title: 'Register Artist', href: '/artists/create' },
];

export default function CreateArtist() {
    const { data, setData, post, processing, errors } = useForm({
        artist_name: '',
        bank_account: '',
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/artists');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register Artist" />

            <div className="min-h-screen bg-[#09090b] p-6 text-white">
                <div className="mx-auto max-w-3xl">

                    <Link
                        href="/artists"
                        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500"
                    >
                        <ArrowLeft size={17} />
                        Back to Artists
                    </Link>

                    <div className="mb-7">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                            <UserPlus className="text-orange-500" size={25} />
                        </div>

                        <h1 className="text-3xl font-bold">
                            Register New Artist
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Add an artist to your music streaming platform.
                        </p>
                    </div>

                    <form
                        onSubmit={submit}
                        className="space-y-6 rounded-2xl border border-white/10 bg-[#151518] p-6"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Artist Name
                            </label>

                            <input
                                type="text"
                                value={data.artist_name}
                                onChange={(e) =>
                                    setData('artist_name', e.target.value)
                                }
                                placeholder="Example: Bruno Mars"
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.artist_name && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.artist_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Bank Account Number
                            </label>

                            <input
                                type="text"
                                value={data.bank_account}
                                onChange={(e) =>
                                    setData('bank_account', e.target.value)
                                }
                                placeholder="Enter bank account number"
                                className="w-full rounded-xl border border-white/10 bg-[#202024] px-4 py-3 text-white outline-none focus:border-orange-500"
                            />

                            {errors.bank_account && (
                                <p className="mt-2 text-sm text-red-400">
                                    {errors.bank_account}
                                </p>
                            )}

                            <p className="mt-2 text-xs text-gray-500">
                                Spaces and special characters will be removed when saved.
                            </p>
                        </div>

                        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                            <p className="text-sm font-semibold text-orange-400">
                                Automatic Artist Code
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                An artist code will automatically be generated after registration.
                            </p>
                        </div>

                        <div className="flex flex-col-reverse justify-end gap-3 border-t border-white/10 pt-5 sm:flex-row">

                            <Link
                                href="/artists"
                                className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-medium text-gray-300 hover:bg-white/5"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black hover:bg-orange-400 disabled:opacity-50"
                            >
                                <Save size={17} />
                                {processing ? 'Registering...' : 'Register Artist'}
                            </button>

                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}