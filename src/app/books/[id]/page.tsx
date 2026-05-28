import Link from "next/link";
import BookActions from "./BookActions";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
}

async function fetchBook(id: number): Promise<Book | null> {
  try {
    const apiUrl = "http://localhost:8000";
    const res = await fetch(`${apiUrl}/books/${id}`, {
      cache: "no-store",
      next: { revalidate: 0 }
    });
    if (!res.ok) {
      console.error(`Failed to fetch book ${id}: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (err) {
    console.error(`Error fetching book ${id}:`, err);
    return null;
  }
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = parseInt(resolvedParams.id);
  const book = await fetchBook(id);

  if (!book) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">Book not found</div>
        <Link href="/books" className="text-blue-500 hover:underline">
          ← Back to Books
        </Link>
      </div>
    );
  }

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

        <BookActions book={book} />
      </div>
    </div>
  );
}
