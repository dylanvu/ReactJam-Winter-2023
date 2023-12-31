import React, { useEffect, useState } from 'react'
import { GameState } from '../../logic_v2/types'
import { CakeLayerType, isPlacableIngredient } from '../../logic_v2/cakeTypes';
import { PlayerIndexToCharacterIcon } from '../../logic_v2/assetMap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons';

export function generateFinalContainerStyle(img: string) {
  return {
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    // borderRadius: '22px',
    overflow: 'hide',
    padding: '0',
  }
}

function RecipeItem({ img, ingredient, game, clientPlayerId }: { img: string, ingredient: CakeLayerType, game: GameState, clientPlayerId: string }) {
  // loop through the inventory to find out who owns what
  let owner: number | null = null;
  let ownerIsClient = false;
  let index = 0;
  for (const player of Object.values(game.players)) {
    const inventory = player.inventory;
    if (isPlacableIngredient(ingredient) && inventory.includes(ingredient)) {
      owner = player.number;
      // check if the client owns this
      if (clientPlayerId === player.id) {
        ownerIsClient = true;
      }
      break;
    }
    index++;
  }

  const [isPlaced, setIsPlaced] = useState(false)

  useEffect(() => {
    // check if this item is already placed down whenever the newLayer changes
    setIsPlaced(game.newLayer.includes(ingredient))
  }, [game.newLayer])
  return (
    <>
      <div className={`recipe-step-contain ${!isPlaced && !ownerIsClient ? "disabled-recipe-item" : null} `} >
        <div style={generateFinalContainerStyle(img)} className={`recipe-item ${ownerIsClient ? "current-player-recipe-hint" : null}`}>
          <div>
            {
              isPlaced ?
                <div className={`check-contain ${ownerIsClient ? "current-player-checkmark" : null}`}>
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                : null
            }

          </div>
        </div>
        <div className={` ${!isPlaced && !ownerIsClient ? "owner-icon-contain" : null} `}>
          {owner !== null ? <img src={ownerIsClient ? PlayerIndexToCharacterIcon[owner].highlightGameIcon : PlayerIndexToCharacterIcon[owner].gameIcon} /> : null}
        </div>

      </div>
      {/* figure out who owns this item, if anyone */}
      {/* rn this is in the success state */}


    </>
  )
}

export default RecipeItem
