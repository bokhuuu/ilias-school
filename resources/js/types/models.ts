export interface GalleryImage {
    id: number;
    url: string;
    thumb: string;
    order: number;
}

export interface Lecturer {
    id: number;
    full_name: string;
    slug: string;
    title: string;
    bio: string;
    short_bio: string;
    is_active: boolean;
    sort_order: number;
    meta_title: string;
    meta_description: string;
    image: string;
    image_thumb: string;
    image_medium: string;
    og_image: string;
    gallery: GalleryImage[];
    courses?: Course[];
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    age_group: string;
    format: string;
    duration: string;
    video_url: string;
    is_active: boolean;
    is_featured: boolean;
    featured_sort_order: number;
    sort_order: number;
    meta_title: string;
    meta_description: string;
    image: string;
    image_thumb: string;
    image_medium: string;
    image_large: string;
    og_image: string;
    gallery: GalleryImage[];
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

export interface SyllabusItemForm {
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
    description: string;
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
    content: string;
    meta_title: string;
    meta_description: string;
    image: string;
    image_medium: string;
    og_image: string;
    gallery: GalleryImage[];
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
