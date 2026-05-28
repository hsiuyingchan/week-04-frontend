"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
}

interface BookActionsProps {
  book: Book;
  onBookUpdate: (updatedBook: Book) => void;
}

export default function BookActions({ book, onBookUpdate }: BookActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBook, setCurrentBook] = useState(book);

  async function handleMarkAsRead() {
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read", rating: currentBook.rating }),
      });

      if (!res.ok) throw new Error("Failed to update book");
      const updated = await res.json();
      setCurrentBook(updated);
      onBookUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleAddRating(rating: number) {
    setIsUpdating(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentBook.status, rating }),
      });

      if (!res.ok) throw new Error("Failed to update rating");
      const updated = await res.json();
      setCurrentBook(updated);
      onBookUpdate(updated);
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/books/${book.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete book");
      router.push("/books");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setIsDeleting(false);
    }
  }

  return (
    <>
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

      <div className="space-y-3">
        {currentBook.status !== "read" && (
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
                currentBook.rating === rating
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
    </>
  );
}
