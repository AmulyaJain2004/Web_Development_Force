import React, { useEffect, useState } from "react";
import styles from "./SelectedBookCard.module.css";
import { Button, IconButton } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";

const SelectedBookCard = ({
  data,
  isSelected,
  onSelect,
  isDescription = false,
}) => {
  const [bookData, setBookData] = useState(data);
  return (
    <div className={styles.BookCard}>
      <img
        className={styles.img}
        src={bookData.ImageURL}
        alt={bookData.Title}
      />
      <div className={styles.Details}>
        <div className={styles.info}>
          <p className="Title">{bookData.Title}</p>
          <hr className={styles.hr} />
          <p className={styles.Author}>{bookData.Author}</p>
          <p className={styles.PublishYear}>{bookData.PublishYear}</p>
        </div>
        {!isDescription ? (
          <IconButton
            sx={{
              color: isSelected ? "#1100ff" : "gray",
              transition: "color 0.3s ease",
              "&:hover": { color: isSelected ? "#0056b3" : "black" },
            }}
          >
            {isSelected ? (
              <CheckCircleIcon sx={{ fontSize: "30px" }} /> // Adjust the size as needed
            ) : (
              <CheckBoxOutlineBlankIcon sx={{ fontSize: "30px" }} /> // Adjust the size as needed
            )}
          </IconButton>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SelectedBookCard;
