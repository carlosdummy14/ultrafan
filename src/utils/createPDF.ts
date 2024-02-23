import { BLANK_PDF, Template, generate } from "@pdfme/generator"
import { League, Match } from "../types"

type RoundMatch = { roundmatch?: string }
type NewInput = { leagueName?: string; round?: string }[]

const createTemplate = (league: League) => {
  const roundWidth = 61
  const roundHeight = 7
  const initialPosX = 9
  const initialPosY = 22
  let lineToPrint = 0
  let columnToPrint = 0

  const generateMatches = (
    matches: Match[],
    round: number,
    posX: number,
    posY: number
  ) => {
    const matchPosY = posY - roundHeight
    let matchCounter = 1
    let newMatchesInput: RoundMatch = {}
    const newMatch = matches.reduce((acum: RoundMatch, match: Match) => {
      const noPlayTeam =
        (match.home.name === "NO PLAY" && match.guest.name) ||
        (match.guest.name === "NO PLAY" && match.home.name) ||
        ""
      newMatchesInput = {
        ...newMatchesInput,
        [`round${round}match${matchCounter}`]:
          noPlayTeam !== ""
            ? `${noPlayTeam}`
            : `${match.home.name} Vs. ${match.guest.name}`,
      }

      return {
        ...acum,
        [`round${round}match${matchCounter++}`]: {
          type: "text",
          position: { x: posX, y: matchPosY + roundHeight * matchCounter },
          width: roundWidth,
          height: roundHeight,
          backgroundColor: noPlayTeam === "" ? "#ff0" : "#999",
          fontSize: 10,
          alignment: "center",
        },
      }
    }, {})

    return [newMatch, newMatchesInput]
  }

  let newInput: NewInput = []
  let newPage = {}

  const roundsSchema = league.schedule.reduce((acum, round) => {
    const posX = initialPosX + (roundWidth + 2) * columnToPrint++
    const posY = initialPosY + (roundHeight * 11 + 8) * lineToPrint
    // const posY =
    //   initialPosY + (roundHeight * (round.matches.length + 1) + 2) * lineToPrint
    const [matches, matchesInput] = generateMatches(
      round.matches,
      round.round,
      posX,
      posY
    )
    const newRound = {
      [`round${round.round}`]: {
        type: "text",
        position: { x: posX, y: posY },
        width: roundWidth,
        height: roundHeight,
        backgroundColor: "#F98080",
        fontSize: 16,
        alignment: "center",
      },
      ...matches,
    }

    newPage = {
      ...newPage,
      [`round${round.round}`]: `Round ${round.round}`,
      ...matchesInput,
    }

    if (columnToPrint >= 3) {
      columnToPrint = 0
      lineToPrint++
    }
    if (lineToPrint >= 3) {
      lineToPrint = 0
      newInput = [
        ...newInput,
        {
          leagueName: `${league.league}`,
          ...newPage,
        },
      ]
      newPage = {}
    }

    return {
      ...acum,
      ...newRound,
    }
  }, {})

  newInput = [
    ...newInput,
    {
      leagueName: `${league.league}`,
      ...newPage,
    },
  ]

  const template: Template = {
    basePdf: BLANK_PDF,
    schemas: [
      {
        leagueName: {
          type: "text",
          position: {
            x: 10,
            y: 5,
          },
          width: 185,
          height: 16,
          fontSize: 36,
          fontColor: "#000",
          fontName: "Roboto",
          alignment: "center",
          dynamicFontSize: {
            min: 10,
            max: 36,
          },
          backgroundColor: "#fff",
        },
        ...roundsSchema,
      },
    ],
  }

  return { template, newInput }
}

export const createPDF = (league: League) => {
  const {
    template,
    newInput,
  }: {
    template: Template
    newInput: NewInput
  } = createTemplate(league)

  const inputs = [...newInput]

  generate({ template, inputs }).then((pdf: { buffer: BlobPart }) => {
    // Browser
    const blob = new Blob([pdf.buffer], { type: "application/pdf" })
    window.open(URL.createObjectURL(blob))
  })
}
