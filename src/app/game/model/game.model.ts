export interface Game {
    playerAId: number,
    playerBId: number,
    senderId: number,
    currentTurn: number,
    playerBAmount: number,
    playerAAmount: number,
    playerASeeds: number[],
    playerBSeeds: number[],
    opponentRepeatTurn: boolean,
    capturedSeeds: boolean,
    winner: string

}