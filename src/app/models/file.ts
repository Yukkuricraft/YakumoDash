import { webSocket } from "rxjs/webSocket";
// Mayn of these were implemented following
// https://www.gnu.org/software/coreutils/manual/html_node/What-information-is-listed.html#index-long-ls-format

import {
  dateEpochTransformer,
  dateStringTransformer,
  modelTransformer,
} from "@app/helpers/dto-transformers";
import { Transform, Type } from "class-transformer";
import { Env, IEnv } from "./env";

export enum FileTypeBit {
  // Most of these will probably never be used...
  REG = "-",
  b = "b",
  c = "c",
  C = "C",
  d = "d",
  D = "D",
  l = "l",
  M = "M",
  n = "n",
  p = "p",
  P = "P",
  s = "s",
  QUESTION = "?",
}

export enum ExecutableModeBit {
  s = "s",
  S = "S",
  t = "t",
  T = "T",
  x = "x",
  OTHER = "-",
}

export interface IFileModeBits {
  read: boolean;
  write: boolean;
  execute: ExecutableModeBit;
}

export class FileModeBits implements IFileModeBits {
  read = false;
  write = false;

  execute = ExecutableModeBit.OTHER;
}

export interface IFileMode {
  fileType: FileTypeBit;
  global: IFileModeBits;
  group: IFileModeBits;
  owner: IFileModeBits;
}

export class FileMode implements IFileMode {
  fileType = FileTypeBit.QUESTION;

  @Transform(modelTransformer(FileModeBits))
  global = new FileModeBits();

  @Transform(modelTransformer(FileModeBits))
  group = new FileModeBits();

  @Transform(modelTransformer(FileModeBits))
  owner = new FileModeBits();
}

export interface IFileNode {
  name: string;
  uid: number;
  gid: number;
  fileMode: IFileMode;
  children: IFileNode[];
  modified: Date;
}

export class FileNode implements IFileNode {
  name = "";
  uid = 0;
  gid = 0;

  @Transform(modelTransformer(FileMode))
  fileMode = new FileMode();

  @Type(() => FileNode)
  children: FileNode[] = [];

  @Transform(dateEpochTransformer)
  modified = new Date();
  @Transform(dateEpochTransformer)
  created = new Date();
}

export interface IFileListResponse {
  env: IEnv;

  ls: IFileNode[];
}

export class FileListResponse {
  @Transform(modelTransformer(Env))
  env = new Env();

  @Type(() => FileNode)
  ls: FileNode[] = [];
}
