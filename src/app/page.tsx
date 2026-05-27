import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">📚 Welcome to Book Tracker</h1>
        <p className="text-xl text-gray-600 mb-8">
          Keep track of the books you've read and want to read
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/books"
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded text-lg font-bold"
          >
            View My Books
          </Link>
          <Link
            href="/books/new"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded text-lg font-bold"
          >
            Add a Book
          </Link>
        </div>
      </div>
    </div>
  );
}
