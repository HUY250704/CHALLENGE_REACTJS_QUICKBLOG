import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import BlogPostDetail from "@/components/BlogPostDetail/BlogPostDetail";
import { postsApi } from "@/components/services/api/posts";
import { Spinner } from "@/components/ui/spinner";
import { getApiErrorMessage } from "@/utils/apiError";
import { getItem } from "@/utils/apiData";

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadPost() {
      try {
        const data = await postsApi.getById(id);
        if (active) setPost(getItem(data));
      } catch (error) {
        toast.error(getApiErrorMessage(error, "Could not load post"));
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPost();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Spinner label="Loading post..." />;
  if (!post) return <div className="py-24 text-center text-slate-500">Post not found.</div>;

  return <BlogPostDetail post={post} />;
}
