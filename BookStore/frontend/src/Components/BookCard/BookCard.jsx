import React from "react";
import "./BookCard.css";
import { Button, IconButton } from "@mui/material";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BookCard = ({ data, admin, reload, select, onSelect, isSelected }) => {
  const navigate = useNavigate();

  // Function to delete book and reload the data if successful
  const DeleteBook = async (ISBN) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URI}/books/${ISBN}`
      );

      if (response.status === 200) {
        toast.success(`Book "${data.Title}" deleted successfully!`, {
          duration: 3000,
        });
        reload();
      }
    } catch (error) {
      toast.error(`Failed to delete book "${data.Title}". Please try again.`, {
        duration: 3000,
      });
    }
  };

  // Toast confirmation for deleting a book
  const DeleteBookToast = ({ bookName, ISBN }) => {
    toast(
      (t) => (
        <span className="DeleteToast">
          <div className="text">
            Do you really want to delete the book "<b>{bookName}</b>"?
          </div>
          <div className="buttons">
            <button className="Cancel" onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
            <button
              className="Delete"
              onClick={() => {
                toast.dismiss(t.id);
                DeleteBook(ISBN);
              }}
            >
              Delete
            </button>
          </div>
        </span>
      ),
      { duration: Infinity }
    );
  };

  // Function to navigate to the book edit page
  const EditBook = (ISBN) => {
    navigate(`/edit/${ISBN}`);
  };

  return (
    <div className="BookCard">
      <img src={data.ImageURL} alt={data.Title} />
      <div className="Details">
        <div className="info">
          <p className="Title">{data.Title}</p>
          <hr className="hr" />
          <p className="Author">{data.Author}</p>
          <p className="PublishYear">{data.PublishYear}</p>
        </div>

        <a className="BuyNow" target="blank" href={data.AmazonURL}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              width: "200px",
              borderRadius: "10px",
              fontSize: "16px",
              padding: "10px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "white",
              backgroundColor: "#7C42E2",
              "&:hover": {
                backgroundColor: "#4f10bc",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            Buy Now
          </Button>
        </a>

        {select && (
          <IconButton
            onClick={() => onSelect(data)}
            sx={{
              color: isSelected ? "#1100ff" : "gray",
              transition: "color 0.3s ease",
              "&:hover": { color: isSelected ? "#0056b3" : "black" },
            }}
          >
            {isSelected ? <CheckCircleIcon /> : <CheckBoxOutlineBlankIcon />}
          </IconButton>
        )}

        {admin && (
          <div className="icons">
            <IconButton
              sx={{
                color: "#1e90ff",
                marginLeft: "10px",
                transition:
                  "color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  color: "#0056b3",
                  transform: "scale(1.1)",
                },
              }}
              onClick={() => EditBook(data.ISBN)}
            >
              <SaveAsRoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>

            <IconButton
              sx={{
                color: "red",
                marginLeft: "10px",
                "&:hover": {
                  color: "#ff0000",
                  transform: "scale(1.1)",
                },
              }}
              onClick={() =>
                DeleteBookToast({ bookName: data.Title, ISBN: data.ISBN })
              }
            >
              <DeleteRoundedIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
