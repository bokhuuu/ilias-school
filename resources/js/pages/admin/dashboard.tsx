import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { FlashMessage } from '@/components/admin/flash-message';
import { Users, GraduationCap, MessageSquare } from 'lucide-react';
import type { DashboardStats } from '@/types/models';

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'დეშბორდი', href: '/admin/dashboard' }]}>
            <Head title="დეშბორდი" />
            <FlashMessage />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">დეშბორდი</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="აქტიური ლექტორები"
                        value={stats.lecturers_count}
                        total={stats.total_lecturers}
                        icon={<Users className="h-8 w-8 text-blue-500" />}
                        color="blue"
                    />
                    <StatCard
                        title="აქტიური კურსები"
                        value={stats.courses_count}
                        total={stats.total_courses}
                        icon={<GraduationCap className="h-8 w-8 text-green-500" />}
                        color="green"
                    />
                    <StatCard
                        title="FAQ"
                        value={stats.total_faqs}
                        icon={<MessageSquare className="h-8 w-8 text-purple-500" />}
                        color="purple"
                    />
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({
    title,
    value,
    total,
    icon,
    color,
}: {
    title: string;
    value: number;
    total?: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold mt-1">
                        {value}
                        {total !== undefined && (
                            <span className="text-lg font-normal text-muted-foreground"> / {total}</span>
                        )}
                    </p>
                </div>
                {icon}
            </div>
        </div>
    );
}
