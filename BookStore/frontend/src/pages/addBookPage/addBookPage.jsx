import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./addBookPage.module.css"; // Import styles from CSS Module
import toast from "react-hot-toast";

const AddBookPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publishYear, setPublishYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [imageURL, setImageURL] = useState(""); // State for the image URL
  const [amazonURL, setAmazonURL] = useState("");
  const [New, setnew] = useState(false);
  const { id: ISBN } = useParams();

  const handleReset = () => {
    CancelToast();
  };

  const CancelToast = () => {
    toast(
      (t) => (
        <span className={styles.CancelToast}>
          <div className="text">
            Do you really want to cancel and go back to the home page?
          </div>
          <div className={styles.buttons}>
            <button
              className={styles.Yes}
              onClick={() => {
                toast.dismiss(t.id);
                navigate("/"); // Navigate to home page
              }}
            >
              Yes
            </button>

            <button className={styles.No} onClick={() => toast.dismiss(t.id)}>
              No
            </button>
          </div>
        </span>
      ),
      { duration: Infinity }
    );
  };
  const handleAdd = async (e) => {};
  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleAdd}>
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
          Add Book
        </button>
        <button
          type="reset"
          className={styles.CancelBtn}
          onClick={(e) => {
            e.preventDefault();
            CancelToast();
          }}
        >
          Cancel
        </button>
        <hr className={styles.hr} />
      </form>
    </div>
  );
};

export default AddBookPage;
