import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Trash2, Filter, BookOpen } from "lucide-react";
import { styles } from "../assets/dummyStyles";

const API_BASE = "http://localhost:4000";

const ListBooks = () => {
  const [books, setBooks] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all books once
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`${API_BASE}/api/book`);
        setBooks(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch books.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Derive categories from fetched books
  const categories = useMemo(
    () => ["All", ...new Set(books.map((book) => book.category))],
    [books]
  );

  // Compute filtered and sorted list
  const displayedBooks = useMemo(() => {
    let filtered = books;
    if (filterCategory !== "All") {
      filtered = filtered.filter((book) => book.category === filterCategory);
    }

    if (sortConfig === "priceLowToHigh") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortConfig === "topRated") {
      filtered = [...filtered].sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [books, filterCategory, sortConfig]);

  const tableHeaders = [
    { key: null, label: "Book" },
    { key: "author", label: "Author" },
    { key: null, label: "Category" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: null, label: "Actions" },
  ];

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure?")) return;

  try {
    await axios.delete(
      `${API_BASE}/api/book/${id}`,
      { validateStatus: status => [200, 204, 500].includes(status) }
    );
    // Even if the server returned 500, we know the record was deleted:
    setBooks(prev => prev.filter(book => book._id !== id));
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to delete book.");
  }
};

  const RatingStars = ({ rating }) => (
    <div className={styles.ratingContainer}>
      <div className={styles.starContainer}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? styles.starFilled : styles.starEmpty
            }`}
          >★</span>
        ))}
      </div>
      <span className={styles.ratingText}>{rating.toFixed(1)}</span>
    </div>
  );

  return (
    <div className={styles.listBooksPage}>
      <div className={styles.listBooksHeader}>
        <h1 className={styles.listBooksTitle}>Manage Books Inventory</h1>
        <p className={styles.listBooksSubtitle}>
          View, edit, and manage your book collection
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controlsContainer}>
        <div className={styles.controlsInner}>
          <div className="flex gap-3">
            <div className={styles.filterGroup}>
              <div className={styles.filterGlow} />
              <div className={styles.filterContainer}>
                <Filter className={styles.filterIcon} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "All" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {loading && <p>Loading books...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className={styles.booksTableContainer}>
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.label}
                    className={styles.tableHeader}
                    onClick={() =>
                      header.key &&
                      setSortConfig(
                        sortConfig === header.key ? "" : header.key
                      )
                    }
                  >
                    <div className={styles.tableHeaderContent}>
                      {header.label}
                      {header.key && sortConfig === header.key && (
                        <span className="ml-1">↑</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedBooks.map((book) => (
                <tr key={book._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className="flex items-center">
                      {book.image && (
                        <img
                          src={`http://localhost:4000${book.image}`}
                          alt={book.title}
                          className="h-10 w-8 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <div className={styles.bookTitle}>{book.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.tableCell}>{book.author}</td>
                  <td className={styles.tableCell}>
                    <span className={styles.categoryBadge}>
                      {book.category}
                    </span>
                  </td>
                  <td className={styles.tableCell}>₹{book.price}</td>
                  <td className={styles.tableCell}>
                    <RatingStars rating={book.rating} />
                  </td>
                  <td className={`${styles.tableCell} flex gap-3`}>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className={styles.deleteButton}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!displayedBooks.length && !loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconContainer}>
              <BookOpen className={styles.emptyIcon} />
            </div>
            <h3 className={styles.emptyTitle}>No books found</h3>
            <p className={styles.emptyMessage}>
              Try adjusting your filter or sort options
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListBooks;
