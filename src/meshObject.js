import { Mesh, BoxGeometry, MeshLambertMaterial } from "three";

export class MeshObject {
  constructor(info) {
    this.name = info.name;
    this.scene = info.scene;
    this.width = info.width || 1;
    this.height = info.height || 1;
    this.depth = info.depth || 1;
    this.color = info.color || 'white';
    this.differenceY = info.differenceY || 0.4;
    this.x = info.x || 0;
    this.y = info.y || this.height / 2 + this.differenceY;
    this.z = info.z || 0;

    if (info.modelSrc) {
      // GLB
      info.loader.load(
        info.modelSrc,
        glb => {
          info.scene.add(glb.scene);
          glb.scene.traverse(child => {
            if(child.isMesh) {
              child.castShadow = true;
            }
          })
          glb.scene.position.set(this.x, this.y, this.z);
        },
        xhr => {
          console.log("loading...");
        },
        error => {
          console.log("error")
        }
      );
    } else {
      // Primitives
      const geometry = new BoxGeometry(this.width, this.height, this.depth);
      const material = new MeshLambertMaterial({
        color: this.color,
      })


      this.mesh = new Mesh(geometry, material);
      this.mesh.castShadow = true;
      this.mesh.receiveShadow = true;
      this.mesh.position.set(this.x, this.y, this.z);
      info.scene.add(this.mesh);
    }
  }
}