import { AddCircleRounded as AddCircleIcon } from "@mui/icons-material"
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  CssBaseline,
  Grid,
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
import { ChangeEvent, useEffect, useState } from "react"
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

  const addTeam = (newTeam: Team) =>
    setTeams((prevState: Team[]) => [...prevState, newTeam])

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
  }

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
            sx={{ mb: "1rem" }}
          />
          <Grid
            container
            justifyContent="space-evenly"
            sx={{ backgroundColor: "transparent" }}
          >
            {teams.length >= 1 &&
              teams.map((team) => (
                <Grid item xs={4} key={team.id}>
                  <TextField
                    id={team.id}
                    label={`Team ${team.id.split("-")[0]}`}
                    variant="outlined"
                    onChange={handleTeamChange}
                    value={team.name}
                    fullWidth
                    sx={{ mb: "1rem" }}
                  />
                </Grid>
              ))}
            {teams.length >= 1 && teams.length % 2 !== 0 && (
              <Box
                key="null"
                component="div"
                sx={{ p: 2, border: "1px dashed grey" }}
              >
                <Typography>A team rests every game day</Typography>
              </Box>
            )}
          </Grid>
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
