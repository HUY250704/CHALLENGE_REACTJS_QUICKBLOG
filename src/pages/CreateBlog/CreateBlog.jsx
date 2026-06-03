import { Editor } from "@tinymce/tinymce-react";
import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CloudinaryUpload from "@/components/CloudinaryUpload/CloudinaryUpload";
import { postsApi } from "@/components/services/api/posts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/utils/apiError";

export default function CreateBlog() {
  const [form, setForm] = useState({ title: "", content: "", image: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) return;
    setForm((value) => ({ ...value, tags: [...value.tags, tag] }));
    setTagInput("");
  };

  const removeTag = (tag) => {
    setForm((value) => ({ ...value, tags: value.tags.filter((item) => item !== tag) }));
  };

  const validate = () => {
    if (!form.image || !form.title.trim() || !form.content.trim() || form.tags.length === 0) {
      toast.error("Please complete image, title, content and tags");
      return false;
    }
    return true;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await postsApi.create(form);
      toast.success("Blog created");
      navigate("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not create blog"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-10 flex items-center justify-center gap-4 text-4xl font-bold text-indigo-600 sm:text-6xl">Create Blog</h1>
      <form onSubmit={onSubmit} className="space-y-7">
        <Field label="Blog Image">
          <CloudinaryUpload value={form.image} onChange={(image) => setForm({ ...form, image })} />
        </Field>
        <Field label="Blog Title">
          <Input placeholder="Enter blog title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        </Field>
        <Field label="Blog Content">
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <Editor
              apiKey={import.meta.env.VITE_TINY_MCE_API_KEY || "c1cgdyquhop8qjw872enwutkxfd8e1unqomb943k6nrla1g5"}
              value={form.content}
              onEditorChange={(content) => setForm({ ...form, content })}
              init={{
                height: 420,
                menubar: true,
                plugins: "lists link image table code wordcount",
                toolbar:
                  "undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code",
                branding: false,
              }}
            />
          </div>
        </Field>
        <Field label="Blog Tag">
          <div className="flex gap-2">
            <Input
              placeholder="Enter blog tag"
              value={tagInput}
              onChange={(event) => setTagInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTag();
                }
              }}
            />
            <Button type="button" className="shrink-0" onClick={addTag}>
              Add Tag
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <Badge key={tag} className="gap-2">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Field>
        <div className="flex justify-center">
          <Button className="h-9 rounded-md px-4 text-sm" disabled={loading}>
            {loading ? "Creating..." : "Create Blog"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-3 block font-semibold">{label}</span>
      {children}
    </label>
  );
}
