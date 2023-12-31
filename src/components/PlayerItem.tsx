import React from 'react'
import { PlayerIndexToCharacterIcon, playerAssets } from '../logic_v2/assetMap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';
function PlayerItem({ profile, username, playerIndex, isReady, isClient }: { profile: string, username: string, playerIndex?: number, isReady: boolean, isClient: boolean }) {
  let playerIndexAssets: playerAssets | undefined;
  let playerLobbyIcon: string | undefined;
  let playerCharacterName: string | undefined;
  if (playerIndex !== undefined) {
    // see if we can find the assets to this character index
    playerIndexAssets = PlayerIndexToCharacterIcon.at(playerIndex);
    if (playerIndexAssets) {
      playerLobbyIcon = playerIndexAssets.lobbyIcon;
      playerCharacterName = playerIndexAssets.charName.toLowerCase();
    }
  }
  return (
    <div className={`player-item ${!isClient ? 'new-player' : null}`}>
      <img src={profile} alt="Player Profile Picture" />
      <div className="right-contain">
        <h2>{username}</h2>
        {
          playerLobbyIcon ?
            <div className='user-type-contain'>
              <img src={playerLobbyIcon} />
              <p>{playerCharacterName}</p>
            </div>
            : null
        }
      </div>
      <div>
        {isReady ?
          <div className={`checkmark`}>
            <FontAwesomeIcon icon={faCheck} />
          </div>
          : null
        }
      </div>

    </div>
  )
}

// const playerInfo = [
//     {userType: 'cow', userTypeIcon: {cowIcon}},
//     {userType: 'chicken', userTypeIcon: {chickenIcon}},
// ]


export default PlayerItem
