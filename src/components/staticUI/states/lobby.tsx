import React, { useState } from 'react'
import PlayerItem from '../../PlayerItem'
import Logo from '../../../assets/sweetStackLogo.svg'
import Music from '../../Music'
import { GameState } from '../../../logic_v2/types'
import Background from '../../../assets/lobbyBackground.svg'
import Profile from '../../../assets/profilePlaceholder.png'
// import into a different doc
import cowIcon from '../../../assets/characters/cowLobby.svg'
import chickenIcon from '../../../assets/characters/chickenLobby.svg'
import PlayerItemEmpty from '../../PlayerItemEmpty'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import useSound from "use-sound";
import clickSound from '../../../assets/clickSound.wav'
import TutorialIUI from './tutorial'
import { PlayerId, Players } from 'rune-games-sdk'
const Lobby = ({ game, isPlaying, setPlaying, play, players, playerId }: { game: GameState, isPlaying: boolean, setPlaying: React.Dispatch<React.SetStateAction<boolean>>, play: Function, players: Players, playerId: PlayerId }) => {

  const [ready, setReady] = useState<boolean>(game.ready);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  //   when tutorial is clicked
  const [playClickSound] = useSound(clickSound, { volume: 0.5 })
  const handleTutorialClick = () => {
    playClickSound();
    setShowTutorial(true);
    RemoveTutorialClass();
  };

  const handleTutorialHover = () => {
    playClickSound();
  }
//   removes the visibility class inside of tutorial component
const RemoveTutorialClass = () => {
    const tutorialUIElements = document.querySelectorAll('.tutorial-contain')
    tutorialUIElements.forEach((element) => {
        element.classList.remove('close-tutorial');
      });
}

  // figure out how many players are missing
  const missingNumPlayers = 2 - Object.keys(players).length;
//TODO: Trigger "waiting for player" in h2 tag, otherwise display none
  return (
    <div className='lobby-contain'>
      <div className="lobby-content">
        <img src={Logo} />
        {/* contain waiting for players */}
        <div style={{alignContent:'center', display: 'flex', gap: '12px', flexDirection: 'column'}}>
        <div className='waiting-text-contain'>
<h2>waiting for the other player...</h2>
        </div>
        
        {/* players ready up */}
        <div className="players-contain">
            
          {Object.entries(players).map(([playerId, player]) => {
            // grab their profile information
            const profileUrl = player.avatarUrl;
            const name = player.displayName
            // check if they have a number index in the game state
            let playerIndex: number | undefined;
            if (game.players[playerId]) {
              playerIndex = game.players[playerId].number;
            }
            return (
              <PlayerItem
                profile={profileUrl}
                username={name}
                playerIndex={playerIndex}
                key={name}
              />
            )
          })}
          {/* show empty player items if there aren't enough players */}
          {
            Array.from(Array(missingNumPlayers).keys()).map((_, index) =>
              <PlayerItemEmpty key={`empty-player-slot-${index}`} />
            )
          }
        </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>


          <Music isPlaying={isPlaying} setPlaying={setPlaying} play={play} enableReady={ready} playerIsReady={game.players[playerId].ready}
          />
          {/* how to play tutorial */}
          <button className='tutorial-button' onClick={handleTutorialClick} onMouseEnter={handleTutorialHover}>
            <div className="icon-contain">
              <FontAwesomeIcon icon={faQuestion} />
            </div>
            How to play
          </button>
          {showTutorial && <TutorialIUI RemoveTutorialClass = {RemoveTutorialClass}/>}
        </div>
      </div>
    </div>
  )
}

export default Lobby
