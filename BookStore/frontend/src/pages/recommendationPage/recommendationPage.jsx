import React, { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import BookCard from "../../Components/BookCard/BookCard.jsx";
import axios from "axios";
import SelectedBookCard from "../../Components/SelectedBookCard/SelectedBookCard.jsx";
import "./recommendationPage.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { toast } from "react-hot-toast"; // Import toast
import AdminRecommendations from "../../Components/AdminRecommendation/AdminRecommendations.jsx";

const RecommendationPage = ({ isAdmin = false, loggedin = false, user }) => {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [webResults, setWebResults] = useState(null);
  const [DisplaySize, setDisplaySize] = useState(6);
  const [isDescription, setIsDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");
  const [hasRecommendation, setHasRecommendation] = useState("");
  const [recommendations, setRecommendations] = useState([]); // New state for admin
  const [recommendationState, setRecommendationState] = useState(); // New state for admin

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/books/`
      );
      setBooks(response.data.data || []);
    } catch (error) {
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch book data by ISBNs
  const fetchBooksByISBNs = async (isbns) => {
    try {
      const bookDataPromises = isbns.map((isbn) =>
        axios.get(`${import.meta.env.VITE_SERVER_URI}/books/${isbn}`)
      );
      const bookDataResponses = await Promise.all(bookDataPromises);
      return bookDataResponses.map((response) => response.data.data);
    } catch (error) {
      console.error("Error fetching books by ISBNs:", error);
      return [];
    }
  };

  // Check if the user has already made a recommendation
  const checkUserRecommendation = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/recommendations/${user}`
      );
      if (response.data.count > 0) {
        setHasRecommendation(true);
        setLoading(false);
        setRecommendationState(response.data.data[0].state);
        const bookData = await fetchBooksByISBNs(response.data.data[0].isbn);
        setSelectedBooks(bookData);
        setDescriptionText(response.data.data[0].description);
      }
    } catch (error) {
      console.error("Error checking user recommendation:", error);
    }
  };

  // Fetch all recommendations for admin
  const fetchAllRecommendations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/recommendations`
      );
      setRecommendations(response.data.data || []);
    } catch (error) {
      console.error("Error fetching all recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedin && !isAdmin) {
      checkUserRecommendation().then((hasRecommendation) => {
        if (!hasRecommendation) {
          fetchBooks();
        }
      });
    } else if (isAdmin) {
      fetchAllRecommendations();
    }
  }, [loggedin, isAdmin]);

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
      const newBooks =
        response.data.items?.slice(0, 10).map((item) => ({
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
        })) || [];
      setWebResults(newBooks);

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

  const handleSelectBook = (book) => {
    setSelectedBooks((prevSelectedBooks) => {
      if (prevSelectedBooks.find((selected) => selected.ISBN === book.ISBN)) {
        return prevSelectedBooks.filter(
          (selected) => selected.ISBN !== book.ISBN
        );
      } else {
        return [...prevSelectedBooks, book];
      }
    });
  };

  const handleNext = () => setIsDescription(true);
  const handleBack = () => setIsDescription(false);
  const handleDescriptionChange = (event) =>
    setDescriptionText(event.target.value);
  const handleSubmit = async () => {
    if (selectedBooks.length === 0 || !descriptionText) {
      toast.error("Please select at least one book and provide a description.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URI}/recommendations`, // Adjust the endpoint as needed
        {
          user: user, // Use the userID prop
          isbn: selectedBooks.map((book) => book.ISBN),
          description: descriptionText,
        }
      );
      if (response.status == 200) {
        // Handle success (e.g., show a success message or reset the form)
        toast.success("Recommendation submitted successfully!");
        // Optionally reset selectedBooks and descriptionText
        setSelectedBooks([]);
        setDescriptionText("");
        checkUserRecommendation();
      }
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      toast.error("Failed to submit recommendation. Please try again.");
    }
  };
  const handleDelete = () => {
    axios
      .delete(`${import.meta.env.VITE_SERVER_URI}/recommendations/${user}`)
      .then((response) => {
        if (response.status == 200) {
          toast.success("Recommendation deleted successfully!");
          setSelectedBooks([]);
          setDescriptionText("");
          setHasRecommendation(false);
          setIsDescription(false);
        }
      })
      .catch((error) => {
        console.error("Error deleting recommendation:", error);
        toast.error("Failed to delete recommendation. Please try again.");
      });
  };

  if (!loggedin) {
    return <div>Please log in to view recommendations.</div>;
  }

  if (isAdmin) {
    return (
      <div>
        <AdminRecommendations />
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (hasRecommendation) {
    return (
      <div>
        <h2>
          {recommendationState
            ? "Admin Recommendations"
            : "Your Previous Recommendation"}
        </h2>
        <div className="SelectedContainer">
          {selectedBooks.map((bookdata) =>
            recommendationState ? (
              <BookCard key={bookdata.ISBN} data={bookdata} />
            ) : (
              <BookCard key={bookdata.ISBN} data={bookdata} isSelected={true} />
            )
          )}
        </div>
        <div className="DescriptionSection center">
          <TextField
            label={
              recommendationState
                ? "Admin Description"
                : "Your Recommendation Description"
            }
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={descriptionText}
            InputProps={{
              readOnly: true,
              style: { color: "white" },
            }}
            InputLabelProps={{
              style: { color: "white" },
            }}
            style={{ width: "90%" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
          />
          <Button
            onClick={handleDelete}
            variant="contained"
            style={{
              marginTop: "20px",
              marginBottom: "50px",
              marginLeft: "0",
              marginRight: "0",
              width: "300px",
              backgroundColor: "red",
            }}
          >
            Delete this recommendation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!isDescription ? (
        <>
          <div className="SearchBar">
            <TextField
              onChange={handleChange}
              label="SEARCH"
              variant="standard"
              sx={{
                width: {
                  xs: "80%",
                  md: "70%",
                  lg: "30%",
                },
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiInput-underline:before": { borderBottomColor: "white" },
                "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                  borderBottomColor: "white",
                },
                "& .MuiInput-underline:after": { borderBottomColor: "white" },
              }}
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
          </div>

          <div className="BookContainer">
            {filteredBooks.length > 0 ? (
              filteredBooks
                .slice(0, DisplaySize)
                .map((bookdata) => (
                  <BookCard
                    key={bookdata.ISBN}
                    data={bookdata}
                    select={true}
                    isSelected={selectedBooks.some(
                      (book) => book.ISBN === bookdata.ISBN
                    )}
                    onSelect={handleSelectBook}
                  />
                ))
            ) : webResults ? (
              webResults.length > 0 ? (
                webResults.map((bookdata) => (
                  <BookCard
                    key={bookdata.ISBN}
                    data={bookdata}
                    select={true}
                    isSelected={selectedBooks.some(
                      (book) => book.ISBN === bookdata.ISBN
                    )}
                    onSelect={handleSelectBook}
                  />
                ))
              ) : (
                <p>No results found from the web search.</p>
              )
            ) : (
              <p>
                No results found in the database!{" "}
                <Button
                  onClick={searchWebForBooks}
                  variant="contained"
                  color="primary"
                >
                  Search on the web?
                </Button>
              </p>
            )}

            <h2 className="Selectedh2">Selected Books:</h2>
            {selectedBooks.length > 0 && (
              <div className="SelectedContainer">
                {selectedBooks.map((bookdata) => (
                  <SelectedBookCard
                    key={bookdata.ISBN}
                    onSelect={handleSelectBook}
                    isSelected={selectedBooks.some(
                      (book) => book.ISBN === bookdata.ISBN
                    )}
                    data={bookdata}
                  />
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={handleNext}
              variant="contained"
              color="primary"
              style={{ width: "35%" }}
              disabled={selectedBooks.length === 0}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="DescriptionSection">
          <Button
            onClick={handleBack}
            variant="contained"
            color="primary"
            style={{
              marginTop: "20px",
              marginLeft: "20px",
              marginBottom: "20px",
            }}
          >
            Back
          </Button>
          <h2 className="Selectedh2">Selected Books:</h2>
          {selectedBooks.length > 0 && (
            <div className="SelectedContainer">
              {selectedBooks.map((bookdata) => (
                <SelectedBookCard
                  isDescription={true}
                  key={bookdata.ISBN}
                  onSelect={handleSelectBook}
                  isSelected={selectedBooks.some(
                    (book) => book.ISBN === bookdata.ISBN
                  )}
                  data={bookdata}
                />
              ))}
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              label="About your recommendation"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={descriptionText}
              onChange={handleDescriptionChange}
              style={{ marginTop: "20px", width: "75%" }} // Set width to 75%
              InputProps={{
                style: { color: "white" }, // Ensure the input text is white
                classes: {
                  notchedOutline: {
                    borderColor: "white", // Set outline color to white
                  },
                },
              }}
              InputLabelProps={{
                style: { color: "white" }, // Ensure the label text is white
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "white", // Set outline color to white
                  },
                  "&:hover fieldset": {
                    borderColor: "white", // Set outline color to white on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "white", // Set outline color to white when focused
                  },
                },
              }}
            />

            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{
                marginTop: "20px",
                marginBottom: "50px",
                marginLeft: "0",
                marginRight: "0",
                width: "250px",
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationPage;
