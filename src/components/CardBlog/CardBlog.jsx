import {
  EyeOff,
  ImagePlus,
  MoreHorizontal,
  ScanSearch,
  Settings,
  ThumbsDown,
  ThumbsUp,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { stripHtml, truncate } from "@/utils/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";

export default function CardBlog({ post }) {
  const id = post._id || post.id;
  const postUrl = `/posts/${id}`;
  const postedImageUrl = post.image || "";
  const imageUrl = postedImageUrl || fallbackImage;
  const googleSearchUrl = postedImageUrl
    ? `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(postedImageUrl)}`
    : `https://www.google.com/search?q=${encodeURIComponent(post.title || "")}`;
  const [menuOpen, setMenuOpen] = useState(false);

  const openImage = () => {
    window.open(imageUrl, "_blank", "noopener,noreferrer");
    setMenuOpen(false);
  };

  const showMessage = (message) => {
    setMenuOpen(false);
    toast.success(message);
  };

  return (
    <Card className="group relative h-full overflow-visible transition hover:z-20 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/2.7] overflow-visible bg-slate-100 dark:bg-slate-800">
        <Link to={postUrl} className="block h-full overflow-hidden rounded-t-lg" aria-label={`Read ${post.title}`}>
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>

        <div
          className={`group/actions absolute right-2 top-2 z-30 h-[84px] w-10 transition duration-300 ${
            menuOpen
              ? "translate-x-0 translate-y-0 opacity-100"
              : "pointer-events-none translate-x-3 -translate-y-3 opacity-0 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:translate-y-0 group-focus-within:opacity-100"
          }`}
        >
          <a
            href={googleSearchUrl}
            className="absolute right-0 top-0 z-20 grid h-10 w-10 place-items-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-md shadow-slate-900/20 transition duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            aria-label={`Search ${post.title} image on Google`}
            onClick={() => setMenuOpen(false)}
          >
            <ScanSearch className="h-5 w-5 stroke-[2.2]" />
          </a>

          <button
            type="button"
            className={`absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/55 text-blue-500/70 opacity-0 shadow-sm shadow-slate-900/10 backdrop-blur-md transition duration-200 hover:bg-white/75 hover:text-blue-600/85 hover:opacity-95 group-hover/actions:translate-y-11 group-hover/actions:opacity-80 group-focus-within/actions:translate-y-11 group-focus-within/actions:opacity-80 ${
              menuOpen ? "translate-y-11 opacity-80" : ""
            }`}
            aria-label={`Open actions for ${post.title}`}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <MoreHorizontal className="h-6 w-6 stroke-[1.9]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[5.75rem] z-50 w-[calc(100vw-3rem)] max-w-72 rounded-xl bg-neutral-900 p-3 text-white shadow-2xl shadow-slate-950/35 ring-1 ring-white/10 sm:left-full sm:right-auto sm:top-10 sm:ml-2 sm:w-80 sm:max-w-none sm:translate-x-1">
              <MenuAction icon={ImagePlus} label="Chỉnh sửa hình ảnh" as="a" href={googleSearchUrl} onClick={() => setMenuOpen(false)} />
              <MenuAction icon={ZoomIn} label="Phóng to hình ảnh" onClick={openImage} />
              <MenuAction icon={EyeOff} label="Tắt cho site này" onClick={() => showMessage("Đã tắt gợi ý cho site này")} />
              <MenuAction icon={EyeOff} label="Tắt cho tất cả các site" onClick={() => showMessage("Đã tắt gợi ý cho tất cả các site")} />
              <MenuAction icon={Settings} label="Cài đặt" onClick={() => showMessage("Đã mở mục cài đặt")} />

              <div className="mt-1 flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-slate-100">
                <span className="flex-1 leading-5">Bạn có thích menu di chuột không?</span>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-100 transition hover:bg-white/10"
                  aria-label="Thích menu di chuột"
                  onClick={() => showMessage("Cảm ơn phản hồi của bạn")}
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full text-slate-100 transition hover:bg-white/10"
                  aria-label="Không thích menu di chuột"
                  onClick={() => showMessage("Cảm ơn phản hồi của bạn")}
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {(post.tags || []).slice(0, 3).map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <Link to={postUrl}>
          <h2 className="mb-3 line-clamp-2 text-lg font-bold text-slate-950 transition hover:text-indigo-600 dark:text-white dark:hover:text-indigo-300">
            {post.title}
          </h2>
        </Link>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {truncate(stripHtml(post.content), 130)}
        </p>
      </CardContent>
    </Card>
  );
}

function MenuAction({ icon: Icon, label, as: Component = "button", ...props }) {
  return (
    <Component
      type={Component === "button" ? "button" : undefined}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10"
      {...props}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{label}</span>
    </Component>
  );
}
