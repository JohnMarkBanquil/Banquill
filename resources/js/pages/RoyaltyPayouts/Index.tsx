
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Wallet } from 'lucide-react';

type Payout = {
    id: number;
    total_streams: number;
    gross_earnings: string;
    platform_commission: string;
    net_payout: string;
    payout_status: string;
    music_track: {
        track_title: string;
        track_isrc: string;
        artist: {
            artist_name: string;
        };
    };
};

export default function Index({ payouts }: { payouts: Payout[] }) {
    const deletePayout = (id: number) => {
        if (confirm('Are you sure you want to delete this payout?')) {
            router.delete(`/royalty-payouts/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Royalty Payouts" />

            <div className="min-h-screen space-y-6 bg-[#09090b] p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Royalty Payouts</h1>
                        <p className="mt-1 text-gray-400">
                            Manage artist royalty payments.
                        </p>
                    </div>

                    <Link
                        href="/royalty-payouts/create"
                        className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black hover:bg-orange-400"
                    >
                        <Plus size={18} /> Add Payout
                    </Link>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                    <div className="mb-5 flex items-center gap-3">
                        <Wallet className="text-orange-500" size={25} />
                        <div>
                            <h2 className="font-semibold">Payout History</h2>
                            <p className="text-sm text-gray-400">
                                {payouts.length} recorded payouts
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-zinc-700 text-gray-400">
                                <tr>
                                    <th className="p-3">Artist</th>
                                    <th className="p-3">Track</th>
                                    <th className="p-3">Streams</th>
                                    <th className="p-3">Gross</th>
                                    <th className="p-3">Commission</th>
                                    <th className="p-3">Net Payout</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="border-b border-zinc-800">
                                        <td className="p-3">
                                            {payout.music_track?.artist?.artist_name}
                                        </td>
                                        <td className="p-3">
                                            {payout.music_track?.track_title}
                                        </td>
                                        <td className="p-3">
                                            {Number(payout.total_streams).toLocaleString()}
                                        </td>
                                        <td className="p-3">
                                            ₱{Number(payout.gross_earnings).toFixed(2)}
                                        </td>
                                        <td className="p-3">
                                            ₱{Number(payout.platform_commission).toFixed(2)}
                                        </td>
                                        <td className="p-3 font-semibold text-green-400">
                                            ₱{Number(payout.net_payout).toFixed(2)}
                                        </td>
                                        <td className="p-3">
                                            <span className={`rounded-full px-3 py-1 text-xs ${payout.payout_status === 'Paid'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {payout.payout_status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-3">
                                                <Link
                                                    href={`/royalty-payouts/${payout.id}/edit`}
                                                    className="text-orange-400 hover:text-orange-300"
                                                >
                                                    <Pencil size={17} />
                                                </Link>
                                                <button
                                                    onClick={() => deletePayout(payout.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {payouts.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="p-8 text-center text-gray-400">
                                            No payout records yet.
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
