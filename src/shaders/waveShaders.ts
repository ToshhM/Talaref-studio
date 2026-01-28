export const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  uniform float uTime;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform vec2 uMouse;

  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.xxx * 2.0;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    float time = uTime * 0.2;

    // Create flowing, organic waves
    float noise1 = snoise(vec3(pos.x * 0.4, pos.y * 0.4, time * 0.5));
    float noise2 = snoise(vec3(pos.x * 0.25 + 50.0, pos.y * 0.25, time * 0.35));
    float noise3 = snoise(vec3(pos.x * 0.6, pos.y * 0.6 + 30.0, time * 0.45));
    float noise4 = snoise(vec3(pos.x * 0.15, pos.y * 0.15, time * 0.25));

    // Combine noises for smooth, fluid motion
    float elevation = (
      noise1 * 1.0 +
      noise2 * 0.7 +
      noise3 * 0.5 +
      noise4 * 0.8
    ) * uAmplitude * 1.5;

    // Add gentle rolling waves
    elevation += sin(pos.x * 0.8 + time * 0.6) * cos(pos.y * 0.6 + time * 0.5) * 0.4 * uAmplitude;

    // Subtle mouse interaction
    vec2 mouseOffset = uMouse * 6.0;
    float distToMouse = length(pos.xy - mouseOffset);
    float mouseInfluence = smoothstep(5.0, 0.0, distToMouse) * 0.5;
    elevation += mouseInfluence;

    pos.z += elevation;
    vElevation = elevation;

    // Calculate smooth normals
    float delta = 0.12;
    vec3 posX = position;
    posX.x += delta;
    float noiseX1 = snoise(vec3(posX.x * 0.4, posX.y * 0.4, time * 0.5));
    float noiseX2 = snoise(vec3(posX.x * 0.25 + 50.0, posX.y * 0.25, time * 0.35));
    float elevX = (noiseX1 * 1.0 + noiseX2 * 0.7) * uAmplitude * 1.5;
    posX.z += elevX;

    vec3 posY = position;
    posY.y += delta;
    float noiseY1 = snoise(vec3(posY.x * 0.4, posY.y * 0.4, time * 0.5));
    float noiseY2 = snoise(vec3(posY.x * 0.25 + 50.0, posY.y * 0.25, time * 0.35));
    float elevY = (noiseY1 * 1.0 + noiseY2 * 0.7) * uAmplitude * 1.5;
    posY.z += elevY;

    vec3 tangentX = normalize(posX - pos);
    vec3 tangentY = normalize(posY - pos);
    vNormal = normalize(cross(tangentX, tangentY));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vViewPosition;

  uniform vec3 uColorDeep;
  uniform vec3 uColorBright;
  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Iridescent colors - purple, blue, pink, gold
    vec3 purple = vec3(0.45, 0.25, 0.85);
    vec3 blue = vec3(0.25, 0.4, 0.95);
    vec3 pink = vec3(1.0, 0.35, 0.7);
    vec3 gold = vec3(0.85, 0.65, 0.45);
    vec3 lightPurple = vec3(0.7, 0.5, 1.0);

    // Calculate fresnel for metallic edge glow
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Use normal orientation for iridescent color shifts
    float normalX = normal.x * 0.5 + 0.5;
    float normalY = normal.y * 0.5 + 0.5;
    float normalZ = normal.z * 0.5 + 0.5;

    // Position-based color variation
    float positionGradient = (vPosition.x + vPosition.y) * 0.12 + 0.5;
    positionGradient = clamp(positionGradient, 0.0, 1.0);

    // Elevation-based color
    float elevationNorm = (vElevation + 1.5) / 3.0;
    elevationNorm = clamp(elevationNorm, 0.0, 1.0);

    // Create complex color mixing for iridescent effect
    vec3 color1 = mix(purple, blue, normalX);
    vec3 color2 = mix(pink, gold, normalY);
    vec3 baseColor = mix(color1, color2, positionGradient * 0.7 + normalZ * 0.3);

    // Add subtle time-based color shift
    float timeShift = sin(vPosition.x * 1.5 + vPosition.y * 1.2 + uTime * 0.3) * 0.5 + 0.5;
    baseColor = mix(baseColor, lightPurple, timeShift * 0.15);

    // Lighting - soft and diffused for smooth metallic look
    vec3 lightDir1 = normalize(vec3(1.0, 0.8, 2.0));
    vec3 lightDir2 = normalize(vec3(-0.8, -0.5, 1.5));

    float diff1 = max(dot(normal, lightDir1), 0.0);
    float diff2 = max(dot(normal, lightDir2), 0.0) * 0.3;
    float diffuse = diff1 + diff2;

    // Specular highlights for metallic sheen
    vec3 halfDir = normalize(lightDir1 + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 80.0);

    // Softer specular for secondary light
    vec3 halfDir2 = normalize(lightDir2 + viewDir);
    float spec2 = pow(max(dot(normal, halfDir2), 0.0), 40.0) * 0.5;

    // Build final color with metallic properties
    vec3 finalColor = baseColor * (0.25 + diffuse * 0.6);

    // Add bright specular highlights
    finalColor += (spec + spec2) * vec3(1.0, 0.95, 1.0) * 1.8;

    // Fresnel rim light with iridescent colors
    vec3 fresnelColor = mix(pink, lightPurple, normalX);
    finalColor += fresnel * fresnelColor * 0.7;

    // Edge glow on peaks
    float edgeGlow = pow(fresnel, 1.5) * smoothstep(0.2, 0.9, elevationNorm);
    finalColor += edgeGlow * gold * 0.5;

    // Metallic sheen based on normal orientation
    float metallicSheen = pow(normalZ, 2.0);
    finalColor += metallicSheen * vec3(0.15, 0.12, 0.18);

    // Slight ambient lift
    finalColor += vec3(0.02, 0.015, 0.03);

    // Smooth alpha with fresnel
    float alpha = 0.8 + fresnel * 0.15;
    alpha = clamp(alpha, 0.75, 0.95);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
