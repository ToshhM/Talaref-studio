import * as THREE from 'three';

export class WaveScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private waveMesh: THREE.Mesh;
  private mouse: THREE.Vector2;
  private targetMouse: THREE.Vector2;
  private animationId: number | null = null;

  constructor(container: HTMLCanvasElement) {
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#000814');
    this.scene.fog = new THREE.Fog(0x000814, 5, 15);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      canvas: container,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Create abstract glass wave geometry
    const geometry = new THREE.PlaneGeometry(16, 10, 200, 140);
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      // Complex wave pattern for abstract look
      const wave1 = Math.sin(x * 0.4) * Math.cos(y * 0.3);
      const wave2 = Math.sin(x * 0.6 + 2) * Math.sin(y * 0.4);
      const wave3 = Math.cos(x * 0.35 - 1) * Math.cos(y * 0.55);
      const ripple = Math.sin(Math.sqrt(x * x + y * y) * 0.5);

      const z = (wave1 * 1.2 + wave2 * 0.8 + wave3 * 0.6 + ripple * 0.4) * 1.5;

      positionAttribute.setZ(i, z);
    }

    geometry.computeVertexNormals();

    // Glass material with high transmission and refraction
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xe8f4f8,
      metalness: 0.0,
      roughness: 0.05,
      transmission: 0.95,
      thickness: 1.2,
      ior: 1.5,
      reflectivity: 0.8,
      envMapIntensity: 2.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });

    this.waveMesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.waveMesh);

    this.addLights();
    this.setupEventListeners();
    this.animate();
  }

  private addLights() {
    // Soft ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Main directional light from top
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(0, 10, 8);
    this.scene.add(mainLight);

    // Cyan side light for glass refraction
    const cyanLight = new THREE.PointLight(0x00ffff, 2.5, 25);
    cyanLight.position.set(-8, 3, 5);
    this.scene.add(cyanLight);

    // Purple side light
    const purpleLight = new THREE.PointLight(0x8b5cf6, 2.5, 25);
    purpleLight.position.set(8, -3, 5);
    this.scene.add(purpleLight);

    // Pink accent from behind for depth
    const pinkLight = new THREE.PointLight(0xff1493, 2.0, 20);
    pinkLight.position.set(0, 0, -6);
    this.scene.add(pinkLight);

    // Blue top light
    const blueTopLight = new THREE.PointLight(0x3b82f6, 1.8, 22);
    blueTopLight.position.set(0, 6, 3);
    this.scene.add(blueTopLight);

    // Rim light for edges
    const rimLight = new THREE.DirectionalLight(0xa7f3d0, 1.0);
    rimLight.position.set(-5, -2, -5);
    this.scene.add(rimLight);
  }

  private setupEventListeners() {
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private onMouseMove(event: MouseEvent) {
    this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = () => {
    this.animationId = requestAnimationFrame(this.animate);

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    const time = Date.now() * 0.0004;

    // Animate glass wave geometry with flowing motion
    const geometry = this.waveMesh.geometry as THREE.BufferGeometry;
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);

      // Layered wave patterns for abstract glass effect
      const wave1 = Math.sin(x * 0.4 + time * 1.2) * Math.cos(y * 0.3 + time * 0.9);
      const wave2 = Math.sin(x * 0.6 + time * 0.7 + 2) * Math.sin(y * 0.4 + time * 1.1);
      const wave3 = Math.cos(x * 0.35 + time * 0.5 - 1) * Math.cos(y * 0.55 + time * 0.8);
      const ripple = Math.sin(Math.sqrt(x * x + y * y) * 0.5 - time * 1.5);
      const flow = Math.sin(x * 0.25 + time) * Math.cos(y * 0.2 + time * 0.6);

      const z = (wave1 * 1.2 + wave2 * 0.8 + wave3 * 0.6 + ripple * 0.4 + flow * 0.5) * 1.5;

      positionAttribute.setZ(i, z);
    }

    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    // Gentle floating rotation
    this.waveMesh.rotation.x = Math.sin(time * 0.3) * 0.12 - 0.1;
    this.waveMesh.rotation.y = Math.cos(time * 0.25) * 0.15 + time * 0.05;
    this.waveMesh.rotation.z = Math.sin(time * 0.2) * 0.08;

    // Mouse parallax interaction
    this.waveMesh.rotation.x += this.mouse.y * 0.15;
    this.waveMesh.rotation.y += this.mouse.x * 0.15;

    this.renderer.render(this.scene, this.camera);
  };

  public dispose() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('resize', this.onWindowResize.bind(this));

    this.waveMesh.geometry.dispose();
    if (this.waveMesh.material instanceof THREE.Material) {
      this.waveMesh.material.dispose();
    }

    this.renderer.dispose();
  }
}
