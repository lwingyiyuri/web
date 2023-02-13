   	// ========== materials.js ===============

const textureLoader = new THREE.TextureLoader();
const alphaTexture = textureLoader.load("https://i.imgur.com/KzSLWvK.jpg");

const wireMaterial = new THREE.MeshBasicMaterial({
  color: "#00ff00",
  wireframe: true
});

const starMaterial = new THREE.PointsMaterial({
  color: "#009900",
  transparent: true,
  size: 0.01,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const selectorMaterial = new THREE.MeshBasicMaterial({
  color: "#00ff00",
  transparent: true,
  alphaMap: alphaTexture,
  wireframe: true
});

//============ star.js ====================

const createStar = (density) => {
  const starMesh = new THREE.Group();

  for (let i = 0; i < density; i++) {
    const radius = Math.random();
    const starGeometry = new THREE.SphereGeometry(radius, 16, 16);
    const mesh = new THREE.Points(starGeometry, starMaterial);
    mesh.rotation.y = Math.random() * Math.PI;
    mesh.rotation.x = Math.random() * Math.PI;
    starMesh.add(mesh);
  }

  const star = {
    starMesh
  };

  return star;
};

//============ planet.js ==================

const createPlanetName = () => {
  const getCode = (from, to) => Math.ceil(Math.random() * (to - from)) + from;
  const firstPart = String.fromCharCode(
    getCode(65, 90),
    getCode(65, 90),
    getCode(65, 90)
  );
  const secondPart = String.fromCharCode(
    getCode(48, 57),
    getCode(48, 57),
    getCode(48, 57)
  );
  return firstPart + "-" + secondPart;
};

const createPlanet = (orbitRadius) => {
  const planetGroup = new THREE.Group();

  const planetVertices = Math.ceil(Math.random() * 16);

  const planetMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, planetVertices, planetVertices),
    wireMaterial
  );
  const orbitAngle = Math.PI * 2 * Math.random();
  planetMesh.position.x = Math.sin(orbitAngle) * orbitRadius;
  planetMesh.position.z = Math.cos(orbitAngle) * orbitRadius;

  const orbitDensity = 2000;
  const planetOrbitGeometry = new THREE.BufferGeometry();
  const positionsArray = new Float32Array(orbitDensity * 3);

  for (let i = 0; i < orbitDensity; i++) {
    const i3 = i * 3;
    const angle = Math.PI * 2 * Math.random();

    positionsArray[i3] = Math.sin(angle) * orbitRadius;
    positionsArray[i3 + 1] = 0;
    positionsArray[i3 + 2] = Math.cos(angle) * orbitRadius;
  }

  planetOrbitGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionsArray, 3)
  );
  const planetOrbit = new THREE.Points(planetOrbitGeometry, starMaterial);

  const planetSelectMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 1.3),
    selectorMaterial
  );

  planetSelectMesh.position.x = Math.sin(orbitAngle) * orbitRadius;
  planetSelectMesh.position.z = Math.cos(orbitAngle) * orbitRadius;

  const selection = {
    hovered: false,
    clicked: false
  };

  planetSelectMesh.visible = false;

  planetGroup.add(planetMesh, planetOrbit, planetSelectMesh);

  planetGroup.rotation.x = (Math.random() - 0.5) * 0.2;

  const velocity = Math.random();

  const planetName = createPlanetName();

  const planet = {
    orbitRadius,
    orbitAngle,
    planetVertices,
    planetGroup,
    selection,
    planetSelectMesh,
    planetName,
    planetMesh,
    planetOrbitGeometry,
    velocity
  };

  return planet;
};

const onPlanetHover = (planet, planets) => {
  planets.map((p) => {
    p.selection.hovered = false;
    p.planetSelectMesh.visible = p.selection.clicked;
  });

  planet.selection.hovered = true;
  planet.planetSelectMesh.visible = true;
};

const notPlanetSelected = (planets) => {
  planets.map((p) => {
    p.selection.hovered = false;
    p.planetSelectMesh.visible = p.selection.clicked;
  });
};

//================= sistem.js ===================

const generateSistem = (actualSistem, scene) => {
  if (actualSistem !== null) {
    actualSistem.planets.map((p) => {
      p.planetMesh.geometry.dispose();
      p.planetSelectMesh.geometry.dispose();
      p.planetOrbitGeometry.dispose();
    });
    // actualSistem.star.starMesh.geometry.dispose();
    scene.remove(actualSistem.sistem);
  }

  actualSistem = {
    sistem: new THREE.Group(),
    planets: []
  };

  const planetsQuantity = Math.floor(Math.random() * 6) + 2;
  for (let i = 0; i < planetsQuantity; i++) {
    const newPlanet = createPlanet(i * 2 + 3);
    actualSistem.planets.push(newPlanet);
    actualSistem.sistem.add(newPlanet.planetGroup);
  }

  const starDensity = Math.ceil(Math.random() * 15);
  const star = createStar(starDensity);

  actualSistem.star = star;

  actualSistem.sistem.add(star.starMesh);
  scene.add(actualSistem.sistem);

  // console.log(actualSistem.planets[0].planetGroup)

  return actualSistem;
};

const animateSistem = (actualSistem, elapsedTime, camera) => {
  if (actualSistem) {
    actualSistem.planets.map((planet) => {
      planet.planetGroup.rotation.y = elapsedTime * planet.velocity * 0.2;
      planet.planetGroup.children[0].rotation.y = elapsedTime * 0.2;
      planet.planetGroup.children[2].rotation.y =
        -elapsedTime * planet.velocity * 0.2;
      // planet.planetGroup.children[2].lookAt(camera.position);
    });
    actualSistem.star.starMesh.rotation.y = elapsedTime * 0.2;
  }
};

//================== main.js ===================

const OS = {
  booting: true
};

const head = document.querySelector("#head");
const properties = document.querySelector("#properties");

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
let actualSistem = null;
actualSistem = generateSistem(actualSistem, scene);

document.getElementById("button").addEventListener(
  "click",
  function (event) {
    actualSistem = generateSistem(actualSistem, scene);
    head.innerHTML = `SPATIAL SYSTEMS INFORMATION`;
    properties.innerHTML = `Select a planet to start`;
  },
  false
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
let target = new THREE.Vector3(0, 0, 0);
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 20;
camera.position.y = 5;
camera.lookAt(target);
scene.add(camera);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

// RayCaster

const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / sizes.width) * 2 - 1;
  mouse.y = -(e.clientY / sizes.height) * 2 + 1;
});

window.addEventListener("click", () => {
  actualSistem.planets.map((p) => {
    p.selection.clicked = false;
  });
  if (planetHovered) {
    planetHovered.selection.clicked = true;
    // console.log(planetHovered);

    head.innerHTML = `PLANET: ${planetHovered.planetName}`;
    properties.innerHTML = `
          <div class="descriptor">orbit angle:  ${Number.parseFloat(
            planetHovered.orbitAngle
          ).toFixed(2)}</div>
          <div class="descriptor">orbit radius:  ${
            planetHovered.orbitRadius
          } </div>
          <div class="descriptor">vertex render:  ${
            planetHovered.planetVertices
          } </div>
          <div class="descriptor">velocity:  ${Number.parseFloat(
            planetHovered.velocity
          ).toFixed(2)}</div>
        
        `;
    target = planetHovered.planetMesh.position;
    // camera.lookAt(target)
    // console.log(camera, target);
  }
});

const raycaster = new THREE.Raycaster();
let planetHovered = null;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animate Sistem
  animateSistem(actualSistem, elapsedTime, camera);

  // RayCast
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(
    actualSistem.planets.map((p) => p.planetGroup.children[0])
  );

  planetHovered = actualSistem.planets.find((p) =>
    intersects[0] ? p.planetGroup.children[0] === intersects[0].object : null
  );

  if (planetHovered) {
    onPlanetHover(planetHovered, actualSistem.planets);
  } else {
    notPlanetSelected(actualSistem.planets);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
