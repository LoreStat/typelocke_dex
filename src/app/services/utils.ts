import { EVOLUTIONS_GROUPS, EVOLUTIONS_GROUPS_2, EVOLUTIONS_GROUPS_3, EVOLUTIONS_GROUPS_4, POKEMON, TYPE } from "src/assets/constants/PokemonData";

export function getBackgroundClassFromRecentMove(value: string) {
  switch (value) {
    case "bu":
      return TYPE.BUG;
    case "da":
      return TYPE.DARK;
    case "dr":
      return TYPE.DRAGON;
    case "el":
      return TYPE.ELECTRIC;
    case "fg":
      return TYPE.FIGHTING;
    case "fr":
      return TYPE.FIRE;
    case "fl":
      return TYPE.FLYING;
    case "gh":
      return TYPE.GHOST;
    case "gs":
      return TYPE.GRASS;
    case "gr":
      return TYPE.GROUND;
    case "ic":
      return TYPE.ICE;
    case "no":
      return TYPE.NORMAL;
    case "po":
      return TYPE.POISON;
    case "ps":
      return TYPE.PSYCHIC;
    case "ro":
      return TYPE.ROCK;
    case "st":
      return TYPE.STEEL;
    case "wa":
      return TYPE.WATER;
    default:
      return "";
  }
}

export function getEffectivenessFromRecentMove(value: string) {
  switch (value) {
    case "+":
      return "effectiveness.superEffective";
    case "-":
      return "effectiveness.notEffective";
    case "x":
      return "effectiveness.immune";
    case "=":
      return "effectiveness.effective";
    default:
      return "";
  }
}


export function composeRecentMoveFromEffectiveness(value: string) {
  switch (value) {
    case "superEffective":
      return "+";
    case "notEffective":
      return "-";
    case "immune":
      return "x";
    case "effective":
      return "=";
    default:
      return "";
  }
}

export function composeRecentMoveFromType(value: string) {
  switch (value) {
    case TYPE.BUG:
      return "bu";
    case TYPE.DARK:
      return "da";
    case TYPE.DRAGON:
      return "dr";
    case TYPE.ELECTRIC:
      return "el";
    case TYPE.FIGHTING:
      return "fg";
    case TYPE.FIRE:
      return "fr";
    case TYPE.FLYING:
      return "fl";
    case TYPE.GHOST:
      return "gh";
    case TYPE.GRASS:
      return "gs";
    case TYPE.GROUND:
      return "gr";
    case TYPE.ICE:
      return "ic";
    case TYPE.NORMAL:
      return "no";
    case TYPE.POISON:
      return "po";
    case TYPE.PSYCHIC:
      return "ps";
    case TYPE.ROCK:
      return "ro";
    case TYPE.STEEL:
      return "st";
    case TYPE.WATER:
      return "wa";
    default:
      return "";
  }
}

export function getPokemonsListByGeneration(gen: number): string[] {
  switch(gen) {
    case 2:
      return POKEMON.slice(0, 251);
    case 3:
      return POKEMON.slice(0, 389);
    case 4:
      return POKEMON.slice(0, 505);
    default:
      return POKEMON;
  }
}


export function getEvolutionsGroupsByGeneration(gen: number): Record<string, string[]> {
  switch(gen) {
    case 2:
      return EVOLUTIONS_GROUPS_2;
    case 3:
      return EVOLUTIONS_GROUPS_3;
    case 4:
      return EVOLUTIONS_GROUPS_4;
    default:
      return EVOLUTIONS_GROUPS;
  }
}