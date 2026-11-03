import { CatalogShow } from '@/components/catalog-pages';

type Artist = {
    artist_code: string;
    artist_name: string;
    bank_account: string;
    music_tracks?: { id: number; track_title: string }[];
};

export default function Show({ artist }: { artist: Artist }) {
    return (
        <CatalogShow
            entries={[
                { label: 'Artist code', value: artist.artist_code },
                { label: 'Artist name', value: artist.artist_name },
                { label: 'Bank account', value: artist.bank_account },
                {
                    label: 'Tracks',
                    value: artist.music_tracks?.map((track) => track.track_title).join(', ') || 'No tracks',
                },
            ]}
            routeName="artists"
            title={artist.artist_name}
        />
    );
}
