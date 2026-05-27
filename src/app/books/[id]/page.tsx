"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
}

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  async function fetchBook() {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/books/${id}`);
      if (!res.ok) throw new Error("Book not found");
      const data = await res.json();
      setBook(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead() {
    if (!book) return;
    setIsUpdating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read", rating: book.rating }),
      });

      if (!res.ok) throw new Error("Failed to update book");
      const updated = await res.json();
      setBook(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAddRating(rating: number) {
    if (!book) return;
    setIsUpdating(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: book.status, rating }),
      });

      if (!res.ok) throw new Error("Failed to update rating");
      const updated = await res.json();
      setBook(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this book?")) return;
    setIsDeleting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/books/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");
      router.push("/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading book...</div>;
  if (error || !book) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href="/books" className="text-blue-500 hover:underline mb-6 inline-block">
        ← Back to Books
      </Link>

      <div className="bg-white border rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
        <p className="text-xl text-gray-600 mb-6">by {book.author}</p>

        <div className="space-y-4 mb-8">
          <div>
            <span className="font-bold">Status:</span>{" "}
            <span className="px-3 py-1 bg-gray-100 rounded">
              {book.status.replace("_", " ")}
            </span>
          </div>
          <div>
            <span className="font-bold">Rating:</span>{" "}
            {book.rating ? (
              <span className="text-yellow-500 text-lg">★ {book.rating}</span>
            ) : (
              <span className="text-gray-400">Not rated</span>
            )}
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

        <div className="space-y-3">
          {book.status !== "read" && (
            <button
              onClick={handleMarkAsRead}
              disabled={isUpdating}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Mark as Read"}
            </button>
          )}

          <div className="flex gap-2">
            <span className="font-bold py-2">Rate this book:</span>
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleAddRating(rating)}
                disabled={isUpdating}
                className={`px-3 py-1 rounded ${
                  book.rating === rating
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-200 hover:bg-yellow-300"
                } disabled:opacity-50`}
              >
                {rating}★
              </button>
            ))}
          </div>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
