import { Injectable } from "@angular/core";
import { SavedMatch, Settings } from "../models/models";
import { POKEMON, TYPES_LIST } from "src/assets/constants/PokemonData";

@Injectable()
export class FileService {
  fs: any;
  constructor() {
    this.fs = (window as any).fs;
  }

  getFile(name: string, singleMatch: boolean) {
    return this.fs.readFileSync(`./saves/${singleMatch ? "games/" : ""}${name}`, { encoding: 'utf8'});
  }

  writeFile(name: string, data: any, singleMatch: boolean) {
    return this.fs.writeFileSync(`./saves/${singleMatch ? "games/" : ""}${name}`, data)
  }

  public writeSavedMatches(savedMatches: SavedMatch[], settings: Settings) {
    const settingsStringToSave = `${settings.suggestions},${settings.automatic},${settings.language}\n`
    const matchesStringToSave = savedMatches.map(x => {
      return x.matchName + "," + x.file + "," + x.startDate + "," + x.lastModified + "," + x.iconName
    }).join("\n");
    this.writeFile("savedMatches.txt", settingsStringToSave + matchesStringToSave, false)
  }

  public createMatchFile(matchTitle: string) {
    const allPoke = POKEMON;
    const allTypes = TYPES_LIST.join(",");

    const divididerString = `/?/?/${allTypes}//`;

    const data = allPoke.join(`${divididerString}\n`) + divididerString;
    this.writeFile(matchTitle + ".txt", data, true);
  }
}
