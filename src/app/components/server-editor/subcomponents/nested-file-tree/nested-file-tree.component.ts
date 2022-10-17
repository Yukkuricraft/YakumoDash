import { FilesService } from "@app/services/files/files.service";
import {
  AfterViewInit,
  Component,
  Injectable,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTree, MatTreeNestedDataSource } from "@angular/material/tree";
import { FileNode, DirPath } from "@app/models/file";
import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from "@angular/cdk/collections";
import {
  BehaviorSubject,
  isObservable,
  map,
  merge,
  Observable,
  of,
} from "rxjs";
import { Env } from "@app/models/env";

export const FILEPATH_ROOT = "secrets/configs";

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: "root" })
export class DynamicDatabase {
  constructor(private filesService: FilesService) {}

  /** Initial data from database */
  initialData(env: Env, subPath: string): Observable<FileNode[]> {
    return this.filesService
      .listFiles(`${FILEPATH_ROOT}/${env.name}/${subPath}`)
      .pipe(map(data => data.ls));
  }

  getChildren(node: FileNode): Observable<FileNode[]> {
    if (!node.isDir) {
      return of([]);
    }
    const path = node.pathString;
    // console.log("Getting children of:", path);
    return this.filesService.listFiles(path).pipe(map(data => data.ls));
  }

  isExpandable(node: FileNode): boolean {
    return node.isDir;
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
export class DynamicDataSource implements DataSource<FileNode> {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] {
    return this.dataChange.value;
  }
  set data(value: FileNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: NestedTreeControl<FileNode>,
    private _database: DynamicDatabase
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<FileNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if (
        (change as SelectionChange<FileNode>).added ||
        (change as SelectionChange<FileNode>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<FileNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data)
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<FileNode>) {
    console.log("Handle Tree Control", change);
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: FileNode, expand: boolean) {
    this._database.getChildren(node).subscribe(children => {
      const index = this.data.indexOf(node);
      if (!children || index < 0) {
        // If no children, or cannot find the node, no op
        return;
      }
    });
  }
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: "app-nested-file-tree",
  templateUrl: "nested-file-tree.component.html",
  styleUrls: ["nested-file-tree.component.scss"],
})
export class NestedFileTreeComponent implements AfterViewInit {
  @Input() env$!: Observable<Env>;
  @Input() subPath$!: Observable<string>;

  @ViewChild("treeSelector", { static: false }) tree!: MatTree<
    FileNode,
    FileNode
  >;

  treeControl!: NestedTreeControl<FileNode>;
  dataSource!: DynamicDataSource;

  constructor(
    private filesService: FilesService,
    private database: DynamicDatabase
  ) {
    this.treeControl = new NestedTreeControl<FileNode>(
      node => this.database.getChildren(node)
      // {
      //   trackBy: (fileNode: FileNode) => {
      //     console.log("tracking?", fileNode);
      //     return fileNode;
      //   },
      // }
    );

    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
  }

  ngAfterViewInit() {
    this.env$.subscribe(env => {
      this.subPath$.subscribe(subPath => {
        this.database
          .initialData(env, subPath)
          .subscribe(data => (this.dataSource.data = data));
      });
    });
  }

  hasChild = (_: number, node: FileNode) => {
    return node.isDir;
  };
}
