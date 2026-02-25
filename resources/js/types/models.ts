export interface Lecturer {
    id: number;
    full_name: string;
    slug: string;
    title: string | null;
    bio: string | null;
    short_bio: string | null;
    is_active: boolean;
    sort_order: number;
    meta_title: string | null;
    meta_description: string | null;
    image: string;
    image_thumb: string;
    image_medium: string;
    og_image: string;
    courses?: Course[];
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    age_group: string | null;
    format: string | null;
    duration: string | null;
    video_url: string | null;
    is_active: boolean;
    is_featured: boolean;
    featured_sort_order: number;
    sort_order: number;
    meta_title: string | null;
    meta_description: string | null;
    image: string;
    image_thumb: string;
    image_medium: string;
    image_large: string;
    og_image: string;
    lecturers?: Lecturer[];
    categories?: Category[];
    syllabus_items?: SyllabusItem[];
    created_at: string;
    updated_at: string;
}

export interface SyllabusItem {
    id: number;
    course_id: number;
    meeting_number: number;
    title: string;
    sort_order: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
}

export interface AgeGroup {
    id: number;
    title: string;
    age_range: string;
    description: string | null;
    is_active: boolean;
    sort_order: number;
    image: string;
    image_thumb: string;
}

export interface Faq {
    id: number;
    question: string;
    answer: string;
    is_active: boolean;
    sort_order: number;
}

export interface AboutPage {
    id: number;
    title: string;
    content: string | null;
    meta_title: string | null;
    meta_description: string | null;
    image: string;
    image_medium: string;
    og_image: string;
}

export interface SiteSettings {
    site_name: string;
    email: string;
    phone: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    registration_url: string;
}

export interface DashboardStats {
    lecturers_count: number;
    courses_count: number;
    total_lecturers: number;
    total_courses: number;
    total_faqs: number;
}

export interface FlashMessages {
    success: string | null;
    error: string | null;
}
