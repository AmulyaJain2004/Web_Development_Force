import React, { useEffect, useState } from "react";
import NavBar from "../../Components/NavBar/NavBar.jsx";
import { TextField, IconButton, Button } from "@mui/material";
import BookCard from "../../Components/BookCard/BookCard.jsx";
import axios from "axios";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [webResults, setWebResults] = useState(null); // Temporary storage for web search results
  const [DisplaySize, setDisplaySize] = useState(50);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/books/`
      );
      setBooks(response.data.data || []); // Access data correctly from response
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => {
    const searchTerm = search.toLowerCase();
    return (
      book.Title.toLowerCase().includes(searchTerm) ||
      book.Author.toLowerCase().includes(searchTerm) ||
      book.PublishYear.toString().includes(searchTerm)
    );
  });

  const searchWebForBooks = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${search}`
      );
      const newBooks = response.data.items.slice(0, 15).map((item) => ({
        Title: item.volumeInfo.title,
        Author: item.volumeInfo.authors?.[0] || "Unknown Author",
        PublishYear: item.volumeInfo.publishedDate
          ? new Date(item.volumeInfo.publishedDate).getFullYear()
          : "Unknown Year",
        ISBN:
          item.volumeInfo.industryIdentifiers?.find(
            (id) => id.type === "ISBN_13"
          )?.identifier || "N/A",
        ImageURL: item.volumeInfo.imageLinks?.thumbnail || "No Image",
        AmazonURL: item.volumeInfo.infoLink,
      }));
      setWebResults(newBooks); // Store web search results

      // Post new books to the database
      for (const book of newBooks) {
        try {
          await axios.post(`${import.meta.env.VITE_SERVER_URI}/books`, book);
        } catch (error) {
          console.error(
            `Error posting book ${book.Title} to the database:`,
            error
          );
        }
      }

      fetchBooks(); // Fetch books again to include the new ones
    } catch (error) {
      console.error("Error fetching books from the web:", error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value);
    setWebResults(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const iconButtonStyle = {
    backgroundColor: "rgba(40, 1, 55, 0.5)",
    width: "55px",
    height: "55px",
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    bottom: "5%",
    right: "3%",
    transform: "translate(50%, -50%)",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  };

  const iconStyle = {
    fontSize: "30px",
    color: "#ffffff",
  };

  const handleAddBook = () => {
    navigate("/add");
  };

  return (
    <div>
      <div className="SearchBar">
        <TextField
          onChange={handleChange}
          id="standard-basic"
          label="SEARCH"
          variant="standard"
          sx={{
            width: {
              xs: "80%",
              md: "70%",
              lg: "30%",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiInput-underline:before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
              borderBottomColor: "white",
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "white",
            },
          }}
          InputLabelProps={{
            style: { color: "white" },
          }}
          InputProps={{
            style: { color: "white" },
          }}
        />
      </div>
      <IconButton
        style={iconButtonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#280137")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(40, 1, 55, 0.5)")
        }
        onClick={handleAddBook}
      >
        <AddRoundedIcon style={iconStyle} />
      </IconButton>
      <div className="BookContainer">
        {filteredBooks.length > 0 ? (
          filteredBooks
            .reverse()
            .slice(0, DisplaySize)
            .map((bookdata) => (
              <BookCard
                reload={fetchBooks}
                admin={true}
                key={bookdata.ISBN}
                data={bookdata}
              />
            ))
        ) : webResults ? (
          webResults.map((bookdata) => (
            <BookCard key={bookdata.ISBN} data={bookdata} />
          ))
        ) : (
          <p>
            No results found in the database!
            <Button
              onClick={searchWebForBooks}
              variant="contained"
              color="primary"
              style={{ marginLeft: "10px" }}
            >
              Search on the web?
            </Button>
          </p>
        )}
      </div>
      <div
        className="LoadMore"
        style={{ textAlign: "center", marginTop: "20px" }}
      >
        {!search && (
          <Button
            onClick={() => setDisplaySize(DisplaySize + 20)}
            style={{
              backgroundColor: "#280137",
              color: "white",
              padding: "10px 20px", // Add some padding for better appearance
              border: "none",
              cursor: "pointer",
              margin: "10px 0 20px 0",
              transition: "background-color 0.3s", // Smooth transition for hover
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#3a0e5a")
            } // Darker shade on hover
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#280137")
            } // Reset to original color
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
