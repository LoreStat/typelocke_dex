import { Injectable } from "@angular/core";
import { SavedMatch, Settings } from "../models/models";
import { POKEMON, TYPES_LIST } from "src/assets/constants/PokemonData";
import { DataService } from "./data.service";

@Injectable()
export class FileService {
  fs: any;
  constructor(private dataService: DataService) {
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

  public saveChanges() {
    const data = this.dataService.getLoadedData();
    let stringedData = "";

    const pokes = Object.values(data);

    pokes.forEach(p => {
      stringedData += `${p.name}/${p.confirmedTypes[0]}/${p.confirmedTypes[1]}/${p.availableTypes.join(",")}/${p.dubiousTypes.join(",")}/${p.removedTypes.join(",")}\n`;
    });

    stringedData = stringedData.substring(0, stringedData.length - 1);

    this.fs.writeFileSync(`./saves/games/${this.dataService.lastSelectedMatch}`, stringedData);
  }
}
