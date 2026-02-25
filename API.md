# Ilia School CMS — API Documentation

## Base URL

```
https://your-domain.com/api
```

## Authentication

All endpoints require a Bearer token. Add this header to every request:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

Get your token from the admin panel: Settings → API ტოკენები.

---

## Endpoints

### GET /homepage

Returns all data needed for the homepage in a single request.

**Response:**

```json
{
    "slider": [Course],
    "age_groups": [AgeGroup],
    "about": AboutPage,
    "stats": {
        "lecturers_count": 5,
        "courses_count": 12
    },
    "faqs": [Faq],
    "settings": Settings
}
```

---

### GET /courses

Returns all active courses. Supports filtering by category.

**Query params:**

| Param      | Type   | Description              |
|:-----------|:-------|:-------------------------|
| `category` | string | Filter by category slug  |

**Examples:**

```
GET /api/courses
GET /api/courses?category=programming
```

**Response:**

```json
{
    "data": [
        {
            "id": 1,
            "title": "string",
            "slug": "string",
            "description": "string (HTML)",
            "short_description": "string",
            "age_group": "string",
            "format": "string",
            "duration": "string",
            "video_url": "string|null",
            "is_featured": true,
            "image": "url",
            "image_thumb": "url",
            "image_medium": "url",
            "image_large": "url",
            "og_image": "url",
            "gallery": [
                { "id": 1, "url": "url", "thumb": "url", "order": 0 }
            ],
            "lecturers": [Lecturer],
            "categories": [Category]
        }
    ]
}
```

---

### GET /courses/{slug}

Returns a single course with all relationships.

**Response:** Same as above, plus:

```json
{
    "data": {
        ...Course,
        "syllabus_items": [
            {
                "id": 1,
                "meeting_number": 1,
                "title": "string",
                "sort_order": 0
            }
        ]
    }
}
```

---

### GET /lecturers

Returns all active lecturers.

**Response:**

```json
{
    "data": [
        {
            "id": 1,
            "full_name": "string",
            "slug": "string",
            "title": "string",
            "bio": "string (HTML)",
            "short_bio": "string",
            "image": "url",
            "image_thumb": "url",
            "image_medium": "url",
            "og_image": "url",
            "gallery": [GalleryImage]
        }
    ]
}
```

---

### GET /lecturers/{slug}

Returns a single lecturer with their courses.

**Response:** Same as above, plus:

```json
{
    "data": {
        ...Lecturer,
        "courses": [Course]
    }
}
```

---

### GET /categories

Returns all categories.

**Response:**

```json
{
    "data": [
        {
            "id": 1,
            "name": "string",
            "slug": "string",
            "sort_order": 0
        }
    ]
}
```

---

### GET /age-groups

Returns all active age groups.

**Response:**

```json
{
    "data": [
        {
            "id": 1,
            "title": "string",
            "age_range": "string",
            "description": "string (HTML)",
            "image": "url",
            "image_thumb": "url"
        }
    ]
}
```

---

### GET /faqs

Returns all active FAQs.

**Response:**

```json
{
    "data": [
        {
            "id": 1,
            "question": "string",
            "answer": "string (HTML)",
            "sort_order": 0
        }
    ]
}
```

---

### GET /about

Returns the about page content.

**Response:**

```json
{
    "data": {
        "id": 1,
        "title": "string",
        "content": "string (HTML)",
        "meta_title": "string",
        "meta_description": "string",
        "image": "url",
        "image_medium": "url",
        "og_image": "url",
        "gallery": [GalleryImage]
    }
}
```

---

### GET /settings

Returns site settings (for header/footer).

**Response:**

```json
{
    "site_name": "string",
    "email": "string",
    "phone": "string",
    "facebook": "url",
    "instagram": "url",
    "linkedin": "url",
    "registration_url": "url"
}
```

---

## Notes

- All text fields marked `(HTML)` contain rich text from the admin editor
- All `url` fields return full URLs to images
- Image sizes: `thumb` (400x300), `medium` (800x600), `large` (1200x800)
- Slug fields are Georgian-safe (Unicode)
- All list endpoints return items sorted by `sort_order`
- Only `is_active: true` items are returned from API
