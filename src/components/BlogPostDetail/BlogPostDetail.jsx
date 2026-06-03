import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

export default function BlogPostDetail({ post }) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap gap-2">
        {(post.tags || []).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <h1 className="mb-5 text-3xl font-bold leading-tight text-slate-950 dark:text-white sm:text-5xl">{post.title}</h1>
      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>By {post.author?.username || "Unknown author"}</span>
        <span>•</span>
        <time>{formatDate(post.createdAt)}</time>
      </div>
      <img src={post.image || fallbackImage} alt={post.title} className="mb-10 aspect-[16/8] w-full rounded-lg object-cover" />
      <div className="prose-content text-slate-700 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </article>
  );
}
