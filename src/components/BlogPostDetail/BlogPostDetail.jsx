import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80";

export default function BlogPostDetail({ post }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-12 pt-2 sm:px-6 sm:pt-6">
      <div className="mb-4 text-center text-sm font-semibold text-indigo-600 sm:text-base">
        Published on <time>{formatDate(post.createdAt)}</time>
      </div>

      <h1 className="mx-auto mb-4 max-w-2xl text-center text-2xl font-bold leading-snug tracking-normal text-black dark:text-white sm:text-4xl">
        {post.title}
      </h1>

      <div className="mb-10 flex flex-wrap justify-center gap-2 sm:mb-12">
        {(post.tags || []).map((tag) => (
          <Badge
            key={tag}
            className="border border-indigo-200 bg-white px-4 py-1 text-indigo-600 dark:border-indigo-800 dark:bg-slate-950"
          >
            {tag}
          </Badge>
        ))}
      </div>

      <img
        src={post.image || fallbackImage}
        alt={post.title}
        className="mx-auto mb-9 max-h-[26rem] max-w-full rounded-[1.25rem] object-contain sm:mb-10"
      />

      <div
        className="prose-content mx-auto max-w-2xl text-left text-base leading-7 text-black dark:text-slate-100"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
    </article>
  );
}
