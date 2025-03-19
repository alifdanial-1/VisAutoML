import { Box } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import BackDialog from "../components/dataset/BackDialog";
import Body from "../components/dataset/Body";
import LearningPopup from "../components/common/LearningPopup";
import "../App.css";
// import ReactDOM from "react-dom";


const Dataset = () => {
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

export default Dataset;
