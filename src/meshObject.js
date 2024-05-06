import { Mesh, BoxGeometry, MeshLambertMaterial } from "three";

export class MeshObject {
  constructor(info) {
    this.name = info.name;
    this.scene = info.scene;
    this.width = info.width || 1;
    this.height = info.height || 1;
    this.depth = info.depth || 1;
    this.color = info.color || 'white';
    this.x = info.x || 0;
    this.y = info.y || this.height / 2;
    this.z = info.z || 0;

    const geometry = new BoxGeometry(this.width, this.height, this.depth);
    const material = new MeshLambertMaterial({
      color: this.color,
    })


    this.mesh = new Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.set(this.x, this.y, this.z);
    this.scene.add(this.mesh);
  }
}