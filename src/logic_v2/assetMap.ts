// this is our CakeLayerType to asset bible

// import all the assets

// 2d icons
import Butter from "../assets/icons/butterIcon.svg";
import Egg from "../assets/icons/eggIcon.svg";
import Wheat from "../assets/icons/wheatIcon.svg";
import Chocolate from "../assets/icons/chocolateIcon.svg";
import Straw from "../assets/icons/strawberryIcon.svg";
import Carrot from "../assets/icons/carrotIcon.svg";
import Sugar from "../assets/icons/sugarIcon.svg";

import Chicken from "../assets/characters/chicken.svg";
import Cow from "../assets/characters/cow.svg";

import CowLobby from '../assets/characters/cowLobby.svg'
import ChickenLobby from '../assets/characters/chickenLobby.svg'

import CowHighlight from '../assets/characters/cowIconHighlight.svg'
import ChickenHighlight from '../assets/characters/chickIconHighlight.svg'

// these are icons for Next Up and recipe hints
import Cake from "../assets/icons/regularCake.svg";
import ChocolateCake from "../assets/icons/chocolateCake.svg";
import StrawberryCake from "../assets/icons/strawberryCake.svg";
import CarrotCake from "../assets/icons/carrotCake.svg";
import Base from "../assets/icons/baseIcon.svg";
import Frosting from "../assets/icons/frostingIcon.svg";

// textures
import BaseTexture from "../assets/textures/baseBlock.svg";
import ButterTexture from "../assets/textures/butterBlock.svg";
import SugarTexture from "../assets/textures/sugarBlock.svg";
import WheatTexture from "../assets/textures/wheatBlock.svg";
import FrostingTexture from "../assets/textures/frostingBlock.svg";
import EggTexture from "../assets/textures/eggBlock.svg";

// flavor textures
import StrawTexture from "../assets/textures/strawBlock.svg";
import ChocoTexture from "../assets/textures/chocoBlock.svg";
import CarrotTexture from "../assets/textures/carrotBlock.svg";


// import types and stuff
import { CakeLayerType } from "./cakeTypes";

interface assetInformation {
    /**
     * a flag stating whether this is representing in three as a blender object
     */
    isBlenderObj: boolean,
    /**
     * the texture or the blender block path
     */
    block: string,
    /**
     * path to the mtl file. Only used if this is a blender obj
     */
    mtl?: string,
    /**
     * a 2d representation of the object. It might be in the inventory slot, or part of the recipe hint
     */
    icon: string
}

// now we use a record to enforce that we have every layer mapped to some sort of asset
export const LayerToAssetMap: Record<CakeLayerType, assetInformation> = {
    // fill the stuff in here
    "eggs": {
        icon: EggTexture,
        isBlenderObj: false,
        block: EggTexture,
    },
    "flour": {
        icon: WheatTexture,
        isBlenderObj: false,
        block: WheatTexture,
    },
    "butter": {
        icon: ButterTexture,
        isBlenderObj: false,
        block: ButterTexture,
    },
    "sugar": {
        icon: SugarTexture,
        isBlenderObj: false,
        block: SugarTexture,
    },
    "strawberry": {
        // icon: Straw,
        // isBlenderObj: false, // TODO: make this true
        // block: StrawTexture, // TODO: update with strawberry blender model
        icon: Carrot,
        isBlenderObj: false, // TODO: make this true
        block: CarrotTexture, // TODO: update with carrot blender model
    },
    "chocolate": {
        // icon: Chocolate,
        // isBlenderObj: false, // TODO: make this true
        // block: ChocoTexture, // TODO: update with chocolate blender model
        icon: Carrot,
        isBlenderObj: false, // TODO: make this true
        block: CarrotTexture, // TODO: update with carrot blender model
    },
    "carrot": {
        icon: Carrot,
        isBlenderObj: false, // TODO: make this true
        block: CarrotTexture, // TODO: update with carrot blender model
    },
    // do all the combos now
    "cake_base": {
        icon: Base,
        isBlenderObj: false,
        block: BaseTexture,
    },
    "cake_frosting": {
        icon: Frosting,
        isBlenderObj: false,
        block: FrostingTexture,
    },
    "basic_cake": {
        icon: Cake,
        isBlenderObj: true,
        block: "blender/carrot_cake/carrot_cake.obj",
        mtl: "blender/carrot_cake/carrot_cake.mtl",
        // block: "blender/cake/cake.obj",
        // mtl: "blender/cake/cake.mtl",
        // block: "blender/straw_cake/straw_cake.obj",
        // mtl: "blender/straw_cake/straw_cake.mtl",
    },
    "choco_cake": {
        icon: ChocolateCake,
        isBlenderObj: true,
        // block: "blender/cake/cake.obj",
        // mtl: "blender/choco_cake/choco_cake.mtl",
        block: "blender/carrot_cake/carrot_cake.obj",
        mtl: "blender/carrot_cake/carrot_cake.mtl",
    },
    "straw_cake": {
        icon: StrawberryCake,
        isBlenderObj: true,
        // block: "blender/cake/cake.obj",
        // mtl: "blender/straw_cake/straw_cake.mtl",
        block: "blender/carrot_cake/carrot_cake.obj",
        mtl: "blender/carrot_cake/carrot_cake.mtl",
    },
    "carrot_cake": {
        icon: CarrotCake,
        isBlenderObj: true,
        block: "blender/carrot_cake/carrot_cake.obj",
        mtl: "blender/carrot_cake/carrot_cake.mtl",
    }
}

export interface playerAssets {
    gameIcon: string,
    lobbyIcon: string,
    charName: string,
    highlightGameIcon: string,
}

export const PlayerIndexToCharacterIcon: playerAssets[] = [
    {
        gameIcon: Chicken,
        lobbyIcon: ChickenLobby,
        charName: "Chicken",
        highlightGameIcon: ChickenHighlight
    },
    {
        gameIcon: Cow,
        lobbyIcon: CowLobby,
        charName: "Cow",
        highlightGameIcon: CowHighlight
    },
]