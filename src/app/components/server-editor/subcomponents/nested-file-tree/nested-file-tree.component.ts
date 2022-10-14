import { FilesService } from "@app/services/files/files.service";
import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTree, MatTreeNestedDataSource } from "@angular/material/tree";
import { FileNode, DirPath } from "@app/models/file";
import {
  CollectionViewer,
  DataSource,
  SelectionChange,
} from "@angular/cdk/collections";
import { BehaviorSubject, map, merge, Observable } from "rxjs";

export const FILEPATH_ROOT = "secrets/configs";

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable({ providedIn: "root" })
export class DynamicDatabase {
  constructor(private filesService: FilesService) {}

  /** Initial data from database */
  initialData(): Observable<FileNode[]> {
    return this.filesService
      .listFiles(FILEPATH_ROOT)
      .pipe(map(data => data.ls));
  }

  getChildren(node: FileNode): Observable<FileNode[]> {
    const path = node.pathString;
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
      console.log("\n=================\n");
      console.log("TOGGLENODE: GOT CHILDREN");
      console.log(children);
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
export class NestedFileTreeComponent {
  @ViewChild("treeSelector", { static: false }) tree!: MatTree<
    FileNode,
    FileNode
  >;

  treeControl: NestedTreeControl<FileNode>;
  dataSource: DynamicDataSource;

  constructor(
    private filesService: FilesService,
    private database: DynamicDatabase
  ) {
    // this.treeControl = new NestedTreeControl<FileNode>(node => node.children);
    console.log("TEST CALLING GET CHILDREN:");
    console.log(this.database.getChildren(new FileNode()));
    this.treeControl = new NestedTreeControl<FileNode>(
      node => this.database.getChildren(node)
      // (node: FileNode) => node.isDir
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);
    this.database
      .initialData()
      .subscribe(data => (this.dataSource.data = data));
  }

  printData() {
    console.log(this.dataSource.data);
  }

  hasChild = (_: number, node: FileNode) => node.isDir;
}
