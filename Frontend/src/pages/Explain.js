import { Box } from "@mui/material";
import { useState } from "react";
import Navbar from "../components/common/Navbar";
import BackDialog from "../components/explain/BackDialog";
import Body from "../components/explain/Body";

const Explain = () => {
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

export default Explain;
