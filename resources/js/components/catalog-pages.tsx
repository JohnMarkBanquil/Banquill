import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import type { FormEvent, ReactNode } from 'react';

type CatalogRecord = {
    id: number;
};

type Pagination<T> = {
    data: T[];
    links: {
        active: boolean;
        label: string;
        url: string | null;
    }[];
};

export type CatalogColumn<T> = {
    label: string;
    render: (record: T) => ReactNode;
};

export function CatalogIndex<T extends CatalogRecord>({
    title,
    records,
    columns,
    routeName,
}: {
    title: string;
    records: Pagination<T>;
    columns: CatalogColumn<T>[];
    routeName: string;
}) {
    return (
        <AppLayout>
            <Head title={title} />
            <main className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Link href={route(`${routeName}.create`)} className="bg-primary text-primary-foreground rounded-md px-4 py-2">
                        Add {title.slice(0, -1)}
                    </Link>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted">
                            <tr>
                                {columns.map((column) => (
                                    <th className="px-4 py-3" key={column.label}>
                                        {column.label}
                                    </th>
                                ))}
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.data.map((record) => (
                                <tr className="border-t" key={record.id}>
                                    {columns.map((column) => (
                                        <td className="px-4 py-3" key={column.label}>
                                            {column.render(record)}
                                        </td>
                                    ))}
                                    <td className="space-x-3 px-4 py-3">
                                        <Link className="underline" href={route(`${routeName}.show`, record.id)}>
                                            View
                                        </Link>
                                        <Link className="underline" href={route(`${routeName}.edit`, record.id)}>
                                            Edit
                                        </Link>
                                        <button
                                            className="text-destructive underline"
                                            onClick={() => {
                                                if (window.confirm(`Delete this ${title.toLowerCase().replace(/s$/, '')}?`)) {
                                                    router.delete(route(`${routeName}.destroy`, record.id));
                                                }
                                            }}
                                            type="button"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {records.data.length === 0 && (
                                <tr>
                                    <td className="text-muted-foreground px-4 py-8 text-center" colSpan={columns.length + 1}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <nav aria-label={`${title} pages`} className="flex flex-wrap gap-2">
                    {records.links.map((link, index) =>
                        link.url ? (
                            <Link
                                className={`rounded border px-3 py-1 ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                                href={link.url}
                                key={`${link.label}-${index}`}
                                preserveScroll
                            >
                                <span>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
                            </Link>
                        ) : (
                            <span className="text-muted-foreground rounded border px-3 py-1" key={`${link.label}-${index}`}>
                                <span>{link.label.replace('&laquo;', '«').replace('&raquo;', '»')}</span>
                            </span>
                        ),
                    )}
                </nav>
            </main>
        </AppLayout>
    );
}

export type FormField = {
    label: string;
    name: string;
    type?: 'text' | 'number' | 'select';
    required?: boolean;
    options?: { label: string; value: string | number }[];
};

export function CatalogForm({
    title,
    routeName,
    action,
    method,
    routeParams,
    fields,
    initialData,
}: {
    title: string;
    routeName: string;
    action: string;
    method: 'post' | 'put';
    routeParams?: number;
    fields: FormField[];
    initialData: Record<string, string | number>;
}) {
    const form = useForm(initialData);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const options = { preserveScroll: true };
        if (method === 'put') {
            form.put(route(action, routeParams), options);
        } else {
            form.post(route(action), options);
        }
    }

    return (
        <AppLayout>
            <Head title={title} />
            <main className="mx-auto max-w-2xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Link className="underline" href={route(`${routeName}.index`)}>
                        Back to list
                    </Link>
                </div>
                <form className="space-y-5 rounded-lg border p-6" onSubmit={submit}>
                    {fields.map((field) => (
                        <label className="grid gap-2" key={field.name}>
                            <span className="text-sm font-medium">{field.label}</span>
                            {field.type === 'select' ? (
                                <select
                                    className="bg-background rounded-md border px-3 py-2"
                                    onChange={(event) => form.setData(field.name, event.target.value)}
                                    required={field.required}
                                    value={form.data[field.name] ?? ''}
                                >
                                    <option value="">Choose {field.label.toLowerCase()}</option>
                                    {field.options?.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="bg-background rounded-md border px-3 py-2"
                                    min={field.type === 'number' ? 0 : undefined}
                                    onChange={(event) => form.setData(field.name, event.target.value)}
                                    required={field.required}
                                    type={field.type ?? 'text'}
                                    value={form.data[field.name] ?? ''}
                                />
                            )}
                            {form.errors[field.name] && <span className="text-destructive text-sm">{form.errors[field.name]}</span>}
                        </label>
                    ))}
                    <button
                        className="bg-primary text-primary-foreground rounded-md px-4 py-2 disabled:opacity-50"
                        disabled={form.processing}
                        type="submit"
                    >
                        {form.processing ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </main>
        </AppLayout>
    );
}

export function CatalogShow({ title, routeName, entries }: { title: string; routeName: string; entries: { label: string; value: ReactNode }[] }) {
    return (
        <AppLayout>
            <Head title={title} />
            <main className="mx-auto max-w-2xl space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{title}</h1>
                    <Link className="underline" href={route(`${routeName}.index`)}>
                        Back to list
                    </Link>
                </div>
                <dl className="divide-y rounded-lg border px-5">
                    {entries.map((entry) => (
                        <div className="grid gap-2 py-4 sm:grid-cols-3" key={entry.label}>
                            <dt className="font-medium">{entry.label}</dt>
                            <dd className="sm:col-span-2">{entry.value}</dd>
                        </div>
                    ))}
                </dl>
            </main>
        </AppLayout>
    );
}
