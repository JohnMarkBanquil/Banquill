
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calculator, Wallet } from 'lucide-react';

type Track = {
    id: number;
    track_title: string;
    track_isrc: string;
    artist: {
        artist_name: string;
    };
};

type Props = {
    tracks: Track[];
};

export default function Create({ tracks }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        track_id: '',
        total_streams: '',
        rate_per_stream: '',
        platform_commission: '',
        payout_status: 'Pending',
    });

    const streams = Number(data.total_streams) || 0;
    const rate = Number(data.rate_per_stream) || 0;
    const commission = Number(data.platform_commission) || 0;

    const gross = Math.round(streams * rate * 100) / 100;
    const net = Math.round((gross - commission) * 100) / 100;

    const canSubmit =
        Number(data.track_id) > 0 &&
        streams >= 10000 &&
        rate >= 0 &&
        data.rate_per_stream !== '' &&
        commission >= 0 &&
        data.platform_commission !== '' &&
        commission <= gross;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post('/royalty-payouts');
    };

    const money = (value: number) =>
        `₱${value.toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    return (
        <AppLayout>
            <Head title="Add Royalty Payout" />

            <div className="min-h-screen space-y-6 bg-[#09090b] p-6 text-white">
                <div className="flex items-center gap-3">
                    <Link
                        href="/royalty-payouts"
                        className="rounded-lg border border-zinc-700 p-2 hover:bg-zinc-800"
                    >
                        <ArrowLeft size={20} />
                    </Link>

                    <div>
                        <h1 className="text-3xl font-bold">Add Royalty Payout</h1>
                        <p className="text-gray-400">
                            Calculate and record artist earnings.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold">Payout Information</h2>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Select Music Track
                            </label>

                            <select
                                value={data.track_id}
                                onChange={(e) => setData('track_id', e.target.value)}
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
                            >
                                <option value="">Choose a music track</option>

                                {tracks.map((track) => (
                                    <option key={track.id} value={track.id}>
                                        {track.track_title} - {track.artist?.artist_name}
                                    </option>
                                ))}
                            </select>

                            {errors.track_id && (
                                <p className="mt-1 text-sm text-red-400">{errors.track_id}</p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Total Streams
                            </label>

                            <input
                                type="number"
                                min="10000"
                                value={data.total_streams}
                                onChange={(e) => setData('total_streams', e.target.value)}
                                placeholder="Enter total streams"
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
                            />

                            {errors.total_streams && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.total_streams}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                                Minimum required: 10,000 streams.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Rate Per Stream (₱)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.000001"
                                value={data.rate_per_stream}
                                onChange={(e) => setData('rate_per_stream', e.target.value)}
                                placeholder="Example: 0.005"
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
                            />

                            {errors.rate_per_stream && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.rate_per_stream}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Platform Commission (₱)
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.platform_commission}
                                onChange={(e) => setData('platform_commission', e.target.value)}
                                placeholder="Enter commission amount"
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
                            />

                            {errors.platform_commission && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.platform_commission}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-gray-300">
                                Payout Status
                            </label>

                            <select
                                value={data.payout_status}
                                onChange={(e) => setData('payout_status', e.target.value)}
                                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                            </select>

                            {errors.payout_status && (
                                <p className="mt-1 text-sm text-red-400">
                                    {errors.payout_status}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!canSubmit || processing}
                            className="w-full rounded-lg bg-orange-500 p-3 font-semibold text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {processing ? 'Saving...' : 'Save Royalty Payout'}
                        </button>
                    </div>

                    <div className="h-fit space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                        <div className="flex items-center gap-2">
                            <Calculator className="text-orange-500" />
                            <h2 className="font-semibold">Earnings Calculator</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-400">Total Streams</p>
                                <p className="text-xl font-semibold">
                                    {streams.toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Gross Earnings</p>
                                <p className="text-xl font-semibold">{money(gross)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Platform Commission</p>
                                <p className="text-xl font-semibold text-red-400">
                                    -{money(commission)}
                                </p>
                            </div>

                            <div className="border-t border-zinc-700 pt-4">
                                <p className="text-sm text-gray-400">Net Payout</p>
                                <p className="text-3xl font-bold text-green-400">
                                    {money(net)}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-lg bg-zinc-800 p-3 text-sm text-gray-300">
                            <Wallet className="mb-2 text-orange-500" size={20} />
                            Gross = Streams × Rate
                            <br />
                            Net = Gross − Commission
                        </div>

                        {streams > 0 && streams < 10000 && (
                            <p className="text-sm text-red-400">
                                Payout blocked: at least 10,000 streams are required.
                            </p>
                        )}

                        {commission > gross && (
                            <p className="text-sm text-red-400">
                                Commission cannot exceed gross earnings.
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
