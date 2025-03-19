import { Box, Grid, LinearProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { useDispatch } from "react-redux";
import { saveDescription } from "../../actions/modelAction";
import { BACKEND_BASE_URL } from "../../config/config.js";
import axios from "axios";
import Cookies from "js-cookie";
import "../../App.css";
import LoadingDialog from "./LoadingDialog";
import { Backdrop, CircularProgress } from "@mui/material";

const TableComponent = ({ rows, setPosts, sortBy, setSortBy, sortOrder, setSortOrder, rowsPerPage = { lg: 4, md: 4 } }) => {
  const dispatch = useDispatch();
  const csrfToken = Cookies.get("csrftoken");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "X-CSRFToken": csrfToken,
    },
  };
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState(null);
  const [currentRowsPerPage, setCurrentRowsPerPage] = useState(window.innerWidth >= 1200 ? rowsPerPage.lg : rowsPerPage.md);
  const [showModelType, setShowModelType] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => {
      const newRowsPerPage = window.innerWidth >= 1200 ? rowsPerPage.lg : rowsPerPage.md;
      if (newRowsPerPage !== currentRowsPerPage) {
        setCurrentRowsPerPage(newRowsPerPage);
        setPage(0); // Reset to first page when screen size changes
      }
      
      // Update showModelType based on window width
      setShowModelType(window.innerWidth > 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [rowsPerPage, currentRowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (modelToDelete) {
      axios
        .delete(BACKEND_BASE_URL + modelToDelete.id + `/`, config)
        .then((res) => {
          setPosts(res.data);
          dispatch({ type: "GET_REVIEW_SUCCESS", payload: res.data });
          setDeleteDialogOpen(false);
          setModelToDelete(null);
        })
        .catch((err) => {
          console.log(err);
          setDeleteDialogOpen(false);
          setModelToDelete(null);
        });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setModelToDelete(null);
  };

  const getSortedRows = () => {
    if (!sortBy) return rows;
    
    return [...rows].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      // Handle null values
      if (aVal === null) aVal = sortBy === 'overall_score' ? -1 : '';
      if (bVal === null) bVal = sortBy === 'overall_score' ? -1 : '';
      
      // Convert to numbers for score comparison
      if (sortBy === 'overall_score') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
  };

  const handleOpen = (id) => {
    setSelectedModelId(id);
    setLoadingDialogOpen(true);
    axios
      .post(BACKEND_BASE_URL + 'dashboard/' + id + '/', config)
      .then(res => {
        if(res.data === 'Success') {
          setLoadingOpen(false);
        }
      })
      .catch(err => {
        console.log(err);
        setLoadingOpen(false);
        setLoadingDialogOpen(false);
      });
  };

  const formatAlgorithmName = (name) => {
    // First handle the XGB special case
    const xgbHandled = name.replace(/XGB(?=[A-Z])/g, 'XGB ');
    // Then add spaces before other capital letters, excluding the XGB sequence
    return xgbHandled.replace(/(?<!X)(?<!G)(?<!B)([A-Z])/g, ' $1').trim();
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ 
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'none',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  fontWeight: "bold",
                  backgroundColor: '#F8FAFC',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  width: '90px'
                }}
              >
                View
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  fontWeight: "bold",
                  backgroundColor: '#F8FAFC',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  width: { xs: '200px', sm: '250px', md: '150px' }
                }}
              >
                Model Name
              </TableCell>
              {showModelType && (
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "'SF Pro Display', sans-serif",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem"  },
                    fontWeight: "bold",
                    backgroundColor: '#F8FAFC',
                    borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                    width: { xs: '150px', sm: '150px', md: '150px', lg: '150px'}
                  }}
                >
                  Model Type
                </TableCell>
              )}
              <TableCell
                align="left"
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  fontWeight: "bold",
                  backgroundColor: '#F8FAFC',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  width: { xs: '150px', sm: '150px', md: '150px', lg: '250px'}
                }}
              >
                Algorithm
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  fontFamily: "'SF Pro Display', sans-serif",
                  fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  fontWeight: "bold",
                  backgroundColor: '#F8FAFC',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  width: { xs: '150px', sm: '150px', md: '150px' }
                }}
              >
                Score
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  backgroundColor: '#F8FAFC',
                  borderBottom: '2px solid rgba(0, 0, 0, 0.08)',
                  width: '48px'
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {getSortedRows().slice(page * currentRowsPerPage, page * currentRowsPerPage + currentRowsPerPage).map((row, index) => (
              <TableRow
                key={index}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  <IconButton onClick={() => handleOpen(row.id)}>
                    <OpenInNewIcon />
                  </IconButton>
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "'SF Pro Display', sans-serif",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    maxWidth: '250px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {row.model_name}
                </TableCell>
                {showModelType && (
                  <TableCell
                    align="left"
                    sx={{
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    }}
                  >
                    {row.model_type}
                  </TableCell>
                )}
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "'SF Pro Display', sans-serif",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                  }}
                >
                  {formatAlgorithmName(row.algorithm_name)}
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    fontFamily: "'SF Pro Display', sans-serif",
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    width: '150px'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flex: 1, mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Number(row.overall_score) || 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: Number(row.overall_score) >= 80 ? '#4CAF50' :
                                          Number(row.overall_score) >= 60 ? '#FFA726' : '#EF5350'
                          }
                        }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: '40px',
                        fontFamily: "'SF Pro Display', sans-serif",
                        fontWeight: '600',
                        color: Number(row.overall_score) >= 80 ? '#2E7D32' :
                               Number(row.overall_score) >= 60 ? '#E65100' : '#C62828'
                      }}
                    >
                      {row.overall_score}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => handleDeleteClick(row)}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(211, 47, 47, 0.04)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[currentRowsPerPage]}
          component="div"
          count={rows.length}
          rowsPerPage={currentRowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{
            '.MuiTablePagination-toolbar': {
              minHeight: '48px',
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontFamily: "'SF Pro Display', sans-serif",
              fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
            }
          }}
        />
      </TableContainer>

      <LoadingDialog 
        open={loadingDialogOpen} 
        setOpen={setLoadingDialogOpen}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '16px',
            maxWidth: '400px'
          }
        }}
      >
        <DialogTitle sx={{ 
          p: 0,
          mb: 2,
          fontFamily: "'SF Pro Display', sans-serif",
          fontSize: '1.25rem',
          fontWeight: '600'
        }}>
          Delete Model
        </DialogTitle>
        <DialogContent sx={{ p: 0, mb: 3 }}>
          <Typography sx={{ 
            color: 'text.secondary',
            fontFamily: "'SF Pro Display', sans-serif",
            fontSize: '0.95rem'
          }}>
            Are you sure you want to delete "{modelToDelete?.model_name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 0 }}>
          <Button 
            onClick={handleDeleteCancel}
            sx={{
              textTransform: 'none',
              fontFamily: "'SF Pro Display', sans-serif",
              fontWeight: '600',
              color: 'text.secondary'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: 'none',
              fontFamily: "'SF Pro Display', sans-serif",
              fontWeight: '600',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default TableComponent;
