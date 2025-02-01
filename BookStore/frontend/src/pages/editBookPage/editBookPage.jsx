import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./editBookPage.module.css"; // Import styles from CSS Module
import toast from "react-hot-toast";

const EditBookPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [imageURL, setImageURL] = useState(""); // State for the image URL
  const [amazonURL, setAmazonURL] = useState("");
  const { id: ISBN } = useParams();

  // Fetch book data by ISBN
  const fetchBookData = async (ISBN) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/books/${ISBN}`
      );
      const bookData = response.data.data;
      setData(bookData);
      setTitle(bookData.Title); // Set title
      setAuthor(bookData.Author); // Set author
      setPublishYear(bookData.PublishYear); // Set publish year
      setIsbn(bookData.ISBN); // Set ISBN
      setImageURL(bookData.ImageURL); // Set image URL
      setAmazonURL(bookData.AmazonURL); // Set Amazon URL
    } catch (error) {
      console.error("Error fetching book data:", error.message); // Error handling
    }
  };

  // Fetch book data when component mounts
  useEffect(() => {
    if (ISBN && ISBN !== "new") {
      fetchBookData(ISBN);
    }
    if (ISBN === "new") {
      navigate("/add");
    }
  }, [ISBN]);

  // Handle form submission (update book)

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        Title: title,
        Author: author,
        PublishYear: publishYear,
        ISBN: isbn, // Keep the ISBN same (disabled in form)
        ImageURL: imageURL,
        AmazonURL: amazonURL,
      };

      await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/books/${ISBN}`,
        updatedBook
      );
      toast.success("Book updated successfully!");

      // Navigate back to the book list or another page after success
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error updating book:", error.message);
      toast.error("Error updating the book.");
    }
  };
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleUpdate}>
        <h2>Edit Book</h2>
        <hr className={styles.hr} />

        {/* Display poster if imageURL exists */}
        {imageURL && (
          <div className={styles.posterContainer}>
            <img
              src={imageURL}
              alt="Book Poster"
              className={styles.bookPoster}
            />
          </div>
        )}

        {/* Title Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title
            required
          />
        </div>

        {/* Author Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)} // Update author
            required
          />
        </div>

        {/* Publish Year Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="publishYear">Publish Year</label>
          <input
            type="text"
            id="publishYear"
            placeholder="Publish Year"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)} // Update publish year
            required
          />
        </div>

        {/* ISBN Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            placeholder="ISBN"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)} // Update ISBN
            required
            disabled
          />
        </div>

        {/* Poster URL Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="imageURL">Poster URL</label>
          <input
            type="text"
            id="imageURL"
            placeholder="Poster URL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)} // Update image URL
            required
          />
        </div>

        {/* Amazon URL Input */}
        <div className={styles.inputGroup}>
          <label htmlFor="amazonURL">Amazon URL</label>
          <input
            type="text"
            id="amazonURL"
            placeholder="Amazon URL"
            value={amazonURL}
            onChange={(e) => setAmazonURL(e.target.value)} // Update Amazon URL
            required
          />
        </div>

        <button type="submit" className={styles.loginBtn}>
          Update
        </button>
        <hr className={styles.hr} />
      </form>
    </div>
  );
};

export default EditBookPage;
