import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import BookCard from "../BookCard/BookCard.jsx";
import SelectedBookCard from "../SelectedBookCard/SelectedBookCard.jsx";
import { toast } from "react-hot-toast";

const AdminRecommendations = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/recommendations`
      );
      setRequests(response.data.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URI}/books`
      );
      setBooks(response.data.data || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchUserBooks = (isbnList) => {
    isbnList.forEach((isbn) => {
      axios
        .get(`${import.meta.env.VITE_SERVER_URI}/books/${isbn}`)
        .then((res) => {
          setUserBooks((prevBooks) => [...prevBooks, res.data.data]); // Append each book to the state
        })
        .catch((error) => {
          console.error("Error fetching book with ISBN:", isbn, error);
        });
    });
  };

  const handleRequestChange = (event) => {
    const requestId = event.target.value;
    const request = requests.find((req) => req._id === requestId);
    setSelectedRequest(request);
    setSelectedBooks([]);
    setDescription("");
    if (request && request.isbn) {
      fetchUserBooks(request.isbn);
    }
    fetchBooks();

    // Fetch detailed book data for each ISBN in selected request
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

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedBooks.length === 0 || !description) {
      toast.error("Please select at least one book and provide a description.");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URI}/recommendations/${
          selectedRequest.user
        }`,
        {
          isbn: selectedBooks.map((book) => book.ISBN),
          description,
          state: true,
        }
      );
      toast.success("Recommendation submitted successfully!");
      setSelectedRequest(null);
      setSelectedBooks([]);
      setDescription("");
      setUserBooks([]);
      fetchRequests();
    } catch (error) {
      console.error("Error submitting recommendation:", error);
      toast.error("Failed to submit recommendation. Please try again.");
    }
  };

  const filteredBooks = books.filter((book) => {
    const searchTerm = search.toLowerCase();
    return (
      book.Title.toLowerCase().includes(searchTerm) ||
      book.Author.toLowerCase().includes(searchTerm) ||
      book.PublishYear.toString().includes(searchTerm)
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ margin: "0px" }}>
      <div className="center">
        <h2 style={{ marginLeft: "30px" }}>Admin Recommendations</h2>
        <FormControl fullWidth style={{ width: "75%" }}>
          <InputLabel id="request-select-label">Select User Request</InputLabel>
          <Select
            labelId="request-select-label"
            value={selectedRequest ? selectedRequest._id : ""}
            onChange={handleRequestChange}
          >
            {requests.filter((request) => !request.state).length > 0 ? (
              requests
                .filter((request) => !request.state) // Only include requests with state === false
                .map((request) => (
                  <MenuItem key={request._id} value={request._id}>
                    {request.user}
                  </MenuItem>
                ))
            ) : (
              <MenuItem disabled value="">
                No requests for recommendations
              </MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
      {selectedRequest && (
        <div style={{ margin: "0px" }}>
          <h2 style={{ marginLeft: "30px" }}>User Books</h2>
          <h4 style={{ marginLeft: "30px" }}>{selectedRequest.description}</h4>
          <div className="SelectedContainer">
            {userBooks.map((book) => (
              <SelectedBookCard data={book} key={book.ISBN} isSelected={true} />
            ))}
          </div>
          <div className="SearchBar">
            <TextField
              style={{ width: "70%" }}
              onChange={handleSearchChange}
              label="SEARCH"
              variant="standard"
              fullWidth
            />
          </div>

          <div className="BookContainer">
            {filteredBooks.slice(0, 5).map((bookdata) => (
              <BookCard
                key={bookdata.ISBN}
                data={bookdata}
                select={true}
                isSelected={selectedBooks.some(
                  (book) => book.ISBN === bookdata.ISBN
                )}
                onSelect={handleSelectBook}
              />
            ))}
          </div>

          <h2 style={{ marginLeft: "30px" }}>Selected Books:</h2>
          <div className="SelectedContainer">
            {selectedBooks.map((bookdata) => (
              <SelectedBookCard
                fetch={true}
                key={bookdata.ISBN}
                data={bookdata}
                isSelected={true}
                onSelect={handleSelectBook}
              />
            ))}
          </div>

          <div className="center">
            <TextField
              label="Recommendation Description"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={description}
              onChange={handleDescriptionChange}
              style={{ marginTop: "20px", marginRight: "0", width: "70%" }}
            />

            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              style={{ marginTop: "20px", marginRight: "0", width: "70%" }}
            >
              Submit Recommendation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecommendations;
