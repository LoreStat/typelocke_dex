import { Injectable } from "@angular/core";

@Injectable()
export class FileService {
  fs: any;
  constructor() {
    // or this.fs = <any>window.fs
    this.fs = (window as any).fs;
  }

  // read file synchronous
  getFile(path: string) {
    // return synchronous filestream
    return this.fs.readFileSync(path);
  }

  writeFile(name: string, data: any) {
    return this.fs.writeFileSync(`./saves/${name}.txt`, data)
  }
}
