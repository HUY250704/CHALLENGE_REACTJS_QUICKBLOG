import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DialogConfirm from "@/components/DialogConfirm/DialogConfirm";
import { useAuth } from "@/components/context/AuthContext";
import { postsApi } from "@/components/services/api/posts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Table, Td, Th } from "@/components/ui/table";
import { getApiErrorMessage, isNetworkError } from "@/utils/apiError";
import { getItems } from "@/utils/apiData";
import { stripHtml, truncate } from "@/utils/format";

export default function MyPost() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletePost, setDeletePost] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadPosts() {
      try {
        const params = user?.role === "admin" ? undefined : { userId: user?.id || user?._id };
        const data = await postsApi.getAll(params);
        if (active) setPosts(getItems(data));
      } catch (error) {
        if (!isNetworkError(error)) {
          toast.error(getApiErrorMessage(error, "Could not load posts"));
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPosts();
    return () => {
      active = false;
    };
  }, [user]);

  const confirmDelete = async () => {
    if (!deletePost) return;
    setDeleting(true);
    try {
      await postsApi.delete(deletePost._id || deletePost.id);
      setPosts((value) => value.filter((post) => (post._id || post.id) !== (deletePost._id || deletePost.id)));
      setDeletePost(null);
      toast.success("Post deleted");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not delete post"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mx-auto min-h-[calc(100vh-24rem)] max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="mb-14 flex items-center justify-center gap-4 text-4xl font-bold text-indigo-600 sm:text-5xl">
        <span aria-hidden="true" className="text-5xl leading-none">
          ✍️
        </span>
        My Post
      </h1>
      {loading ? (
        <Spinner label="Loading posts..." />
      ) : (
        <div className="min-h-[420px]">
          <Table>
            <thead>
              <tr>
                <Th className="text-base text-slate-950 dark:text-slate-100">Title</Th>
                <Th className="text-base text-slate-950 dark:text-slate-100">Content</Th>
                <Th className="w-36 text-base text-slate-950 dark:text-slate-100">Action</Th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id || post.id}>
                  <Td className="font-semibold">{post.title}</Td>
                  <Td>{truncate(stripHtml(post.content), 100)}</Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        size="icon"
                        variant="default"
                        className="h-9 w-11 rounded-[10px] bg-blue-500 text-white shadow-none hover:bg-blue-600"
                      >
                        <Link to={`/posts/${post._id || post.id}`} aria-label={`View ${post.title}`}>
                          <ViewPostIcon className="h-5 w-5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="danger"
                        className="h-9 w-11 rounded-[10px] bg-red-500 text-white shadow-none hover:bg-red-600"
                        aria-label={`Delete ${post.title}`}
                        onClick={() => setDeletePost(post)}
                      >
                        <Trash2 className="h-5 w-5 stroke-[2.5]" />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {posts.length === 0 && <div className="grid min-h-80 place-items-center text-base text-slate-950 dark:text-slate-100">You have no posts yet.</div>}
        </div>
      )}
      <DialogConfirm
        open={Boolean(deletePost)}
        onOpenChange={(open) => !open && setDeletePost(null)}
        title="Delete this post?"
        description="The selected blog post will be permanently deleted."
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </section>
  );
}

function ViewPostIcon({ className }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 6v11" />
      <path d="M17 6v11" />
      <path d="M7 8h10" />
      <path d="M7 13h10" />
      <path d="M5 10.5 3.5 16.5a3 3 0 0 0 5.8 1.5l1.2-4.5" />
      <path d="M19 10.5 20.5 16.5a3 3 0 0 1-5.8 1.5l-1.2-4.5" />
      <path d="M9 6a2 2 0 0 1 4 0" />
      <path d="M15 6a2 2 0 0 0-4 0" />
    </svg>
  );
}
