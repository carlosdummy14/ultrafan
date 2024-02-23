import { Team } from "./types"

const mixTeams = (teams: Team[]): Team[] => {
  return teams
    .map((team) => {
      return {
        ...team,
        random: Math.random(),
      }
    })
    .sort((a, b) => a.random - b.random)
}

export const generateLeague = (leagueName: string, teams: Team[]) => {
  let teamsForLeague = structuredClone(teams)

  const isTeamsEven = teamsForLeague.length % 2 === 0
  if (!isTeamsEven) {
    teamsForLeague = [
      ...teamsForLeague,
      {
        id: crypto.randomUUID(),
        name: "NO PLAY",
        random: 0,
      },
    ]
  }

  let mixedTeams: Team[] = mixTeams(teamsForLeague)

  const schedule = []
  const totalTeams = mixedTeams.length
  const middleTeams = totalTeams / 2

  for (let i = 0; i < totalTeams - 1; i++) {
    const matches = []

    for (let j = 0; j < middleTeams; j++) {
      const home = mixedTeams[j]
      const guest = mixedTeams[totalTeams - 1 - j]
      // console.log(home.name, " vs ", guest.name)

      if (Math.random() > 0.5) {
        matches.push({ home, guest })
        // matches.push({home,guest}`${home.name} vs ${guest.name}`)
      } else {
        matches.push({ guest, home })
        // matches.push(`${guest.name} vs ${home.name}`)
      }
    }

    schedule.push({ round: i + 1, matches })

    let lastTeam = mixedTeams.pop() as Team
    mixedTeams.splice(1, 0, lastTeam)
  }

  return { league: leagueName, schedule }
}
