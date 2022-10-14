import { includes } from "lodash";
import { webSocket } from "rxjs/webSocket";
// Mayn of these were implemented following
// https://www.gnu.org/software/coreutils/manual/html_node/What-information-is-listed.html#index-long-ls-format

import {
  dateEpochTransformer,
  dateStringTransformer,
  filePathTransformer,
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

  toString() {
    var str = "";

    str += this.read ? "r" : "-";
    str += this.write ? "w" : "-";
    str += this.execute;

    return str;
  }
}

export interface IFileMode {
  fileType: FileTypeBit;
  global: IFileModeBits;
  group: IFileModeBits;
  user: IFileModeBits;
}

export class FileMode implements IFileMode {
  fileType = FileTypeBit.QUESTION;

  toString() {
    const ft = this.fileType;
    const global = this.global.toString();
    const group = this.group.toString();
    const user = this.user.toString();

    return `${ft}${global}${group}${user}`;
  }

  @Transform(modelTransformer(FileModeBits))
  global = new FileModeBits();

  @Transform(modelTransformer(FileModeBits))
  group = new FileModeBits();

  @Transform(modelTransformer(FileModeBits))
  user = new FileModeBits();
}

export interface IDirPath {
  pathString: string; // The full path
  parts: string[]; // Its constituent parts
}

export class DirPath {
  pathString = "";
  parts: string[] = [];

  constructor(pathString: string, parts: string[]) {
    this.pathString = pathString;
    this.parts = parts;
  }

  get clone() {
    return new DirPath(this.pathString, this.parts.slice());
  }

  appendPart(part: string) {
    const pathString = `${this.pathString}/${part}`;
    var parts = this.parts.slice();
    parts.push(part);

    return new DirPath(pathString, parts);
  }

  /**
   * Given a 'prefix path', will remove it from the current this.pathString
   * and return the suffix path represented as a DirPath
   *
   * If there is no matching prefix, return null
   *
   * Eg,
   * - this.pathString: 'part1/part2/part3/part4'
   * - prefixPath: 'part1/part2'
   * - Returns: {
   *     pathString: 'part3/part4',
   *     parts: ['part3'. 'part4'],
   *   }
   *
   * Eg,
   * - this.pathString: 'part1/part2'
   * - prefixPath: 'partN'
   * - Returns: null
   *
   * @param path Path to "subtract" from this.pathString
   * @returns DirPath | null
   */
  relPath(prefixPath: string): DirPath | null {
    var currPath = this.parts.slice();
    if (currPath.length === 0) {
      return null;
    }

    for (const commonPart of prefixPath.split("/")) {
      var currPathStart = currPath.shift() as string;

      if (currPathStart !== commonPart) {
        currPath.unshift(currPathStart);
        return null;
      }
    }
    console.log("RELPATHS:", {
      pathString: this.pathString,
      prefix: prefixPath,
      currPath: currPath,
    });
    return new DirPath(currPath.join("/"), currPath);
  }

  /**
   * If the path is:
   * part1/part/part3/
   *
   * Returns:
   * ['part1', 'part2', 'part3']
   */
  get descentDown() {
    return this.parts;
  }

  get ascentUp() {
    return this.parts.reverse();
  }

  get parent() {
    var splitPath = this.pathString.split("/");
    splitPath.pop();

    const pathString = splitPath.join("/");
    var parts = this.parts;
    parts.pop();

    return new DirPath(pathString, parts);
  }
}

export interface IFileNode {
  basename: string;
  dirname: IDirPath;

  uid: number;
  gid: number;
  fileMode: IFileMode;
  children: IFileNode[];
  modified: Date;
  created: Date;
}

export class FileNode implements IFileNode {
  basename = ""; // Ie, the last part of the path. basename()
  @Transform(filePathTransformer)
  dirname = new DirPath("", []);

  get clone() {
    const node = new FileNode();

    node.basename = this.basename;
    node.dirname = this.dirname.clone;
    node.uid = this.uid;
    node.gid = this.gid;
    node.fileMode = this.fileMode;
    node.children = this.children.slice();
    node.modified = this.modified;
    node.created = this.created;

    return node;
  }

  get path() {
    return this.dirname.appendPart(this.basename);
  }
  get pathString() {
    return this.path.pathString;
  }

  uid = 0;
  gid = 0;

  get isDir() {
    return this.fileMode.fileType === FileTypeBit.d;
  }

  @Transform(modelTransformer(FileMode))
  fileMode = new FileMode();

  @Type(() => FileNode)
  children: FileNode[] = [];

  static nodeSortCallback(a: FileNode, b: FileNode) {
    const pathA = a.path.pathString;
    const pathB = b.path.pathString;

    if (pathA < pathB) {
      return -1;
    } else if (pathA > pathB) {
      return 1;
    } else {
      // Add more fields to sort by like ctime/mtime or filesize
      return 0;
    }
  }

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
