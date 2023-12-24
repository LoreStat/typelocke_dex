import { DropdownItem } from "src/app/models/models";

export const LOGO_ICON_PATH: string = "assets/images/icons/logoTD.png";

export const LANGUAGES: DropdownItem[] = [
  {label: "Italiano", value: "it"},
  {label: "English", value: "en"}
]

export const version = require('../../../package.json').version;
