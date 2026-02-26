import { Head, useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Copy, Key, Trash2 } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog';
import { FlashMessage } from '@/components/admin/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { SiteSettings } from '@/types/models';

interface Token {
    id: number;
    name: string;
    created_at: string;
    last_used_at: string | null;
}

interface Props {
    settings: SiteSettings;
    tokens: Token[];
    newToken?: string;
}

export default function SettingsEdit({ settings, tokens, newToken }: Props) {
    const { data, setData, put, processing } = useForm({
        site_name: settings.site_name || '',
        email: settings.email || '',
        phone: settings.phone || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        registration_url: settings.registration_url || '',
    });

    const [tokenName, setTokenName] = useState('');
    const [copied, setCopied] = useState(false);
    const [deleteTokenId, setDeleteTokenId] = useState<number | null>(null);

    function submit(e: FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    function createToken(e: FormEvent) {
        e.preventDefault();
        if (!tokenName.trim()) return;
        router.post(
            '/admin/settings/tokens',
            { name: tokenName },
            {
                preserveScroll: true,
                onSuccess: () => setTokenName(''),
            },
        );
    }

    function copyToken() {
        if (newToken) {
            navigator.clipboard.writeText(newToken);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'დეშბორდი', href: '/admin/dashboard' },
                { title: 'პარამეტრები', href: '/admin/settings' },
            ]}
        >
            <Head title="პარამეტრები" />
            <FlashMessage />

            <div className="max-w-xl p-6">
                <h1 className="mb-6 text-2xl font-bold">საიტის პარამეტრები</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">ძირითადი</h2>
                        <div>
                            <Label htmlFor="site_name">საიტის სახელი</Label>
                            <Input
                                id="site_name"
                                value={data.site_name}
                                onChange={(e) =>
                                    setData('site_name', e.target.value)
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">ელ. ფოსტა</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">ტელეფონი</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="registration_url">
                                რეგისტრაციის ლინკი
                            </Label>
                            <Input
                                id="registration_url"
                                value={data.registration_url}
                                onChange={(e) =>
                                    setData('registration_url', e.target.value)
                                }
                                className="mt-1"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4 rounded-lg border p-6">
                        <h2 className="text-lg font-semibold">
                            სოციალური ქსელები
                        </h2>
                        <div>
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input
                                id="facebook"
                                value={data.facebook}
                                onChange={(e) =>
                                    setData('facebook', e.target.value)
                                }
                                className="mt-1"
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                value={data.instagram}
                                onChange={(e) =>
                                    setData('instagram', e.target.value)
                                }
                                className="mt-1"
                                placeholder="https://instagram.com/..."
                            />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                                id="linkedin"
                                value={data.linkedin}
                                onChange={(e) =>
                                    setData('linkedin', e.target.value)
                                }
                                className="mt-1"
                                placeholder="https://linkedin.com/..."
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'ინახება...' : 'განახლება'}
                    </Button>
                </form>

                <div className="mt-8 space-y-4 rounded-lg border p-6">
                    <div className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">API ტოკენები</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        შექმენით ტოკენი ფრონტენდ დეველოპერისთვის API-ზე
                        წვდომისთვის.
                    </p>

                    {newToken && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
                            <p className="mb-2 text-sm font-medium text-green-800 dark:text-green-200">
                                ტოკენი შეიქმნა. დააკოპირეთ ახლავე — მეორედ ვეღარ
                                ნახავთ!
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 rounded bg-white p-2 text-xs break-all dark:bg-black">
                                    {newToken}
                                </code>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToken}
                                >
                                    <Copy className="mr-1 h-3 w-3" />
                                    {copied ? 'დაკოპირდა!' : 'კოპირება'}
                                </Button>
                            </div>
                        </div>
                    )}

                    <form
                        onSubmit={createToken}
                        className="flex items-end gap-2"
                    >
                        <div className="flex-1">
                            <Label htmlFor="token_name">ტოკენის სახელი</Label>
                            <Input
                                id="token_name"
                                value={tokenName}
                                onChange={(e) => setTokenName(e.target.value)}
                                placeholder="მაგ: frontend-app"
                                className="mt-1"
                            />
                        </div>
                        <Button type="submit" disabled={!tokenName.trim()}>
                            შექმნა
                        </Button>
                    </form>

                    {tokens.length > 0 && (
                        <div className="space-y-2">
                            {tokens.map((token) => (
                                <div
                                    key={token.id}
                                    className="flex items-center justify-between rounded-lg border px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {token.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            შექმნილი:{' '}
                                            {new Date(
                                                token.created_at,
                                            ).toLocaleDateString('ka-GE')}
                                            {token.last_used_at &&
                                                ` · ბოლოს: ${new Date(token.last_used_at).toLocaleDateString('ka-GE')}`}
                                        </p>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setDeleteTokenId(token.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DeleteConfirmDialog
                    open={deleteTokenId !== null}
                    onClose={() => setDeleteTokenId(null)}
                    deleteUrl={`/admin/settings/tokens/${deleteTokenId}`}
                    title="ტოკენის წაშლა"
                    description="დარწმუნებული ხართ? ტოკენით API წვდომა გაუქმდება."
                />
            </div>
        </AppLayout>
    );
}
