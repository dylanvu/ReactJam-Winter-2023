// the game world, including the cake, syrup, players, and items
/// <reference types="vite-plugin-svgr/client" />
import Platform from "./objects/platform";
import { useState, Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GameState } from "../logic_v2/types";
import { PlacableIngredient } from '../logic_v2/cakeTypes';
import Cake from './objects/cake';
import { Physics, RigidBody } from "@react-three/rapier";
import { Vector3 } from "three";
import PlayingUI from "../components/staticUI/states/playing";
import TutorialUI from "../components/staticUI/states/tutorial";
import Camera, { calculateCurrentCameraY, cakeOffset } from "./objects/camera";
import Lobby from "./staticUI/states/lobby";
// fix the typing error: https://github.com/joshwcomeau/use-sound/issues/135#issuecomment-1723305858
import useSound from 'use-sound';
import cafeSound from '../assets/sweet cafe.mp3'
import { Player, Players } from "rune-games-sdk";
import Syrup from "./objects/syrup";
import Loss from "./staticUI/states/loss";
import StopUI from "./staticUI/states/stop";

export default function Game({ game, player, players }: { game: GameState, player: Player, players: Players }) {

    // handle the music
    const [isPlaying, setPlaying] = useState(false);

    // this is the play function called when the button is clicked
    const [play] = useSound(cafeSound, { volume: 0.5, loop: true });

    // the cake objects
    const [cakes, setCakes] = useState<any[]>([]);

    // the topmost layer
    const [newLayer, setNewLayer] = useState<JSX.Element[]>([]);

    // a block is falling
    const [blockInMotion, setBlockInMotion] = useState(false);

    // selected ingredient
    const [selectedIngredient, setSelectedIngredient] = useState<PlacableIngredient[]>([]);

    const [cakeYPositions, setCakeYPositions] = useState<number[]>([]);

    const handleDrop = (ingredient?: PlacableIngredient) => {
        if (ingredient === undefined && selectedIngredient.length === 0) {
            // nothing is selected
            return;
        } else {
            // wait until any blocks falling have stopped
            if (!blockInMotion) {
                const toDrop = ingredient ?? selectedIngredient[0];
                // push the action to rune
                Rune.actions.placeIngredient({ ingredient: toDrop });
                // console.log(cakes)
                // const cakeCount = cakes.length
                // setCakes([...cakes, <Cake position={new Vector3(0, 1 + cakes.length * 0.5, 0)} texture={"eggs"} key={cakeCount} />]);
            }
        }
    }

    useEffect(() => {
        // if (!blockInMotion) {
        rerenderNewLayer();
        // }
    }, [game.newLayer]);

    useEffect(() => {
        // handle putting new things into the cake
        // console.log(`game.cakes changed for ${player.playerId}`, game.cake)
        rerenderCake();
    }, [game.cake]);

    useEffect(() => {
        if (!blockInMotion && newLayer.length === 0) {
            rerenderCake();
        }
    }, [blockInMotion])

    function rerenderCake() {
        // handle the new layer
        // whenever the new layer changes, update the rendered cakes
        const gameStateCakeLength = game.cake.length;
        const currentCakeLength = cakes.length;
        // has something new been added?
        if (gameStateCakeLength > currentCakeLength) {
            // something new has been added
            // create more blocks in the new layer
            const additionalBlocks: JSX.Element[] = [];
            let latestCake;
            // TODO: instead, can we iterate through each and only spawn in new blocks?
            for (let i = currentCakeLength; i < gameStateCakeLength; i++) {
                // create more blocks
                const blockType = game.cake[i];
                const spawnY = cakes.length === 0 || cakeYPositions.length === 0 ? 1 : cakeYPositions.at(-1)! + cakeOffset + i * 1.5;
                console.log(`Spawning at: ${spawnY}`)
                // old calculation: 1 + ((cakes.length + currentCakeLength) * 0.5)
                latestCake = <Cake position={new Vector3(0, spawnY, 0)} index={i} texture={blockType} key={"cake-" + blockType + "-" + i} setBlockInMotion={setBlockInMotion} setCakeYPosition={setCakeYPositions} cakeYPos={cakeYPositions} />
                additionalBlocks.push(latestCake);
            }

            // now add it into the state
            setCakes([...cakes, ...additionalBlocks]);

        } else {
            if (gameStateCakeLength === 0) {
                // wipe
                setCakes([]);
            }
            // console.log(`${player.playerId} sees ${currentCakeLength} vs game state ${gameStateCakeLength}`)
        }
    }


    function rerenderNewLayer() {
        // handle the new layer
        // whenever the new layer changes, update the rendered cakes
        const gameStateLayerLength = game.newLayer.length;
        const currentLayerLength = newLayer.length;
        // has something new been added?
        if (gameStateLayerLength > currentLayerLength) {
            // something new has been added
            // create more blocks in the new layer
            const additionalBlocks: JSX.Element[] = [];
            // TODO: instead, can we iterate through each and only spawn in new blocks?
            for (let i = currentLayerLength; i < gameStateLayerLength; i++) {
                // create more blocks
                const blockType = game.newLayer[i];
                const spawnY = cakes.length === 0 || cakeYPositions.length === 0 ? 1 : cakeYPositions.at(-1)! + cakeOffset + i * 1.5;
                additionalBlocks.push(
                    <Cake position={new Vector3(0, spawnY, 0)} texture={blockType} key={"new-layer-" + blockType + "-" + i} setBlockInMotion={setBlockInMotion} />
                )
            }
            // now add it into the state
            // TODO: will this create some sort of collision type of race condition?
            setNewLayer([...newLayer, ...additionalBlocks])
        } else if (gameStateLayerLength < currentLayerLength) {
            // I'm gonna assume that only top layers are removed
            if (gameStateLayerLength === 0) {
                // wipe it
                setNewLayer([]);
            } else {
                // rebuild the whole thing :sob:
                const additionalBlocks: JSX.Element[] = [];
                for (let i = 0; i < gameStateLayerLength; i++) {
                    const blockType = game.newLayer[i];
                    const spawnY = cakes.length === 0 || cakeYPositions.length === 0 ? 1 : cakeYPositions.at(-1)! + cakeOffset + i + currentLayerLength;
                    additionalBlocks.push(
                        <Cake position={new Vector3(0, spawnY, 0)} texture={blockType} key={"new-layer-" + blockType + "-" + i} setBlockInMotion={setBlockInMotion} />
                    )
                }
                setNewLayer(additionalBlocks);
                // slice it
                // setNewLayer(newLayer.slice(0, gameStateLayerLength));
            }
        } else {
            // should be the same thing
        }
    }

    // add or remove the timer depending on the game state
    let gameTimerHTML;

    switch (game.phase) {
        case "lobby":
            gameTimerHTML = <Lobby game={game} isPlaying={isPlaying} play={play} setPlaying={setPlaying} players={players} playerId={player.playerId} />;
            break;
        case "tutorial":
            gameTimerHTML = <TutorialUI />;
            break;
        case "playing":
            gameTimerHTML = <PlayingUI game={game} selectedIngredient={selectedIngredient} setSelectedIngredient={setSelectedIngredient} player={player} dropIngredient={handleDrop} />
            break;
        case "loss":
            gameTimerHTML = <Loss game={game} />
            break;
        case "stop":
            gameTimerHTML = <StopUI />
            break;
    }

    return (
        <>
            {gameTimerHTML}
            <Canvas
            // camera={{ position: [1, 0, 1] }}
            // onClick={handleDrop}
            >
                <Camera yPos={cakeYPositions.at(-1)} />
                <Suspense>
                    <Physics gravity={[0, -15, 0]}
                        // colliders="hull"
                        colliders={false}
                    >
                        {...cakes}
                        {...newLayer}
                        <Platform />
                        {/* illuminates everything uniformily */}
                        {/* 0 x color */}
                        <ambientLight args={[0xF8F8F8]} intensity={.5} />
                        <directionalLight color={0xF8F8F8} position={[10, 10, 10]} intensity={1.5} />
                        {/* <Syrup yPos={cakeYPositions.at(-1)} /> */}
                    </Physics>
                </Suspense>
            </Canvas>
        </>
    )
}