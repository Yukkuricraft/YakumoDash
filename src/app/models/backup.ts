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
  excludes: string[];
  gid: number;
  hostname: string;
  id: string;
  parent: string;
  paths: string[];
  programVersion: string;
  shortId: string;
  tags: string[];
  time: Date;
  tree: string;
  uid: number;
  username: string;
}

export class BackupDefinition implements IBackupDefinition {
  excludes = [];
  gid = 0;
  hostname = "";
  id = "";
  parent = "";
  paths = [];
  programVersion = "";
  shortId = "";
  tags = [];
  @Transform(dateStringTransformer)
  time = new Date();
  tree = "";
  uid = 0;
  username = "";
}