import { Box } from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reset } from "../actions/modelAction";
import Navbar from "../components/common/Navbar";
import BackDialog from "../components/explain/BackDialog";
import Body from "../components/explain/Body";
import "../App.css";

const Model = () => {
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

export default Model;