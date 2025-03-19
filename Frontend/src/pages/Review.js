import { Box } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import BackDialog from "../components/review/BackDialog";
import Body from "../components/review/Body";
import "../App.css";

const Review = () => {
  const [backDialogOpen, setBackDialogOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box className="main">
        <Body
          backDialogOpen={backDialogOpen}
          setBackDialogOpen={setBackDialogOpen}
        />
      </Box>  
      <BackDialog open={backDialogOpen} setOpen={setBackDialogOpen} />
    </Box>
  );
};

export default Review;
