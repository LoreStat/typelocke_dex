import { Injectable } from "@angular/core";

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


}
