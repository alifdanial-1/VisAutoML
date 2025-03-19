import { Box } from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { reset } from "../actions/modelAction";
import Navbar from "../components/common/Navbar";
import Body from "../components/home/Body";
import "../App.css";

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />
      <Box 
        className="main"
        sx={{
          overflowY: 'auto',
          '@media (max-width: 990px)': {
            width: '990px',
            maxWidth: '990px',
            margin: '0 auto',
            overflowX: 'auto'
          }
        }}
      >
        <Body />
      </Box>
    </Box>
  );
};

export default Home;
