import {
  AddCircleRounded as AddCircleIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { League, LeagueState, Team, TeamId, TeamState } from "./types"
import { generateLeague } from "./utils"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})
const widthTabCell = 150

function App() {
  const [teams, setTeams]: TeamState = useState([] as Team[])
  const [leagueName, setLeagueName]: LeagueState = useState("")
  const [error, setError] = useState("")
  const [league, setLeague] = useState({} as League)
  const teamsContainer = useRef(null)

  const addTeam = (newTeam: Team) =>
    setTeams((prevState: Team[]) => [...prevState, newTeam])

  const removeTeam = (teamId: TeamId) =>
    setTeams((prevState: Team[]) =>
      prevState.filter((team) => team.id !== teamId)
    )

  const changeTeamName = (teamId: TeamId, newName: string) => {
    setTeams((prevState: Team[]) => {
      return prevState.map((team) => {
        if (team.id === teamId) team.name = newName.toUpperCase()
        return team
      })
    })
  }

  const handleAddTeam = () => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name: "",
      random: 0,
    }
    addTeam(newTeam)
    const lastTeam = teamsContainer?.current?.lastElementChild
    lastTeam?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  const handleRemoveTeam = (teamId: TeamId) => removeTeam(teamId)

  const handleTeamChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { value: teamName, id: teamId } = ev.target
    changeTeamName(teamId as TeamId, teamName)
  }

  const handleLeagueChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setLeagueName(ev.target.value.toUpperCase())

  const handleGenerateLeague = () => {
    const cleanError = () => setTimeout(() => setError(""), 2000)

    const haveNoNameLeague = leagueName === ""
    const haveNoNameTeams = teams.filter((team) => team.name === "").length > 0

    if (haveNoNameLeague) {
      setError("League name missed ...")
      cleanError()
    } else if (haveNoNameTeams) {
      setError("Team not valid...")
      cleanError()
    } else {
      const response = generateLeague(leagueName, teams)
      setLeague(response)
    }
  }

  useEffect(() => {
    const dummy = [
      "América",
      "Atlas",
      "Atlético San Luis",
      "Club Tijuana",
      "Cruz Azul",
      "FC Juárez",
      "Guadalajara",
      "León",
      "Mazatlán FC",
      "Monterrey",
      "Necaxa",
      "Pachuca",
      "Puebla",
      "Pumas UNAM",
      "Querétaro",
      "Santos Laguna",
      "Tigres",
      "Toluca",
    ]
    dummy.forEach((team) => {
      addTeam({
        id: crypto.randomUUID(),
        name: team.toUpperCase(),
        random: 0,
      })
    })
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container
        maxWidth="sm"
        disableGutters={true}
        style={{ marginTop: "10px" }}
      >
        <Typography variant="h1" fontSize={40} align="center" mb={3}>
          Create your League
        </Typography>
        <Stack spacing={1}>
          <TextField
            label="League Name"
            variant="outlined"
            onChange={handleLeagueChange}
            value={leagueName}
            sx={{ mb: "0.5rem" }}
          />
          <Grid
            container
            justifyContent="space-evenly"
            sx={{
              backgroundColor: "transparent",
              height: "60vh",
            }}
            overflow="auto"
            ref={teamsContainer}
          >
            {teams.length >= 1 &&
              teams.map((team) => (
                <Grid
                  item
                  xs={5.5}
                  md={5.5}
                  key={team.id}
                  sx={{
                    backgroundColor: "#1E429F",
                    borderRadius: "10px",
                    mb: "0.5rem",
                    maxHeight: "75px",
                  }}
                >
                  <Stack direction="row" alignItems="center" sx={{ p: 1 }}>
                    <TextField
                      id={team.id}
                      label={`Team ${team.id.split("-")[0]}`}
                      variant="outlined"
                      onChange={handleTeamChange}
                      value={team.name}
                    />
                    <IconButton
                      aria-label="remove"
                      onClick={() => handleRemoveTeam(team.id)}
                      sx={{
                        color: "tomato",
                        ml: 1,
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              ))}
          </Grid>
          <Box
            key="null"
            component="div"
            sx={{ p: 1, border: "1px dashed grey" }}
          >
            {(teams.length >= 1 && teams.length % 2 !== 0 && (
              <Typography>A team will rest every game day</Typography>
            )) || <Typography>All teams can play </Typography>}
          </Box>
          <Button
            variant="contained"
            color="success"
            startIcon={<AddCircleIcon />}
            onClick={handleAddTeam}
          >
            Add team
          </Button>
          <Button
            variant="contained"
            disabled={teams.length < 2}
            onClick={handleGenerateLeague}
          >
            Generate
          </Button>
          {error !== "" && (
            <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}
        </Stack>
      </Container>
      <Container>
        {league.league && (
          <Stack spacing={1}>
            <Typography variant="h3" align="center">
              {league.league}
            </Typography>
            <Grid
              container
              spacing={1}
              justifyContent="center"
              alignItems="flex-start"
            >
              {league.schedule.map((item) => (
                <Grid item key={item.round}>
                  <Card variant="outlined" sx={{ p: 0.5, bgcolor: "tomato" }}>
                    <Stack>
                      <Stack bgcolor={"rebeccapurple"}>
                        <Typography align="center" variant="h5">
                          Round
                        </Typography>
                        <Typography align="center" variant="h5">
                          {item.round}
                        </Typography>
                      </Stack>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ bgcolor: "rebeccapurple" }}>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "large",
                                }}
                              >
                                HOME
                              </TableCell>
                              <TableCell></TableCell>
                              <TableCell
                                align="center"
                                sx={{
                                  fontWeight: "bold",
                                  fontSize: "large",
                                }}
                              >
                                GUEST
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.matches.map((match, index) => (
                              <TableRow key={index}>
                                {match.home.name === "NO PLAY" ||
                                match.guest.name === "NO PLAY" ? (
                                  <TableCell
                                    align="center"
                                    colSpan={3}
                                    sx={{ bgcolor: "grey" }}
                                  >
                                    {match.home.name === "NO PLAY"
                                      ? match.guest.name
                                      : match.home.name}
                                  </TableCell>
                                ) : (
                                  <>
                                    <TableCell
                                      align="center"
                                      width={widthTabCell}
                                    >
                                      {match.home.name}
                                    </TableCell>
                                    <TableCell>Vs.</TableCell>
                                    <TableCell
                                      align="center"
                                      width={widthTabCell}
                                    >
                                      {match.guest.name}
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}
      </Container>
      {/* {JSON.stringify(league)} */}
    </ThemeProvider>
  )
}

export default App
