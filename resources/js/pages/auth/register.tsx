import { Head, useForm } from '@inertiajs/react';
import { Disc3, LoaderCircle, Music2, UserRound } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = Record<string, string> & {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create your account" description="Join RoyaltyFlow and manage your music royalties">
            <Head title="Register" />

            <div className="relative">
                <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-orange-500/10 blur-2xl" />

                <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-6 text-white shadow-2xl sm:p-8">
                    {/* Branding */}
                    <div className="mb-7 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/20">
                            <Disc3 size={34} strokeWidth={1.8} />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Royalty<span className="text-orange-500">Flow</span>
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">Create your account and get started.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={submit}>
                        {/* Full name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-zinc-200">
                                Full name
                            </Label>

                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Enter your full name"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-zinc-200">
                                Email address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.email} />
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-zinc-200">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Create a password"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.password} />
                        </div>

                        {/* Confirm password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-zinc-200">
                                Confirm password
                            </Label>

                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your password"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Register button */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-2 h-12 w-full bg-orange-500 font-semibold text-black transition hover:bg-orange-400"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserRound className="mr-2 h-4 w-4" />
                                    Create account
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-7 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
                        Already have an account?{' '}
                        <TextLink href={route('login')} className="font-semibold text-orange-500 transition hover:text-orange-400">
                            Log in
                        </TextLink>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
                    <Music2 size={14} className="text-orange-500" />
                    Your music. Your earnings. Your dashboard.
                </div>
            </div>
        </AuthLayout>
    );
}
