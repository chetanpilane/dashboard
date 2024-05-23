import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  Paper, TablePagination, TextField, Button, Typography, IconButton
} from '@mui/material';
import { CSVLink } from "react-csv";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const columns = [
  { id: 'ratings_average', label: 'Ratings Average' },
  { id: 'author_name', label: 'Author Name' },
  { id: 'title', label: 'Title' },
  { id: 'first_publish_year', label: 'First Publish Year' },
  { id: 'subject', label: 'Subject' },
  { id: 'author_birth_date', label: 'Author Birth Date' },
  { id: 'author_top_work', label: 'Author Top Work' }
];

const BookTable = () => {
  const [books, setBooks] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('author_name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [editableRow, setEditableRow] = useState(null);
  const [editedBook, setEditedBook] = useState({});

  useEffect(() => {
    if (searchTerm) {
      fetchBooks();
    } else {
      setBooks([]);
    }
  }, [page, rowsPerPage, searchTerm]);

  const fetchBooks = async () => {
    const url = `https://openlibrary.org/search.json?author=${searchTerm}&limit=${rowsPerPage}&offset=${page*rowsPerPage}`;
    try {
      const response = await axios.get(url);
      const booksData = response.data.docs.map(book => ({
        ...book,
        author_name: Array.isArray(book.author_name) ? book.author_name.join(', ') : book.author_name
      }));

      // Sort books by author name
      booksData.sort((a, b) => {
        const authorA = a.author_name || '';
        const authorB = b.author_name || '';
        return authorA.localeCompare(authorB);
      });

      setBooks(booksData);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Network error, unable to fetch books');
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (index) => {
    setEditableRow(index);
    setEditedBook(books[index]);
  };

  const handleSaveClick = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index] = editedBook;
    setBooks(updatedBooks);
    setEditableRow(null);
  };

  const handleInputChange = (e, columnId) => {
    const { value } = e.target;
    setEditedBook({ ...editedBook, [columnId]: value });
  };

  return (
    <Paper>
      <TextField
        label="Search by Author"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {error && <Typography color="error">{`Error: ${error}`}</Typography>}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {editableRow === index ? (
                      <TextField
                        value={editedBook[column.id] || ''}
                        onChange={(e) => handleInputChange(e, column.id)}
                      />
                    ) : (
                      book[column.id] || 'N/A'
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  {editableRow === index ? (
                    <IconButton onClick={() => handleSaveClick(index)}>
                      <SaveIcon />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleEditClick(index)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={books.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Button variant="contained" color="primary">
        <CSVLink data={books} filename={"books.csv"} style={{ color: "white" }}>
          Download CSV
        </CSVLink>
      </Button>
    </Paper>
  );
};

export default BookTable;

