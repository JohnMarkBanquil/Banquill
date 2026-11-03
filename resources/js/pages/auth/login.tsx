import { Head, useForm } from '@inertiajs/react';
import { Disc3, LoaderCircle, Music2 } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = Record<string, string | boolean> & {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Welcome back" description="Sign in to your royalty management account">
            <Head title="Log in" />

            <div className="relative">
                {/* Decorative orange glow */}
                <div className="pointer-events-none absolute -inset-3 rounded-3xl bg-orange-500/10 blur-2xl" />

                <div className="relative rounded-2xl border border-zinc-800 bg-[#111111] p-6 text-white shadow-2xl sm:p-8">
                    {/* Logo and heading */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-500/20">
                            <Disc3 size={34} strokeWidth={1.8} />
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-white">
                            Royalty<span className="text-orange-500">Flow</span>
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">Your music. Your earnings. Your dashboard.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium text-zinc-200">
                                Email address
                            </Label>

                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-zinc-200">
                                    Password
                                </Label>

                                {canResetPassword && (
                                    <TextLink
                                        href={route('password.request')}
                                        className="text-sm text-orange-500 transition hover:text-orange-400"
                                        tabIndex={5}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>

                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                                className="h-12 border-zinc-700 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:border-orange-500 focus-visible:ring-orange-500"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked === true)}
                                tabIndex={3}
                                className="border-zinc-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500 data-[state=checked]:text-black"
                            />

                            <Label htmlFor="remember" className="cursor-pointer text-sm text-zinc-400">
                                Remember me
                            </Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-12 w-full bg-orange-500 font-semibold text-black transition hover:bg-orange-400"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <Music2 className="mr-2 h-4 w-4" />
                                    Log in to your account
                                </>
                            )}
                        </Button>

                        {status && <div className="text-center text-sm font-medium text-green-400">{status}</div>}
                    </form>

                    <div className="mt-7 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} tabIndex={6} className="font-semibold text-orange-500 transition hover:text-orange-400">
                            Sign up
                        </TextLink>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}
