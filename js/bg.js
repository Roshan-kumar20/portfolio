/**
 * bg.js — Three.js neural network background
 * Roshan Kumar Portfolio
 */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') return;

  const canvas = document.getElementById('bgCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 200);
  camera.position.z = 35;

  function resize() {
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ─ NODE POSITIONS & VELOCITIES ─ */
  const NODE_COUNT = 95;
  const nodeVel = [];
  const nodePos = new Float32Array(NODE_COUNT * 3);

  for (let i = 0; i < NODE_COUNT; i++) {
    nodePos[i * 3]     = (Math.random() - 0.5) * 65;
    nodePos[i * 3 + 1] = (Math.random() - 0.5) * 42;
    nodePos[i * 3 + 2] = (Math.random() - 0.5) * 32;
    nodeVel.push({
      x: (Math.random() - 0.5) * 0.038,
      y: (Math.random() - 0.5) * 0.038,
      z: (Math.random() - 0.5) * 0.02,
    });
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x00d4ff, size: 0.22, transparent: true, opacity: 0.75 });
  scene.add(new THREE.Points(pGeo, pMat));

  /* ─ CONNECTION LINES ─ */
  const lineGeo = new THREE.BufferGeometry();
  const maxPairs = NODE_COUNT * (NODE_COUNT - 1) / 2;
  const linePos = new Float32Array(maxPairs * 6);
  const lineCol = new Float32Array(maxPairs * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
  const lineMesh = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.32 })
  );
  scene.add(lineMesh);

  /* ─ FLOATING WIREFRAME SHAPES ─ */
  const shapes = [];
  const shapeDefs = [
    { geo: new THREE.IcosahedronGeometry(2.2, 0), color: 0x00d4ff, op: 0.1, x: -22, y: 8, z: -8 },
    { geo: new THREE.OctahedronGeometry(1.8, 0),  color: 0xa78bfa, op: 0.08, x: 20, y: -6, z: -10 },
    { geo: new THREE.TetrahedronGeometry(2, 0),   color: 0x00ff9d, op: 0.07, x: 2,  y: 14, z: -12 },
    { geo: new THREE.TorusKnotGeometry(1.2, 0.35, 40, 6), color: 0x00d4ff, op: 0.06, x: -10, y: -12, z: -6 },
  ];
  shapeDefs.forEach(({ geo, color, op, x, y, z }) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: op }));
    m.position.set(x, y, z);
    m.userData = { ox: x, oy: y };
    scene.add(m);
    shapes.push(m);
  });

  /* ─ BINARY RAIN PARTICLES ─ */
  const rainGeo = new THREE.BufferGeometry();
  const rainCount = 220;
  const rainPos = new Float32Array(rainCount * 3);
  const rainV = [];
  for (let i = 0; i < rainCount; i++) {
    rainPos[i * 3]     = (Math.random() - 0.5) * 75;
    rainPos[i * 3 + 1] = Math.random() * 52 - 12;
    rainPos[i * 3 + 2] = (Math.random() - 0.5) * 22;
    rainV.push(0.025 + Math.random() * 0.045);
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  scene.add(new THREE.Points(
    rainGeo,
    new THREE.PointsMaterial({ color: 0x00ff9d, size: 0.1, transparent: true, opacity: 0.22 })
  ));

  /* ─ MOUSE PARALLAX ─ */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
  });

  /* ─ CONNECTION UPDATE ─ */
  const THRESH = 16, THRESH2 = THRESH * THRESH;
  function updateConnections() {
    let li = 0, ci = 0;
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodePos[i*3]   - nodePos[j*3];
        const dy = nodePos[i*3+1] - nodePos[j*3+1];
        const dz = nodePos[i*3+2] - nodePos[j*3+2];
        const d2 = dx*dx + dy*dy + dz*dz;
        if (d2 < THRESH2) {
          const a = (1 - d2 / THRESH2) * 0.9;
          linePos[li]   = nodePos[i*3];   linePos[li+1] = nodePos[i*3+1]; linePos[li+2] = nodePos[i*3+2];
          linePos[li+3] = nodePos[j*3];   linePos[li+4] = nodePos[j*3+1]; linePos[li+5] = nodePos[j*3+2];
          lineCol[ci]   = a * 0.28; lineCol[ci+1] = a * 0.82; lineCol[ci+2] = a;
          lineCol[ci+3] = a * 0.65; lineCol[ci+4] = a * 0.45; lineCol[ci+5] = a * 0.75;
          li += 6; ci += 6;
        }
      }
    }
    lineGeo.setDrawRange(0, li / 3);
    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.attributes.color.needsUpdate = true;
  }

  /* ─ ANIMATION LOOP ─ */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Move nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      nodePos[i*3]   += nodeVel[i].x;
      nodePos[i*3+1] += nodeVel[i].y;
      nodePos[i*3+2] += nodeVel[i].z;
      if (Math.abs(nodePos[i*3])   > 32) nodeVel[i].x *= -1;
      if (Math.abs(nodePos[i*3+1]) > 21) nodeVel[i].y *= -1;
      if (Math.abs(nodePos[i*3+2]) > 16) nodeVel[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Rain
    const rp = rainGeo.attributes.position.array;
    for (let i = 0; i < rainCount; i++) {
      rp[i*3+1] -= rainV[i];
      if (rp[i*3+1] < -26) { rp[i*3+1] = 26; rp[i*3] = (Math.random() - 0.5) * 75; }
    }
    rainGeo.attributes.position.needsUpdate = true;

    // Shapes
    shapes.forEach((s, i) => {
      s.rotation.x += 0.003 + i * 0.001;
      s.rotation.y += 0.004 + i * 0.001;
      s.position.y  = s.userData.oy + Math.sin(t + i * 2.1) * 2.5;
    });

    updateConnections();

    camera.position.x += (mx * 3 - camera.position.x) * 0.025;
    camera.position.y += (-my * 2 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
})();
