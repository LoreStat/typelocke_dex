import { Injectable } from "@angular/core";
import { SavedMatch, Settings } from "../models/models";
import { POKEMON, TYPES_LIST } from "src/assets/constants/PokemonData";
import { DataService } from "./data.service";
import { Filesystem, Directory, Encoding, GetUriOptions, ReadFileResult } from '@capacitor/filesystem';

@Injectable()
export class FileService {
  fs: any;
  constructor(private dataService: DataService) {
    //this.fs = (window as any).fs;
  }

  async getFile(name: string, singleMatch: boolean) {
    //return this.fs.readFileSync(`./saves/${singleMatch ? "games/" : ""}${name}`, { encoding: 'utf8' });
    return (await this.loadFile(name, singleMatch)).data as string;
  }

  private async loadFile(name: string, singleMatch: boolean): Promise<ReadFileResult> {
    return await Filesystem.readFile({
      path: `./saves/${singleMatch ? "games/" : ""}${name}`,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }

  async writeFile(name: string, data: any, singleMatch: boolean) {
    /* if(singleMatch && (!this.fs.existsSync('./saves/games'))) this.fs.mkdirSync('./saves/games');
    return this.fs.writeFileSync(`./saves/${singleMatch ? "games/" : ""}${name}`, data) */

    if(singleMatch && (!await this.checkFileExists({path:'./saves/games', directory: Directory.Documents }))) {
      console.log("CREA SAVES GAMES")
      await Filesystem.mkdir({
        path: './saves/games',
        directory: Directory.Documents,
        recursive: true
      })
    }

    return await Filesystem.writeFile({
      path: `./saves/${singleMatch ? "games/" : ""}${name}`,
      data: data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    })
  }

  private async checkFileExists(getUriOptions: GetUriOptions): Promise<boolean> {
    try {
      await Filesystem.stat(getUriOptions);
      return true;
    } catch (checkDirException : any) {
      if (checkDirException.message === 'File does not exist') {
        return false;
      } else {
        throw checkDirException;
      }
    }
  }

  public async writeSavedMatches(savedMatches: SavedMatch[], settings: Settings) {
    const settingsStringToSave = `${settings.automatic},${settings.automaticSummary},${settings.hideRecentPokemon},${settings.hdImages},${settings.language}\n`
    const matchesStringToSave = savedMatches.map(x => {
      return x.matchName + "," + x.file + "," + x.startDate + "," + x.lastLogin + "," + x.iconName
    }).join("\n");
    await this.writeFile("savedMatches.txt", settingsStringToSave + matchesStringToSave, false)
  }

  public async createMatchFile(matchTitle: string) {
    const allPoke = POKEMON;
    const allTypes = TYPES_LIST.join(",");

    const divididerString = `/?/?/${allTypes}////`;

    const data = allPoke.join(`${divididerString}\n`) + divididerString;
    await this.writeFile(matchTitle + ".txt", data, true);
  }

  public async saveChanges() {
    const data = this.dataService.getLoadedData();
    let stringedData = "";

    const pokes = Object.values(data);

    pokes.forEach(p => {
      stringedData += `${p.name}/${p.confirmedTypes[0]}/${p.confirmedTypes[1]}/${p.availableTypes.join(",")}/${p.dubiousTypes.join(",")}/${p.removedTypes.join(",")}/${p.registeredMoves.join(",")}/${(p.notes ? btoa(p.notes) : "")}\n`;
    });

    stringedData = stringedData.substring(0, stringedData.length - 1);

    //this.fs.writeFileSync(`./saves/games/${this.dataService.lastSelectedMatch}`, stringedData);
    return await Filesystem.writeFile({
      path: `./saves/games/${this.dataService.lastSelectedMatch}`,
      data: stringedData,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    })
  }

  public async deleteFile(value: string, savedMatches: SavedMatch[], settings: Settings) {
    /* this.fs.unlink(`./saves/games/${value}.txt`, (val: any) => {
      if(val == null) {
        this.writeSavedMatches(savedMatches, settings);
      }
    }); */
    await Filesystem.deleteFile({
      path: `./saves/games/${value}.txt`,
      directory: Directory.Documents
    })
    await this.writeSavedMatches(savedMatches, settings);
  }

  public async createOrGetSavedMatches() {
    /* try {
      return this.getFile('savedMatches.txt', false);
    } catch {
      //this.fs.mkdirSync('./saves/games', { recursive: true });
      await Filesystem.mkdir({
        path: './saves/games',
        directory: Directory.Documents,
        recursive: true
      })
  
      this.writeFile("savedMatches.txt", "true,true,false,true,it", false);
      return this.getFile('savedMatches.txt', false);
    } */
    if(await this.checkFileExists({path:'./saves/games', directory: Directory.Documents })) {
      console.log("STO GETTANDO")
      const a = await this.getFile('savedMatches.txt', false);
      console.log("SUCAAAAAAA");
      console.log(a);
      return a;
    } else {
      //this.fs.mkdirSync('./saves/games', { recursive: true });
      console.log("CREO CARTELLA")
      await Filesystem.mkdir({
        path: './saves/games',
        directory: Directory.Documents,
        recursive: true
      })
  
      await this.writeFile("savedMatches.txt", "true,true,false,true,it", false);
      return await this.getFile('savedMatches.txt', false);
    }
  }

  public async exportSave(data: string, matchName: string) {
    //return this.fs.writeFileSync(`./${matchName}-EXPORT.txt`, data);
    return await Filesystem.writeFile({
      path: `./saves/${matchName}-EXPORT.txt`,
      data: data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    })
  }
}
