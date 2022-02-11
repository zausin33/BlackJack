/**
 * The round status describes the current state of the game.
 *
 *                                  STARTING<------------------------------------------------------------
 *                                  |    |                                       |                      |
 *                      SHUFFLE-----    |                                        |                      |
 *                        |            |                                         |                      |
 *                        --------->RUNNING-------------------------------->LOST_SPLIT_HAND             |
 *                                    |                                                                 | New Round
 *            ------------------------------------------------------------------------                  |
 *           |                  |       |     |       |               |              |                  |
 *   PLAYER_TO_MUCH_POINTS     WON    LOST   TIE   BLACKJACK   BLACKJACK_TIE   END_SPLIT_ROUND          |
 *          |                  |       |     |       |               |              |                   |
 *          ---------------------------------------------------------------------------------------------
 *
 */

enum RoundStatus {
    STARTING = "STARTING",
    SHUFFLE = "Shuffle",
    RUNNING = "RUNNING",
    PLAYER_TO_MUCH_POINTS = "PLAYER_TO_MUCH_POINTS",
    WON = "WON",
    LOST = "LOST",
    LOST_SPLIT_HAND = "LOST_SPLIT_HAND",
    TIE = "TIE",
    BLACKJACK = "BLACKJACK",
    BLACKJACK_TIE = "BLACKJACK_TIE",
    END_SPLIT_ROUND = "END_SPLIT_ROUND"
}

export default RoundStatus;
