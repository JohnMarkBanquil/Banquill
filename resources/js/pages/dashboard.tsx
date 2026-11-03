
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    Music,
    Wallet,
    TrendingUp,
    Plus,
    ArrowUpRight,
    Disc3,
    Clock,
    CheckCircle2,
    Music2,
    DollarSign,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardStats {
    totalArtists: number;
    totalTracks: number;
    totalStreams: number;
    totalPayouts: number;
}

interface Payout {
    id: number;
    artist: string;
    track: string;
    streams: number;
    amount: number;
    status: string;
}

interface MonthlyPayout {
    month: string;
    total: number;
}

interface Props {
    stats: DashboardStats;
    recentPayouts: Payout[];
    monthlyPayouts: MonthlyPayout[];
}

export default function Dashboard({
    stats,
    recentPayouts,
    monthlyPayouts,
}: Props) {
    const formatNumber = (value: number) =>
        Number(value).toLocaleString('en-PH');

    const formatCurrency = (value: number) =>
        Number(value).toLocaleString('en-PH', {
            style: 'currency',
            currency: 'PHP',
        });

    const statCards = [
        {
            title: 'Total Artists',
            value: formatNumber(stats.totalArtists),
            icon: Users,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
        },
        {
            title: 'Music Tracks',
            value: formatNumber(stats.totalTracks),
            icon: Music,
            color: 'text-blue-400',
            bg: 'bg-blue-400/10',
        },
        {
            title: 'Total Streams',
            value: formatNumber(stats.totalStreams),
            icon: TrendingUp,
            color: 'text-green-400',
            bg: 'bg-green-400/10',
        },
        {
            title: 'Total Payouts',
            value: formatCurrency(stats.totalPayouts),
            icon: Wallet,
            color: 'text-purple-400',
            bg: 'bg-purple-400/10',
        },
    ];

    const maxMonthlyTotal = Math.max(
        ...monthlyPayouts.map((item) => item.total),
        1,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-[#09090b] p-4 text-white sm:p-6 lg:p-8">

                {/* HEADER */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-orange-500">
                            MUSIC ROYALTY MANAGEMENT
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-sm text-gray-400">
                            Monitor artists, music tracks, streams, and royalty payments.
                        </p>
                    </div>

                    <Link
                        href="/royalty-payouts/create"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                    >
                        <Plus size={18} />
                        Add Royalty Payout
                    </Link>
                </div>

                {/* STATISTICS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="rounded-2xl border border-white/10 bg-[#151518] p-5 transition hover:border-orange-500/40"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-400">
                                            {stat.title}
                                        </p>

                                        <h2 className="mt-3 text-2xl font-bold">
                                            {stat.value}
                                        </h2>
                                    </div>

                                    <div className={`rounded-xl p-3 ${stat.bg}`}>
                                        <Icon className={stat.color} size={25} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* MAIN CONTENT */}
                <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">

                    {/* ROYALTY OVERVIEW */}
                    <div className="rounded-2xl border border-white/10 bg-[#151518] p-6 xl:col-span-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">
                                    Royalty Overview
                                </h2>

                                <p className="mt-1 text-sm text-gray-400">
                                    Actual monthly payout earnings
                                </p>
                            </div>

                            <div className="rounded-lg bg-orange-500/10 p-2">
                                <TrendingUp className="text-orange-500" size={22} />
                            </div>
                        </div>

                        <div className="mt-8 flex h-48 items-end justify-between gap-3">
                            {monthlyPayouts.map((item) => (
                                <div
                                    key={item.month}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                                    title={`${item.month}: ${formatCurrency(item.total)}`}
                                >
                                    <div
                                        className="w-full max-w-12 rounded-t-lg bg-orange-500 transition hover:bg-orange-400"
                                        style={{
                                            height: `${item.total > 0 ? Math.max((item.total / maxMonthlyTotal) * 100, 3) : 0}%`,
                                        }}
                                    />

                                    <span className="text-xs text-gray-500">
                                        {item.month}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-5">
                            <TrendingUp size={16} className="text-green-400" />
                            <p className="text-sm text-gray-400">
                                Based on recorded royalty payouts.
                            </p>
                        </div>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div className="rounded-2xl border border-white/10 bg-[#151518] p-6">
                        <h2 className="text-lg font-bold">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            Manage your platform
                        </p>

                        <div className="mt-6 space-y-3">
                            <Link
                                href="/artists/create"
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#202024] p-4 transition hover:border-orange-500/50 hover:bg-orange-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="text-orange-500" size={21} />
                                    <span className="text-sm font-medium">
                                        Register Artist
                                    </span>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-400" />
                            </Link>

                            <Link
                                href="/music-tracks/create"
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#202024] p-4 transition hover:border-orange-500/50 hover:bg-orange-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <Music2 className="text-orange-500" size={21} />
                                    <span className="text-sm font-medium">
                                        Add Music Track
                                    </span>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-400" />
                            </Link>

                            <Link
                                href="/royalty-payouts/create"
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#202024] p-4 transition hover:border-orange-500/50 hover:bg-orange-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <DollarSign className="text-orange-500" size={21} />
                                    <span className="text-sm font-medium">
                                        Create Payout
                                    </span>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-400" />
                            </Link>

                            <Link
                                href="/royalty-payouts"
                                className="flex items-center justify-between rounded-xl border border-white/10 bg-[#202024] p-4 transition hover:border-orange-500/50 hover:bg-orange-500/5"
                            >
                                <div className="flex items-center gap-3">
                                    <Wallet className="text-orange-500" size={21} />
                                    <span className="text-sm font-medium">
                                        View Payouts
                                    </span>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-400" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* RECENT PAYOUTS */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#151518]">
                    <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-6 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg font-bold">
                                Recent Royalty Payouts
                            </h2>

                            <p className="mt-1 text-sm text-gray-400">
                                Latest artist payment records
                            </p>
                        </div>

                        <Link
                            href="/royalty-payouts"
                            className="flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-400"
                        >
                            View All
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-[#202024] text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Artist</th>
                                    <th className="px-6 py-4">Track</th>
                                    <th className="px-6 py-4">Streams</th>
                                    <th className="px-6 py-4">Net Payout</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/5">
                                {recentPayouts.length > 0 ? (
                                    recentPayouts.map((payout) => (
                                        <tr
                                            key={payout.id}
                                            className="transition hover:bg-white/[0.03]"
                                        >
                                            <td className="whitespace-nowrap px-6 py-5 font-semibold">
                                                {payout.artist}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5 text-gray-400">
                                                <div className="flex items-center gap-2">
                                                    <Disc3 size={17} className="text-orange-500" />
                                                    {payout.track}
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5 text-gray-400">
                                                {formatNumber(payout.streams)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5 font-semibold text-white">
                                                {formatCurrency(payout.amount)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-5">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${payout.status === 'Paid'
                                                        ? 'bg-green-500/10 text-green-400'
                                                        : 'bg-yellow-500/10 text-yellow-399'
                                                        }`}
                                                >
                                                    {payout.status === 'Paid' ? (
                                                        <CheckCircle2 size={13} />
                                                    ) : (
                                                        <Clock size={13} />
                                                    )}
                                                    {payout.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            No royalty payouts have been recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="mt-8 flex flex-col justify-between gap-2 border-t border-white/10 pt-5 text-xs text-gray-500 sm:flex-row">
                    <p>Music Royalty Management System</p>
                    <p>© 2026 All Rights Reserved</p>
                </div>
            </div>
        </AppLayout>
    );
}
