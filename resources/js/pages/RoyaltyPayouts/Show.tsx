import { CatalogShow } from '@/components/catalog-pages';

type Payout = {
    total_streams: number;
    rate_per_stream: string;
    gross_earnings: string;
    platform_commission: string;
    net_payout: string;
    payout_status: string;
    music_track?: {
        track_title: string;
        artist?: { artist_name: string };
    };
};

export default function Show({ payout }: { payout: Payout }) {
    return (
        <CatalogShow
            entries={[
                {
                    label: 'Track',
                    value: payout.music_track?.track_title ?? '—',
                },
                {
                    label: 'Artist',
                    value: payout.music_track?.artist?.artist_name ?? '—',
                },
                { label: 'Total streams', value: payout.total_streams },
                { label: 'Rate per stream', value: payout.rate_per_stream },
                { label: 'Gross earnings', value: payout.gross_earnings },
                {
                    label: 'Platform commission',
                    value: payout.platform_commission,
                },
                { label: 'Net payout', value: payout.net_payout },
                { label: 'Status', value: payout.payout_status },
            ]}
            routeName="royalty-payouts"
            title="Royalty Payout"
        />
    );
}
