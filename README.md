# QuickBlog

<p align="center">
  <img src="public/logo-lGLL0Zb0.png" alt="QuickBlog logo" width="160" />
</p>

QuickBlog là ứng dụng blog được xây dựng bằng React 19 và Vite cho frontend challenge. Ứng dụng cho phép người dùng xem bài viết, tìm kiếm blog, đăng ký/đăng nhập, tạo bài viết với ảnh Cloudinary và nội dung rich text, quản lý bài viết cá nhân, đồng thời hỗ trợ trang quản lý người dùng cho admin.

## Website mẫu: https://test-fe-blog-reactjs.vercel.app

## GitHub link preview

Để khi gửi link GitHub repo có hình preview, hãy dùng logo `public/logo-lGLL0Zb0.png` làm ảnh Social preview:

1. Mở repository trên GitHub.
2. Vào `Settings` -> `General`.
3. Kéo xuống mục `Social preview`.
4. Upload file `public/logo-lGLL0Zb0.png`.
5. Lưu lại và gửi lại link repo.

Lưu ý: `og:image` trong `index.html` chỉ ảnh hưởng link website deploy. Link GitHub repo dùng ảnh Social preview trong phần Settings của GitHub.

## Công nghệ sử dụng

- React 19
- Vite
- React Router DOM v7
- TailwindCSS v4
- Axios
- Radix UI
- TinyMCE React
- Cloudinary upload
- React Hot Toast
- Lottie React
- Lucide React

## Chức năng chính

- Xem danh sách blog dạng grid card.
- Tìm kiếm blog theo tiêu đề.
- Xem chi tiết bài viết với nội dung HTML.
- Đăng ký, đăng nhập, đăng xuất.
- Lưu phiên đăng nhập bằng `localStorage`.
- Route guard theo trạng thái đăng nhập và role.
- Tạo bài viết mới với thumbnail, tags và TinyMCE editor.
- Upload ảnh lên Cloudinary.
- Quản lý bài viết cá nhân, xóa bài viết với dialog xác nhận.
- Admin có thể xem, xóa user và đổi role user.
- Dark mode toggle và lưu preference.
- Loading skeleton/spinner, empty state bằng Lottie.
- Toast thông báo lỗi/thành công.
- SEO meta cơ bản với `og:image` bằng logo.

## Cài đặt
Cài dependency:

```bash
npm install
```

Tạo file `.env` ở thư mục gốc:

```env
VITE_API_URL=https://api-blog-af3u.onrender.com/api
VITE_USE_MOCK_API=false
VITE_TINY_MCE_API_KEY=your_tinymce_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_upload_preset
```

Ghi chú:

- `VITE_API_URL`: URL backend API.
- `VITE_USE_MOCK_API=true`: chạy bằng mock data trong frontend, tiện khi backend chưa sẵn sàng.
- `VITE_TINY_MCE_API_KEY`: API key cho TinyMCE.
- `VITE_CLOUDINARY_CLOUD_NAME`: cloud name trên Cloudinary.
- `VITE_CLOUDINARY_UPLOAD_PRESET`: unsigned upload preset trên Cloudinary.

## Chạy project

Chạy dev server:

```bash
npm run dev
```

Mặc định app chạy tại:

```text
http://localhost:3000
```

Build production:

```bash
npm run build
```

Preview bản build:

```bash
npm run preview
```

Kiểm tra lint:

```bash
npm run lint
```

## Cấu trúc thư mục

```text
src/
├── assets/                    # Logo, animation, static assets
├── components/
│   ├── ui/                    # Button, Input, Card, Table, Skeleton...
│   ├── context/               # AuthContext
│   ├── services/api/          # Axios client, API modules, mock API
│   ├── Animation/             # Lottie animation wrapper
│   ├── AuthShell/             # Layout cho trang auth
│   ├── BlogPostDetail/        # Chi tiết bài viết
│   ├── CardBlog/              # Card blog ở trang chủ
│   ├── CloudinaryUpload/      # Upload ảnh Cloudinary
│   ├── DialogConfirm/         # Dialog xác nhận
│   ├── DialogChangeRole/      # Dialog đổi role
│   ├── Header/                # Navbar
│   ├── Footer/                # Footer
│   ├── Layout/                # Header + Outlet + Footer
│   └── ProtectedRoute/        # Bảo vệ route theo role
├── hooks/
│   └── useAuthorization/      # Hook kiểm tra quyền
├── lib/                       # Helper chung
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── SignUp/
│   ├── CreateBlog/
│   ├── BlogDetails/
│   ├── MyPost/
│   └── UserManagement/
├── utils/                     # Format, API data/error helpers
├── App.jsx                    # Router config
├── main.jsx                   # Entry point
└── index.css                  # Global styles + Tailwind
```

## Routes

| Route | Mô tả | Quyền |
| --- | --- | --- |
| `/` | Trang chủ, danh sách blog | Public |
| `/posts/:id` | Chi tiết bài viết | Public |
| `/login` | Đăng nhập | Public |
| `/signup` | Đăng ký | Public |
| `/create` | Tạo blog | User/Admin |
| `/mypost` | Bài viết của tôi | User/Admin |
| `/my-posts` | Alias của `/mypost` | User/Admin |
| `/admin` | Quản lý user | Admin |
| `/users` | Alias của `/admin` | Admin |

## API

Base URL được cấu hình bằng `VITE_API_URL`.

### Authentication

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| POST | `/auth/login` | Đăng nhập | Không |
| POST | `/auth/register` | Đăng ký | Không |
| GET | `/auth/me` | Lấy thông tin user hiện tại | Bearer token |

### Blog Posts

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| GET | `/posts` | Lấy danh sách bài viết | Không |
| GET | `/posts/:id` | Lấy chi tiết bài viết | Không |
| GET | `/posts?userId=:id` | Lấy bài viết theo user | Bearer token |
| POST | `/posts` | Tạo bài viết mới | Bearer token |
| DELETE | `/posts/:id` | Xóa bài viết | Bearer token |

### Users

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| GET | `/users` | Lấy danh sách user | Admin |
| DELETE | `/users/:id` | Xóa user | Admin |
| PUT | `/users/:id/role` | Đổi role user | Admin |

## Dữ liệu mẫu

Login response:

```json
{
  "accessToken": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username",
    "role": "user"
  }
}
```

Create post body:

```json
{
  "title": "Post title",
  "content": "<p>HTML content</p>",
  "tags": ["react", "blog"],
  "image": "https://res.cloudinary.com/..."
}
```

## Ghi chú phát triển

- Alias `@/*` trỏ đến `src/*`, cấu hình trong `jsconfig.json` và `vite.config.js`.
- Axios interceptor tự gắn token từ `localStorage`.
- Khi API trả `401`, app xóa token, đồng bộ logout và yêu cầu đăng nhập lại.
- Có thể bật mock API bằng `VITE_USE_MOCK_API=true` để test giao diện không cần backend.
- File logo trong `public/logo-lGLL0Zb0.png` được dùng cho SEO `og:image`.

