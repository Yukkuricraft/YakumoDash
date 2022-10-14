import { FilesService } from "@app/services/files/files.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { NestedTreeControl } from "@angular/cdk/tree";
import { MatTree, MatTreeNestedDataSource } from "@angular/material/tree";
import { FileNode, FilePath } from "@app/models/file";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
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

  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  FILEPATH_ROOT = "secrets/configs";

  constructor(private filesService: FilesService) {
    this.filesService.listFiles(this.FILEPATH_ROOT).subscribe(data => {
      this.dataSource.data = data.ls;
    });
  }

  /**
   * Takes a `path` and traverses down from this.dataSource.data to
   * set the children nodes at the appropriate node.
   *
   * @param path The path to set the children at
   * @param children The children FileNode[] to set.
   */
  setNodeChildren(path: FilePath, children: FileNode[]) {
    var treeData: FileNode[] = this.dataSource.data;
    const tmp = path.relPath(this.FILEPATH_ROOT);
    if (tmp === null) {
      throw Error(
        `How can we possibly have a non-relative path?? Path to set: '${path}', FILEPATH_ROOT: '${this.FILEPATH_ROOT}'`
      );
    }
    path = tmp;

    console.log(path.descentDown);
    var descentDown = path.descentDown;
    var nextPart = descentDown.shift();

    console.log("SETTING NODE CHILDREN:");
    console.log(nextPart, descentDown);

    console.log("\nSEARCHING FOR INITIAL TREE NODE");
    var newTreeData: FileNode[] = [];
    for (const treeNode of treeData) {
      console.log(treeNode);
      if (treeNode.basename == nextPart) {
        const newlyPopulatedNodeAncestor = this._recSetNodeChildren(
          treeNode,
          descentDown,
          children
        );

        newTreeData = [];
        for (const node of treeData) {
          if (
            node.path.pathString === newlyPopulatedNodeAncestor.path.pathString
          ) {
            console.log("WHAT");
            continue;
          }
          newTreeData.push(node);
        }
        newTreeData.push(newlyPopulatedNodeAncestor);
        newTreeData.sort(FileNode.nodeSortCallback);
      }
    }
    console.log("CHILDREN SET");
    console.log(newTreeData);

    this.dataSource.data = newTreeData;
    this.dataSource.data = this.dataSource.data.slice();
    // this.tree.renderNodeChanges(newTreeData);
  }

  printData() {
    console.log(this.dataSource.data);
  }

  _recSetNodeChildren(
    node: FileNode,
    descentDown: string[],
    children: FileNode[]
  ): FileNode {
    if (descentDown.length == 0) {
      // Base case - we're at the right node.
      node.children = children;
      return node;
    } else {
      // Rec - traverse further down.
      const nextPart = descentDown.shift();
      for (const candidateNode of node.children) {
        console.log("TESTING CANDIDATE NODE:");
        console.log(candidateNode, nextPart);
        if (candidateNode.basename == nextPart) {
          return {
            ...node,
            children: [
              ...node.children,
              this._recSetNodeChildren(candidateNode, descentDown, children),
            ],
          } as FileNode;
        }
      }

      throw Error("Could not successfuly set node children...");
    }
  }

  getNodeChildren(node: FileNode) {
    console.log(node);
    this.filesService.listFiles(node.path.pathString).subscribe(results => {
      this.setNodeChildren(node.path, results.ls);
    });
  }

  hasChild = (_: number, node: FileNode) => node.isDir;
}
