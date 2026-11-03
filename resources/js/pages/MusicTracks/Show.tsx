import { CatalogShow } from '@/components/catalog-pages';

type Track = {
    track_isrc: string;
    track_title: string;
    artist?: { artist_name: string };
    royalty_payouts?: { id: number }[];
};

export default function Show({ track }: { track: Track }) {
    return (
        <CatalogShow
            entries={[
                { label: 'Title', value: track.track_title },
                { label: 'ISRC', value: track.track_isrc },
                { label: 'Artist', value: track.artist?.artist_name ?? '—' },
                {
                    label: 'Payout records',
                    value: track.royalty_payouts?.length ?? 0,
                },
            ]}
            routeName="music-tracks"
            title={track.track_title}
        />
    );
}
