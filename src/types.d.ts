import { Dispatch, SetStateAction } from "react"

export type TeamId = `${string}-${string}-${string}-${string}-${string}`

export type Team = {
  id: TeamId
  name: string
  random: number
}

export type TeamState = [
  teams: Team[],
  setTeams: Dispatch<SetStateAction<Team[]>>
]

export type LeagueState = [
  leagueName: string,
  setLeagueName: Dispatch<SetStateAction<string>>
]

export type Match = {
  home: Team
  guest: Team
}

export type Matches = {
  round: number
  matches: Match[]
}

export type League = {
  league: string
  schedule: Matches[]
}
