import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import { useSelector } from "react-redux";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { withStyles } from "@mui/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CustomTooltip = withStyles({
  tooltip: {
    minWidth: "450px",
    textAlign: "center",
  }
})(Tooltip);

const TableComponent = ({ descrip, setDescrip, tooltipId, setTooltipId }) => {
  const { response, description } = useSelector((state) => state.model);
  const [page, setPage] = useState(0);
  const rowsPerPage = 8; // Number of data rows per page

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleOpen = () => { };

  const handleClose = () => { };

  useEffect(() => {
    if (description && description.description) {
      setDescrip(description.description);
    }
  }, [description]);

  const onChange = (e, name) => {
    let new_descr = { ...descrip };
    new_descr[name] = e.target.value;
    setDescrip(new_descr);
  };

  // Styles for the table cells
  const headerCellStyle = {
    fontFamily: "'SF Pro Display', sans-serif",
    fontSize: "1rem",
    fontWeight: "bold",
    backgroundColor: "#F8FAFC",
    color: "#1E293B",
    borderBottom: "2px solid rgba(0, 0, 0, 0.08)",
    position: "sticky",
    left: 0,
    zIndex: 2,
    minWidth: "150px",
    boxShadow: "4px 0 8px -4px rgba(0, 0, 0, 0.05)",
  };

  const dataCellStyle = {
    fontFamily: "Open Sans",
    fontSize: "1rem",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  };

  // Custom scrollbar styles
  const scrollbarStyles = {
    // For webkit browsers (Chrome, Safari, newer versions of Edge)
    "&::-webkit-scrollbar": {
      width: "8px",
      height: "8px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(37, 99, 235, 0.5)",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "rgba(37, 99, 235, 0.7)",
      },
    },
    // For Firefox
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(37, 99, 235, 0.5) rgba(0, 0, 0, 0.05)",
  };

  return (
    <CustomTooltip
      open={(tooltipId === 17 || tooltipId === 18) ? true : false}
      onOpen={handleOpen}
      onClose={handleClose}
      title={
        tooltipId === 17 ? (
          <Box padding="10px" display="flex" flexDirection="column" gap="10px">
            <Typography>Columns are also known as features or variables in ML
              prediction.</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(16)}>PREVIOUS</Button>
              <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(18)}>NEXT</Button>
            </Box>
          </Box>
        ) : (
          <Box padding="10px" display="flex" flexDirection="column" gap="10px">
            <Typography>{"Review the percentage empty per column, >50% empty makes the column/feature less reliable for prediction."}</Typography>
            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" startIcon={<ArrowBackIos />} onClick={() => setTooltipId(17)}>PREVIOUS</Button>
              <Button variant="contained" endIcon={<ArrowForwardIos />} onClick={() => setTooltipId(19)}>NEXT</Button>
            </Box>
          </Box>
        )
      }
      placement={tooltipId === 17 ? "bottom-start" : 'bottom-start'}
      arrow
    >
      <TableContainer 
        component={Paper} 
        sx={{ 
          backgroundColor: "#ffffff",
          maxWidth: "100%", 
          width: "100%",
          height: "360px", // Reduced from 400px by 10%
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          ...scrollbarStyles
        }}
      >
        <Box sx={{ 
          overflowX: "auto", 
          overflowY: "auto", 
          height: "360px", // Adjusted to fill the entire container
          ...scrollbarStyles
        }}>
          <Table sx={{ tableLayout: "auto" }}>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{
                    ...headerCellStyle,
                    width: "180px",
                    backgroundColor: "#F1F5F9",
                    position: "relative",
                    zIndex: 1
                  }}
                >
                  Feature
                </TableCell>
                {response && ["Empty (%)", "Fit For Use", "Data Type"].map((header, index) => (
                  <TableCell
                    key={index}
                    sx={{
                      fontFamily: "'SF Pro Display', sans-serif",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      backgroundColor: "#F8FAFC",
                      color: "#1E293B",
                      borderBottom: "2px solid rgba(0, 0, 0, 0.08)",
                      textAlign: "left",
                      minWidth: "120px",
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      "&::after": index < 2 ? {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: "25%",
                        height: "50%",
                        width: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.08)"
                      } : {}
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {response && response.result.map((row, rowIndex) => (
                <TableRow 
                  key={row.name}
                  sx={{
                    backgroundColor: rowIndex % 2 === 0 ? "rgba(0, 0, 0, 0.01)" : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(37, 99, 235, 0.04)",
                    },
                    transition: "background-color 0.2s ease",
                  }}
                >
                  <TableCell 
                    sx={{
                      ...headerCellStyle,
                      backgroundColor: rowIndex % 2 === 0 ? "rgba(241, 245, 249, 0.8)" : "rgba(241, 245, 249, 0.5)",
                    }}
                  >
                    {row.name}
                  </TableCell>
                  <TableCell 
                    sx={{
                      ...dataCellStyle,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: "25%",
                        height: "50%",
                        width: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                      }
                    }}
                  >
                    {row.empty}%
                  </TableCell>
                  <TableCell 
                    sx={{
                      ...dataCellStyle,
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        right: 0,
                        top: "25%",
                        height: "50%",
                        width: "1px",
                        backgroundColor: "rgba(0, 0, 0, 0.04)"
                      }
                    }}
                  >
                    {row.fit_for_use ? "Yes" : "No"}
                  </TableCell>
                  <TableCell sx={dataCellStyle}>
                    {row.type === "int64" || row.type === "float64" ? "numeric" : "text"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </TableContainer>
    </CustomTooltip>
  );
};

export default TableComponent;
