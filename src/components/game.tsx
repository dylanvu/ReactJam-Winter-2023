// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import { Canvas } from "@react-three/fiber";
import Player from "./objects/player";
import Camera from "./objects/camera";
import { GameState } from "../logic_v2/types";
import Platform from "./objects/platform";
import React, { useState, KeyboardEvent, useRef, Suspense } from "react";
import { PlacableIngredient } from "../logic_v2/cakeTypes";
import InventorySlot from "./staticUI/InventorySlot";
import InventoryData from "./staticUI/data/InventoryData";
import NextUp from "./staticUI/NextUp";
import Cake from "../assets/regularCake.svg";
import Recipe from "./staticUI/Recipe";

export default function Game({ game }: { game: GameState}) {
  // selected element
  const [selectedIngredient, setSelectedIngredient] = useState<string[]>([]);

  const handleInventoryClick = (ingredient: PlacableIngredient) => {
    // if the list of ingredients includes the index
    const newSelectedIngredient = selectedIngredient.includes(ingredient)
      ? // then only include elements not equal to the ingredient
        selectedIngredient.filter((i) => i !== ingredient)
      : // else assign the selectedIngredient array to the new index clicked
        [ingredient];
    setSelectedIngredient(newSelectedIngredient);

    placeIngredient(ingredient);
    console.log(
      `Ingredient ${ingredient} is selected: ${newSelectedIngredient.includes(
        ingredient,
      )}`,
    );
  };
//   math stuff
// turn ms into sec
// since you're using using an if then operator in game: gamestate, you must also use the same operator check in the const
const totalSeconds = game ? Math.floor(game.timeLeft / 1000): 0;
const minutes = game ? Math.floor(totalSeconds / 60): 0;
// align seconds relative to minutes. calculates the remainder which is the seconds left (ignoring minutes)
const seconds = game ? totalSeconds % 60: 0;
// $ allows you to embed operators in a string
// minutes:if seconds under 10, add 0 seconds
const formattedTimer = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`


  const camera_pos = Camera();

  if (!game) {
    return <div>Loading...</div>;
  }

  // add or remove the timer depending on the game state
  let gameTimerHTML;

  // for now, just show the layers as a bunch of text. This will be fixed later, when we are able to map cake layer types to actual three.js blocks
  let layers = "";
  for (const layer of game.cake) {
    layers += layer + ", ";
  }
  // now add in the new layer that is not finalized
  let newLayers = "";
  if (game.newLayer.length !== 0) {
    newLayers += "[";
    for (const layer of game.newLayer) {
      newLayers += layer + ", ";
    }
    newLayers += "]";
  }
  layers += newLayers;
  if (layers.length === 0) {
    layers = "empty cake!";
  }

  switch (game.phase) {
    case "tutorial":
      gameTimerHTML = <div className="time-left">Tutorial</div>;
      break;
    case "playing":
      gameTimerHTML = (
        <div className="static-ui-contain">
          <div className="top-section">
            <div className="state-contain">
            
            {/* <div>{layers}</div> */}

            <div className="score-contain">
              <img src={Cake} alt="" />
              <h2>{game.score}</h2>
            </div>
            <div className="timer-contain">
                <h1>{formattedTimer}</h1>
            </div>
            
            <NextUp layerName={game.goals.current} />
            {/* show all the cake layers */}
          </div>
          <div className="recipe-section">
            <Recipe 
          imgPlayer1=""
          imgPlayer2=""
          imgFinal=""
          />
          </div>
          </div>
          
          
          {/* <div>

            {JSON.stringify(game.hint.recipe)}
            {game.hint.name} 
          </div> */}
          <div className="inventory-contain">
            {/* maps each ingredient to an inventoryslot */}
            {InventoryData.slice(0, 3).map((ingredient, index) => (
              <InventorySlot
                key={index}
                icon={ingredient.icon}
                onClick={() => handleInventoryClick(ingredient)}
                className={
                  selectedIngredient.includes(ingredient) ? "selected" : ""
                }
              />
            ))}
          </div>
        </div>
      );

    //     break;
    // case "loss":
    //     gameTimerHTML =
    //         <div className="time-left">
    //             Game Over
    //         </div>
    //     break;
  }

  return (
    <>
      {gameTimerHTML}
      <Canvas
        camera={{ position: [camera_pos[0], camera_pos[1], camera_pos[2]] }}
      >
        {/*<Player controllable={true} /> */}
        <Platform />
        {/* render all other players */}
        <ambientLight args={[0x000000]} />
        <directionalLight position={[10, 10, 10]} />
      </Canvas>
    </>
  );
}

// call this function when you want to place an ingredient
function placeIngredient(ingredient: PlacableIngredient) {
  Rune.actions.placeIngredient({ ingredient: ingredient });
}
