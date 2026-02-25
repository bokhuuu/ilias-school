import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { FlashMessage } from '@/components/admin/flash-message';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { SiteSettings } from '@/types/models';

interface Props {
    settings: SiteSettings;
}

export default function SettingsEdit({ settings }: Props) {
    const { data, setData, put, processing } = useForm({
        site_name: settings.site_name || '',
        email: settings.email || '',
        phone: settings.phone || '',
        facebook: settings.facebook || '',
        instagram: settings.instagram || '',
        linkedin: settings.linkedin || '',
        registration_url: settings.registration_url || '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    return (
        <AppLayout breadcrumbs={[
            { title: 'დეშბორდი', href: '/admin/dashboard' },
            { title: 'პარამეტრები', href: '/admin/settings' },
        ]}>
            <Head title="პარამეტრები" />
            <FlashMessage />

            <div className="p-6 max-w-xl">
                <h1 className="text-2xl font-bold mb-6">საიტის პარამეტრები</h1>

                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">ძირითადი</h2>

                        <div>
                            <Label htmlFor="site_name">საიტის სახელი</Label>
                            <Input id="site_name" value={data.site_name} onChange={(e) => setData('site_name', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="email">ელ. ფოსტა</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="phone">ტელეფონი</Label>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="mt-1" />
                        </div>
                        <div>
                            <Label htmlFor="registration_url">რეგისტრაციის ლინკი</Label>
                            <Input id="registration_url" value={data.registration_url} onChange={(e) => setData('registration_url', e.target.value)} className="mt-1" placeholder="https://..." />
                        </div>
                    </div>

                    <div className="rounded-lg border p-6 space-y-4">
                        <h2 className="text-lg font-semibold">სოციალური ქსელები</h2>

                        <div>
                            <Label htmlFor="facebook">Facebook</Label>
                            <Input id="facebook" value={data.facebook} onChange={(e) => setData('facebook', e.target.value)} className="mt-1" placeholder="https://facebook.com/..." />
                        </div>
                        <div>
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input id="instagram" value={data.instagram} onChange={(e) => setData('instagram', e.target.value)} className="mt-1" placeholder="https://instagram.com/..." />
                        </div>
                        <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input id="linkedin" value={data.linkedin} onChange={(e) => setData('linkedin', e.target.value)} className="mt-1" placeholder="https://linkedin.com/..." />
                        </div>
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'ინახება...' : 'განახლება'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}
