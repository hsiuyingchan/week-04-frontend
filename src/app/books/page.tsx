"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/books`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center">Loading books...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Link
          href="/books/new"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Book
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No books yet. Start by adding one!</p>
          <Link
            href="/books/new"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded inline-block"
          >
            Add First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link key={book.id} href={`/books/${book.id}`}>
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white">
                <h2 className="font-bold text-lg mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-2">by {book.author}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                    {book.status.replace("_", " ")}
                  </span>
                  {book.rating && (
                    <span className="text-yellow-500 font-bold">★ {book.rating}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
