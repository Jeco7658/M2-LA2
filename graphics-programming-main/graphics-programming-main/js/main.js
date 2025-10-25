const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  10,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let cubeMesh = new THREE.Mesh();
let stars, starGeo, starMaterial;
let colorTimer = 0;

lighting();
cube();
particles();

function particles() {
  const particleCount = 6000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = Math.random() * 600 - 300; 
    positions[i * 3 + 1] = Math.random() * 600 - 300;
    positions[i * 3 + 2] = Math.random() * 600 - 300;
  }

  starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const sprite = new THREE.TextureLoader().load("assets/images/star.png");
  starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
    transparent: true,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  const positions = starGeo.attributes.position.array;

  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] -= 2; 
    if (positions[i + 1] < -300) {
      positions[i + 1] = 300; 
      positions[i] = Math.random() * 600 - 300;
      positions[i + 2] = Math.random() * 600 - 300; 
    }
  }

  starGeo.attributes.position.needsUpdate = true;

  colorTimer += 1 / 60;
  if (colorTimer >= 3) {
    colorTimer = 0;
    starMaterial.color.setHSL(Math.random(), 0.8, 0.6);
  }
}

function cube() {
  
  const displayName = "Jericho";

  
  const texture = new THREE.TextureLoader().load("assets/textures/wooden.jpg");

 
  const loader = new THREE.FontLoader();
  loader.load(
    "assets/fonts/helvetiker_regular.typeface.json",
    function (font) {
      const textGeo = new THREE.TextGeometry(displayName, {
        font: font,
        size: 6,
        height: 1.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.15,
        bevelSegments: 3,
      });

      
      textGeo.computeBoundingBox();
      if (textGeo.boundingBox) {
        const center = new THREE.Vector3();
        textGeo.boundingBox.getCenter(center);
        textGeo.translate(-center.x, -center.y, -center.z);
      }

      const textMaterial = new THREE.MeshStandardMaterial({ map: texture });
      cubeMesh = new THREE.Mesh(textGeo, textMaterial);

      
      cubeMesh.position.z = -5;
      camera.position.z = 35;

      scene.add(cubeMesh);
    },
    undefined,
    function (err) {
      console.error("Font load error:", err);
    }
  );
}

function lighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);

  animateParticles();

  cubeMesh.rotation.x += 0.008;
  cubeMesh.rotation.y += 0.008;

  renderer.render(scene, camera);
}

animate();
