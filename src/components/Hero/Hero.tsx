import { Box, Button, Container, TextField, Typography } from "@mui/material"
import stadiumImage from "../../assets/alexander-awerin-yXs8_r7VL4I-unsplash.jpg"
import "./styles.css"
import { Link } from "wouter"

function Hero() {
  return (
    <div
      style={{
        backgroundImage: `url("${stadiumImage}")`,
      }}
      className="hero"
    >
      <Container maxWidth="sm" sx={{ zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            color: "#ffffff",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            className="title"
            sx={{ marginBottom: 2, fontWeight: "bold" }}
          >
            Dive into the universe of tournaments!
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{ marginBottom: 2, textAlign: "left", fontWeight: "regular" }}
          >
            Design custom championships, schedule matches, manage teams , and
            follow each game closely. Turn your sports dreams into reality and
            create unforgettable memories. Join our community today. The next
            great competition awaits you!
            <br />
            <strong>See you soon!!</strong>
          </Typography>
          <TextField
            disabled
            variant="outlined"
            placeholder="Enter your email to stay updated on the project"
            sx={{
              marginBottom: 2,
              backgroundColor: "#219993",
              borderRadius: 1,
            }}
            fullWidth
          />
          <Box
            sx={{
              textAlign: "center",
              color: "#ffffff",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <Button
              disabled
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 1,
                padding: "1rem 2rem",
                textTransform: "uppercase",
              }}
            >
              Goool !!!
            </Button>
            <Link to="/newleague">
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  borderRadius: 1,
                  padding: "1rem 2rem",
                  textTransform: "uppercase",
                }}
              >
                Try a kick
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </div>
  )
}
export default Hero
