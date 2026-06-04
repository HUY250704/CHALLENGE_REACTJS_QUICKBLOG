import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Animation from "@/components/Animation/Animation";
import CardBlog from "@/components/CardBlog/CardBlog";
import { postsApi } from "@/components/services/api/posts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function loadPosts() {
      try {
        const data = await postsApi.getAll();
        if (active) setPosts(data.items || data || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load blog posts");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPosts();
    return () => {
      active = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const keyword = submittedQuery.trim().toLowerCase();
    if (!keyword) return posts;
    return posts.filter((post) => post.title?.toLowerCase().includes(keyword));
  }, [posts, submittedQuery]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 pt-9 sm:px-6 lg:pt-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mx-auto max-w-sm text-3xl font-bold leading-tight tracking-normal text-slate-700 dark:text-white sm:max-w-3xl sm:text-6xl">
          Your own <span className="text-indigo-600">blogging</span> platform.
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-xs leading-5 text-slate-500 dark:text-slate-300 sm:max-w-3xl sm:text-base sm:leading-7">
          This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
        </p>
        <form
          className="mx-auto mt-7 flex max-w-[17.5rem] overflow-hidden rounded-sm border border-slate-300 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-950 sm:max-w-2xl sm:rounded-md"
          onSubmit={(event) => {
            event.preventDefault();
            setSubmittedQuery(query);
          }}
        >
          <Input
            className="h-9 min-w-0 border-0 px-3 text-base shadow-none focus:border-0 focus:ring-0 sm:h-12 sm:px-4 sm:text-sm"
            placeholder="Enter search title..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button className="h-8 min-w-[4.25rem] shrink-0 rounded-sm px-3 text-[10px] sm:h-12 sm:min-w-[8rem] sm:rounded-md sm:text-base">
            Search
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="mt-9 grid place-items-center gap-6 sm:mt-12 sm:grid-cols-2 sm:place-items-stretch lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-full max-w-xs rounded-lg border border-slate-200 p-4 dark:border-slate-800 sm:max-w-none">
              <Skeleton className="mb-4 aspect-[4/2.7]" />
              <Skeleton className="mb-3 h-5 w-24" />
              <Skeleton className="mb-3 h-6 w-4/5" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length ? (
        <div className="mt-9 grid place-items-center gap-6 sm:mt-12 sm:grid-cols-2 sm:place-items-stretch lg:grid-cols-4">
          {filteredPosts.map((post) => (
            <div key={post._id || post.id} className="w-full max-w-xs sm:max-w-none">
              <CardBlog post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-2 flex max-w-2xl flex-col items-center text-center">
          <Animation className="h-68 w-[52rem] max-w-full opacity-95 sm:h-72 sm:w-[58rem]" />
          <h2 className="-mt-1 text-base font-semibold text-slate-500 dark:text-slate-300">
            We could not find any blog
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Please try again with a different search query.
          </p>
        </div>
      )}
    </section>
  );
}
