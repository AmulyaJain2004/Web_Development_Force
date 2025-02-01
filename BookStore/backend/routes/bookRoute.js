import express from 'express';
import { Book } from '../models/bookModel.js';
import redisClient from '../utils/redisClient.js'; // Initialize Redis client in a separate file

const router = express.Router();



// Route to get all books
router.get(['/', '/reset'], async (req, res) => {
    try {
        const { path } = req;

        // Check if the request is for the /reset route
        if (path === '/reset') {
            console.log('Resetting Redis cache and fetching books from database');

            // Fetch books from database
            const books = await Book.find({});

            // Reset the Redis cache
            await redisClient.setEx('books', 3600, JSON.stringify(books)); // Cache for 1 hour

            console.log('Books fetched from database and Redis cache reset');
            return res.status(200).json({ message: 'Success! Redis cache reset and books fetched from database', count: books.length });
        }

        // Handle regular request to get books
        const cachedBooks = await redisClient.get('books');

        if (cachedBooks) {
            console.log('Books fetched from cache');
            return res.status(200).json({
                count: JSON.parse(cachedBooks).length,
                data: JSON.parse(cachedBooks),
            });
        } else {
            // Fetch books from database and cache them
            const books = await Book.find({});
            await redisClient.setEx('books', 3600, JSON.stringify(books)); // Cache for 1 hour

            console.log('Books fetched from database');
            return res.status(200).json({
                count: books.length,
                data: books,
            });
        }
    } catch (error) {
        console.log('Error occurred while fetching books:', error.message);
        res.status(500).json({ message: error.message });
    }
});


// Route to get a single book by ISBN
router.get('/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const book = await Book.findOne({ ISBN: isbn });

        if (!book) {
            console.log(`Book not found with ISBN: ${isbn}`);
            return res.status(404).json({ message: 'Book not found' });
        }

        console.log('Fetched book details:', book);
        return res.status(200).json({ data: book });

    } catch (error) {
        console.log('Error occurred while fetching book:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Helper function to update the cache
const updateCache = async (books) => {
    try {
        await redisClient.setEx('books', 3600, JSON.stringify(books)); // Cache for 1 hour
    } catch (error) {
        console.log('Error updating cache:', error.message);
    }
};

// Route to post books
router.post('/', async (req, res) => {
    try {
        const { Title, Author, PublishYear, ISBN, ImageURL, AmazonURL } = req.body;

        if (!Title || !Author || !PublishYear || !ISBN || !ImageURL || !AmazonURL) {
            return res.status(400).json({
                message: 'Please provide all required fields: Title, Author, PublishYear, ISBN, ImageURL, AmazonURL',
            });
        }

        const existingBook = await Book.findOne({ ISBN });
        if (existingBook) {
            console.log(`Book already exists with ISBN: ${ISBN}`);
            return res.status(409).json({ message: 'Book Already Exists.' });
        }

        const newBook = new Book({ Title, Author, PublishYear, ISBN, ImageURL, AmazonURL });
        const book = await Book.create(newBook);

        // Update the cached books
        // const cachedBooks = await redisClient.get('books');
        // if (cachedBooks) {
        //     const books = JSON.parse(cachedBooks);
        //     books.push(book); // Add the new book to the cached list
        //     await updateCache(books);
        // }
        console.log('Book added successfully:', book);
        return res.status(201).json(book);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a book by ISBN
router.put('/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const { Title, Author, PublishYear, ISBN, ImageURL, AmazonURL } = req.body;

        if (!Title || !Author || !PublishYear || !ISBN || !ImageURL || !AmazonURL) {
            return res.status(400).json({
                message: 'Please provide all required fields: Title, Author, PublishYear, ISBN, ImageURL, AmazonURL',
            });
        }

        const updatedBook = await Book.findOneAndUpdate({ ISBN: isbn }, req.body, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the cached books
        const cachedBooks = await redisClient.get('books');
        if (cachedBooks) {
            const books = JSON.parse(cachedBooks);
            const updatedBooks = books.map(book => (book.ISBN == isbn ? updatedBook : book));
            await updateCache(updatedBooks);
        }

        return res.status(200).json({ data: updatedBook });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete a book by ISBN
router.delete('/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const deletedBook = await Book.findOneAndDelete({ ISBN: isbn });

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update the cached books
        const cachedBooks = await redisClient.get('books');
        if (cachedBooks) {
            const books = JSON.parse(cachedBooks);
            console.log(books.filter(book => book.ISBN == isbn));
            const updatedBooks = books.filter(book => book.ISBN != isbn);
            await updateCache(updatedBooks);
        }

        return res.status(200).json({ message: 'Book deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



export default router;
