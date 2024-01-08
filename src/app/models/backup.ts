import {
  dateStringTransformer,
} from "@app/helpers/dto-transformers";
import { Transform } from "class-transformer";

export interface EnvToBackupsMapping {
  [env: string]: ContainerToBackupsMapping;
}

export interface ContainerToBackupsMapping {
  [container: string]: BackupDefinition[];
}

export interface IBackupDefinition {
  date: Date;
  id: string;
  tags: string[];
}

export class BackupDefinition implements IBackupDefinition {
  @Transform(dateStringTransformer)
  date = new Date();
  id = "";
  tags = [''];
}