// Home page: the forge. Loaded as a module by theme/layouts/home.liquid, after site.js.
//
// 1. createForge(): draws the anvil, the hammer and the struck medallion with WebGL2, no library.
//    Anvil and hammer come from scripts/make-forge-models.py (.bin + WebP textures, next to this file).
//    The medallion is a brass disc made here, with the list's emblem (an SVG) raised on its top face.
//    It renders only when something changes (a strike, a resize): nothing runs while idle.
//    At rest the hammer is out of frame, the anvil is dark, small and sunk, and the medallion stands up level
//    with the section title; a strike brings the anvil back, lays the medallion on it, swings once, and raises
//    the new one.
// 2. The page: one screen of scroll per section. Each section is struck in: the hammer comes down,
//    the background opens as a circle from the impact, the title decodes (site.js scramble), the line
//    under it types out and the numbers count up. Without WebGL the list's emblem shows instead of the
//    3D scene; with reduced motion the sections just swap.
async function createForge(canvas, base, emblems) {
  performance.mark('forge:context');
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) throw new Error('no webgl2');

  // ---------- matrices (column-major) ----------
  const M = {
    mul(a, b) { const o = new Array(16); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) { let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k]; o[c * 4 + r] = s; } return o; },
    t: (x, y, z) => [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1],
    s: (k) => [k,0,0,0, 0,k,0,0, 0,0,k,0, 0,0,0,1],
    ry(a) { const c = Math.cos(a), s = Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; },
    rz(a) { const c = Math.cos(a), s = Math.sin(a); return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; },
    rx(a) { const c = Math.cos(a), s = Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; },
    persp(fy, asp, n, f) { const t = 1 / Math.tan(fy / 2); return [t / asp,0,0,0, 0,t,0,0, 0,0,(f + n) / (n - f),-1, 0,0,2 * f * n / (n - f),0]; },
    look(e, c, u) {
      const sub = (a, b) => a.map((v, i) => v - b[i]), nrm = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); };
      const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      const z = nrm(sub(e, c)), x = nrm(cr(u, z)), y = cr(z, x);
      return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot(x, e),-dot(y, e),-dot(z, e),1];
    },
    inv(m) {   // general 4x4 inverse
      const o = new Array(16), [a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15] = m;
      const b0 = a0*a5-a1*a4, b1 = a0*a6-a2*a4, b2 = a0*a7-a3*a4, b3 = a1*a6-a2*a5, b4 = a1*a7-a3*a5, b5 = a2*a7-a3*a6;
      const b6 = a8*a13-a9*a12, b7 = a8*a14-a10*a12, b8 = a8*a15-a11*a12, b9 = a9*a14-a10*a13, b10 = a9*a15-a11*a13, b11 = a10*a15-a11*a14;
      const d = 1 / (b0*b11-b1*b10+b2*b9+b3*b8-b4*b7+b5*b6);
      o[0]=(a5*b11-a6*b10+a7*b9)*d; o[1]=(a2*b10-a1*b11-a3*b9)*d; o[2]=(a13*b5-a14*b4+a15*b3)*d; o[3]=(a10*b4-a9*b5-a11*b3)*d;
      o[4]=(a6*b8-a4*b11-a7*b7)*d; o[5]=(a0*b11-a2*b8+a3*b7)*d; o[6]=(a14*b2-a12*b5-a15*b1)*d; o[7]=(a8*b5-a10*b2+a11*b1)*d;
      o[8]=(a4*b10-a5*b8+a7*b6)*d; o[9]=(a1*b8-a0*b10-a3*b6)*d; o[10]=(a12*b4-a13*b2+a15*b0)*d; o[11]=(a9*b2-a8*b4-a11*b0)*d;
      o[12]=(a5*b7-a4*b9-a6*b6)*d; o[13]=(a0*b9-a1*b7+a2*b6)*d; o[14]=(a13*b1-a12*b3-a14*b0)*d; o[15]=(a8*b3-a9*b1+a10*b0)*d;
      return o;
    },
    apply(m, p) { const v = [0, 0, 0, 0]; for (let r = 0; r < 4; r++) v[r] = m[r] * p[0] + m[4 + r] * p[1] + m[8 + r] * p[2] + m[12 + r]; return v; },
  };

  // ---------- shaders ----------
  // uKind: 0 = textured model, 1 = vertex-coloured model, 2 = medallion
  const VS = `#version 300 es
  layout(location=0) in vec3 aP; layout(location=1) in vec3 aN; layout(location=2) in vec2 aT; layout(location=3) in vec4 aK;
  uniform mat4 uM, uVP; uniform vec3 uC, uH;
  out vec3 vW; out vec3 vN; out vec2 vT; out vec4 vK;
  void main() { vec4 w = uM * vec4(uC + aP * uH, 1.); vW = w.xyz; vN = mat3(uM) * aN; vT = aT; vK = aK; gl_Position = uVP * w; }`;
  const FS = `#version 300 es
  precision highp float;
  in vec3 vW; in vec3 vN; in vec2 vT; in vec4 vK;
  uniform sampler2D uCol, uNor, uMR, uEmb; uniform vec3 uEye, uHeatP; uniform float uHeat, uKind, uHot, uLit, uFront, uAlpha;
  out vec4 o;
  vec3 lin(vec3 c) { return pow(c, vec3(2.2)); }
  vec3 perturb(vec3 N, vec3 p, vec2 uv) {
    vec3 dp1 = dFdx(p), dp2 = dFdy(p); vec2 du1 = dFdx(uv), du2 = dFdy(uv);
    vec3 dp2p = cross(dp2, N), dp1p = cross(N, dp1);
    vec3 T = dp2p * du1.x + dp1p * du2.x, B = dp2p * du1.y + dp1p * du2.y;
    float s = inversesqrt(max(dot(T, T), dot(B, B)) + 1e-12);
    vec3 m = texture(uNor, uv).xyz * 2. - 1.;
    return normalize(mat3(T * s, B * s, N) * m);
  }
  float ggx(float nh, float a) { float a2 = a * a; float d = nh * nh * (a2 - 1.) + 1.; return a2 / (3.14159 * d * d); }
  vec3 light(vec3 N, vec3 V, vec3 L, vec3 col, vec3 alb, float rough, float metal) {
    vec3 H = normalize(L + V); float nl = max(dot(N, L), 0.), nh = max(dot(N, H), 0.), vh = max(dot(V, H), 0.);
    vec3 F0 = mix(vec3(.04), alb, metal); vec3 F = F0 + (1. - F0) * pow(1. - vh, 5.);
    vec3 spec = F * ggx(nh, max(rough * rough, .03)) * .25;
    return (spec + (1. - F) * (1. - metal) * alb / 3.14159) * col * nl;
  }
  void main() {
    vec3 alb; float rough, metal; vec3 N = normalize(vN); vec3 emit = vec3(0.);
    if (uKind < .5) { alb = lin(texture(uCol, vT).rgb); vec2 mr = texture(uMR, vT).gb; rough = mr.x; metal = mr.y; N = perturb(N, vW, vT); }
    else if (uKind < 1.5) { alb = pow(vK.rgb, vec3(1.5)); rough = vK.a; metal = .92; }
    else {
      // medallion: vT is the top face position (0..1), vK.x = 1 on the top face, 0 on the rim
      float top = vK.x;
      vec2 e = vec2(1. / 512., 0.);
      float h = texture(uEmb, vT).g;
      float hx = texture(uEmb, vT + e.xy).g - texture(uEmb, vT - e.xy).g;
      float hz = texture(uEmb, vT + e.yx).g - texture(uEmb, vT - e.yx).g;
      if (top > .5) N = normalize(vec3(-hx * 14., 1., -hz * 14.));
      float raised = texture(uEmb, vT).r * top;
      alb = mix(vec3(.2, .12, .04), vec3(1., .74, .34), raised + (1. - top) * .45);   // dark sunk field, polished raised emblem
      rough = mix(.7, .16, raised); metal = mix(.6, 1., raised);
      emit = mix(vec3(.9, .18, .02), vec3(2.4, 1.3, .45), h) * uHot * uHot;   // still glowing from the forge
    }
    rough = clamp(rough, .2, 1.);
    vec3 V = normalize(uEye - vW);
    // uLit: the anvil and the hammer are lit by the strike, then sink back to a dark shape with a brass edge.
    // The medallion always keeps its light, plus a soft front light (uFront) while it stands up facing the viewer.
    float k = uKind < 1.5 ? uLit : 1., rim = uKind < 1.5 ? max(uLit, .28) : 1.;
    vec3 c = vec3(0.);
    c += light(N, V, normalize(vec3(-1., .55, .55)), vec3(4.2, 2.1, .9) * k, alb, rough, metal);
    c += light(N, V, normalize(vec3(.9, .7, -.8)), vec3(2.4, 1.75, 1.0) * rim, alb, rough, metal);
    c += light(N, V, normalize(vec3(.3, 1., .6)), vec3(.7, .62, .55) * k, alb, rough, metal);
    c += light(N, V, V, vec3(.9, .76, .58) * uFront, alb, rough, metal);
    vec3 hl = uHeatP - vW; float hd = length(hl);
    c += light(N, V, hl / hd, vec3(6., 2.6, .7) * uHeat / (1. + 30. * hd * hd), alb, rough, metal);
    vec3 R = reflect(-V, N); float rb = rough * rough;
    vec3 env = mix(vec3(.03, .022, .016), vec3(.22, .15, .09), smoothstep(-.3, .9, R.y) * (1. - rb * .5));
    env += vec3(1.3, .5, .15) * pow(max(-R.x * .8 + .2 - R.y * .3, 0.), mix(6., 2., rb)) * .9;
    env *= uKind < 1.5 ? max(uLit, .2) : 1.;
    vec3 F0 = mix(vec3(.04), alb, metal); float nv = max(dot(N, V), 0.);
    c += env * (F0 + (max(vec3(1. - rough), F0) - F0) * pow(1. - nv, 5.)) * (1. - rb * .6) + alb * (1. - metal) * vec3(.06, .05, .04);
    c += emit;
    c = c * (2.51 * c + .03) / (c * (2.43 * c + .59) + .14);
    o = vec4(pow(clamp(c, 0., 1.), vec3(1. / 2.2)) * uAlpha, uAlpha);   // premultiplied
  }`;
  // Start-up never blocks the page for long: shaders compile in the background where the browser can
  // (KHR_parallel_shader_compile), and every step below gives the main thread back before the next one.
  const pause = () => new Promise((r) => (window.requestIdleCallback ? requestIdleCallback(() => r(), { timeout: 200 }) : setTimeout(r, 16)));
  performance.mark('forge:start');
  const sh = (t, s) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
  const prog = gl.createProgram(), vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS);
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  const pc = gl.getExtension('KHR_parallel_shader_compile');
  if (pc) while (!gl.getProgramParameter(prog, pc.COMPLETION_STATUS_KHR)) await new Promise((r) => setTimeout(r, 20));
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getShaderInfoLog(fs) || gl.getShaderInfoLog(vs) || gl.getProgramInfoLog(prog));
  performance.mark('forge:shaders');

  // ---------- sparks: one burst at each impact (asked for by the user, Nov 21 2026; nothing runs at rest) ----------
  // Points drawn additively, round and soft, sized by distance; colour and size come per point from the CPU.
  const sprog = gl.createProgram();
  gl.attachShader(sprog, sh(gl.VERTEX_SHADER, `#version 300 es
  layout(location=0) in vec3 aP; layout(location=1) in vec4 aC;
  uniform mat4 uVP; uniform float uPx; out vec3 vC;
  void main() { gl_Position = uVP * vec4(aP, 1.); gl_PointSize = max(1., aC.a * uPx / gl_Position.w); vC = aC.rgb; }`));
  gl.attachShader(sprog, sh(gl.FRAGMENT_SHADER, `#version 300 es
  precision mediump float; in vec3 vC; out vec4 o;
  void main() { float d = length(gl_PointCoord - .5) * 2.; float a = clamp(1. - d, 0., 1.); a *= a; o = vec4(vC * a, 0.); }`));
  gl.linkProgram(sprog);
  if (!gl.getProgramParameter(sprog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(sprog));
  const SU = { vp: gl.getUniformLocation(sprog, 'uVP'), px: gl.getUniformLocation(sprog, 'uPx') };
  const SPARKS = 90, TRAIL = 3, sdata = new Float32Array(SPARKS * TRAIL * 7);
  const svao = gl.createVertexArray(), sbuf = gl.createBuffer();
  gl.bindVertexArray(svao); gl.bindBuffer(gl.ARRAY_BUFFER, sbuf); gl.bufferData(gl.ARRAY_BUFFER, sdata.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 28, 0);
  gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 28, 12);
  gl.bindVertexArray(null);
  let sparks = [];
  const U = {}; for (const n of ['uM', 'uVP', 'uC', 'uH', 'uCol', 'uNor', 'uMR', 'uEmb', 'uEye', 'uHeatP', 'uHeat', 'uKind', 'uHot', 'uLit', 'uFront', 'uAlpha']) U[n] = gl.getUniformLocation(prog, n);

  // ---------- loading ----------
  const texParams = () => {
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };
  const tex = async (url) => {
    const bmp = await createImageBitmap(await (await fetch(url)).blob(), { colorSpaceConversion: 'none' });
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE, bmp); texParams(); return t;
  };
  const vb = (data, loc, n, type) => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, n, type, type !== gl.FLOAT, 0, 0); };
  async function model(name) {
    const buf = await fetch(`${base}${name}.bin`).then((r) => r.arrayBuffer());
    const dv = new DataView(buf); const V = dv.getUint32(4, true), I = dv.getUint32(8, true), ib = dv.getUint32(12, true), flat = dv.getUint32(16, true) & 1;
    const col = [], nor = [], mr = [];
    if (!flat) for (const [k, arr] of [['color', col], ['normal', nor], ['mr', mr]]) { arr.push(await tex(`${base}${name}-${k}.webp`)); await pause(); }
    const f = new Float32Array(buf.slice(20, 44)); const lo = [...f.slice(0, 3)], hi = [...f.slice(3)];
    let o = 44;
    const P = new Int16Array(buf, o, V * 3); o += V * 6;
    const N = new Int8Array(buf, o, V * 4); o += V * 4;
    const T = flat ? new Uint8Array(buf, o, V * 4) : new Uint16Array(buf, o, V * 2); o += V * 4;
    const IX = ib === 2 ? new Uint16Array(buf, o, I) : new Uint32Array(buf, o, I);
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    vb(P, 0, 3, gl.SHORT); vb(N, 1, 4, gl.BYTE); if (flat) vb(T, 3, 4, gl.UNSIGNED_BYTE); else vb(T, 2, 2, gl.UNSIGNED_SHORT);
    const eb = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eb); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, IX, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, I, it: ib === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT, col: col[0], nor: nor[0], mr: mr[0], kind: flat ? 1 : 0,
      c: lo.map((v, i) => (v + hi[i]) / 2), h: lo.map((v, i) => (hi[i] - v) / 2), lo, hi };
  }
  // medallion: disc of radius 1 from y 0 to 1, top face + rim
  function disc(seg = 96) {
    const P = [], N = [], T = [], K = [], I = [];
    const add = (p, n, t, k) => { P.push(...p); N.push(...n); T.push(...t); K.push(k, 0, 0, 0); return P.length / 3 - 1; };
    const c = add([0, 1, 0], [0, 1, 0], [.5, .5], 1);
    const ring = [];
    for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
      ring.push(add([x, 1, z], [0, 1, 0], [.5 + x * .5, .5 + z * .5], 1)); }
    for (let i = 0; i < seg; i++) I.push(c, ring[i + 1], ring[i]);
    const b0 = P.length / 3;
    for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI * 2, x = Math.cos(a), z = Math.sin(a);
      add([x, 1, z], [x, 0, z], [0, 0], 0); add([x, 0, z], [x, 0, z], [0, 0], 0); }
    for (let i = 0; i < seg; i++) { const a = b0 + i * 2; I.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
    const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
    vb(new Float32Array(P), 0, 3, gl.FLOAT); vb(new Float32Array(N), 1, 3, gl.FLOAT); vb(new Float32Array(T), 2, 2, gl.FLOAT); vb(new Float32Array(K), 3, 4, gl.FLOAT);
    const eb = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eb); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(I), gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    return { vao, I: I.length, it: gl.UNSIGNED_SHORT, kind: 2, c: [0, 0, 0], h: [1, 1, 1] };
  }
  // emblem image -> texture: R = sharp shape, G = blurred shape (height for the bevel). Canvas compositing
  // only (no pixel loops). Built on demand: the current section's first, the others while the page is idle.
  const S = 512, pad = S * .06;
  function layer(img, color, blur) {
    const c = new OffscreenCanvas(S, S), x = c.getContext('2d');
    if (blur) x.filter = `blur(${blur}px)`;
    x.drawImage(img, pad, pad, S - pad * 2, S - pad * 2);
    x.filter = 'none'; x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, S, S);
    return c;
  }
  const embTex = [], embJob = [];
  function emblem(i) {
    return embJob[i] || (embJob[i] = (async () => {
      const img = new Image(); img.src = emblems[i]; await img.decode();
      const c = new OffscreenCanvas(S, S), x = c.getContext('2d');
      x.fillStyle = '#000'; x.fillRect(0, 0, S, S); x.globalCompositeOperation = 'lighter';
      x.drawImage(layer(img, '#f00', 0), 0, 0); x.drawImage(layer(img, '#0f0', 5), 0, 0);
      const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, c); texParams();
      embTex[i] = t;
      if (i === cur && ready) draw();
    })());
  }
  let ready = false, cur = 0;
  const anvil = await model('anvil'); await pause();
  const hammer = await model('hammer'); await pause();
  const coin = disc();

  // ---------- scene ----------
  const anvilM = M.mul(M.t(0, -anvil.lo[1], 0), M.ry(Math.PI / 2));        // horn toward world +X, feet on y = 0
  const FACE_Y = anvil.hi[1] - anvil.lo[1] - .012, PIECE_X = -.2, COIN_R = .13, COIN_H = .03;
  // The medallion. rise 0: lying on the anvil face. rise 1: lifted above the anvil, larger, turned to face the
  // viewer (the section's emblem while it is read). The emblem is upright in the texture; the Y turn keeps it
  // upright from the camera, the X tilt stands it up.
  const TILT = Math.acos(.62 / Math.hypot(-.28, .62, 1));
  // where the medallion stands at rest: set by the page (level with the title) through setRest()
  let restPos = [PIECE_X, FACE_Y + .44, .1], restScale = 1.5;
  const mix = (a, b, t) => a + (b - a) * t;
  const coinM = () => {
    const sc = mix(1, restScale, rise);
    return M.mul(M.t(mix(PIECE_X, restPos[0], rise), mix(FACE_Y + COIN_H / 2, restPos[1], rise), mix(0, restPos[2], rise)), M.mul(M.ry(-.27), M.mul(M.rx(TILT * rise),
      M.mul([COIN_R * sc,0,0,0, 0,COIN_H * sc,0,0, 0,0,COIN_R * sc,0, 0,0,0,1], M.t(0, -.5, 0)))));
  };
  const HS = .62, headX = -.4 * HS, endX = .5 * HS, headHalf = hammer.hi[1] * HS;
  const hammerLocal = M.mul(M.s(HS), M.ry(-Math.PI / 2));
  const RAISED = -0.6, YAW = 0.42;
  const L = endX - headX, oy = FACE_Y + COIN_H + headHalf + .002;        // at angle 0 the head rests on the medallion
  const pivot = [PIECE_X + L * Math.cos(YAW), oy, -L * Math.sin(YAW)];
  // at rest the hammer is lifted out of the frame (out = 1); it only comes in to strike
  const REST_LIT = .1, SINK = .42, REST_ALPHA = .28, REST_SCALE = .8;
  let angle = RAISED, out = 1, rise = 1, lit = REST_LIT, front = 1, heat = 0, hot = 0, view = { asp: 1, shiftX: 0, shiftY: 0, fit: 1 };
  const hammerM = () => M.mul(M.t(.35 * out, 1.1 * out, -.2 * out), M.mul(M.t(...pivot), M.mul(M.ry(YAW), M.mul(M.rz(angle - .5 * out), M.mul(M.t(-endX, 0, 0), hammerLocal)))));
  const target = [0, .55, 0], dir = (() => { const d = [-.28, .62, 1], l = Math.hypot(...d); return d.map((v) => v / l); })(), FY = .52;
  let eye = [0, 0, 0];
  function viewProj() {
    const t = Math.tan(FY / 2), dist = Math.max(3.3, .95 / (t * view.asp)) * view.fit;
    eye = target.map((v, i) => v + dir[i] * dist);
    const P = M.persp(FY, view.asp, .1, 30); P[8] = -view.shiftX; P[9] = -view.shiftY;
    return M.mul(P, M.look(eye, target, [0, 1, 0]));
  }
  function draw() {
    const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(U.uVP, false, viewProj()); gl.uniform3fv(U.uEye, eye);
    gl.uniform3fv(U.uHeatP, [PIECE_X, FACE_Y + .07, .1]); gl.uniform1f(U.uHeat, heat); gl.uniform1f(U.uHot, hot);
    gl.uniform1f(U.uLit, lit); gl.uniform1f(U.uFront, front);
    // at rest the anvil sinks a little and turns half transparent under the standing medallion;
    // the strike brings it back up, solid and lit (p follows the light)
    const p = (lit - REST_LIT) / (1 - REST_LIT);
    const parts = [[anvil, M.mul(M.t(.12 * (1 - p), -SINK * (1 - p), 0), M.mul(M.s(mix(REST_SCALE, 1, p)), anvilM)), mix(REST_ALPHA, 1, p)], [coin, coinM(), 1]];
    if (out < .999) parts.splice(1, 0, [hammer, hammerM(), 1]);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    for (const [m, mat, alpha] of parts) {
      gl.uniform1f(U.uAlpha, alpha);
      gl.uniformMatrix4fv(U.uM, false, mat); gl.uniform3fv(U.uC, m.c); gl.uniform3fv(U.uH, m.h); gl.uniform1f(U.uKind, m.kind);
      [[m.col, 'uCol'], [m.nor, 'uNor'], [m.mr, 'uMR'], [embTex[cur], 'uEmb']].forEach(([t, n], i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t || null); gl.uniform1i(U[n], i); });
      gl.bindVertexArray(m.vao); gl.drawElements(gl.TRIANGLES, m.I, m.it, 0);
    }
    if (sparks.length) drawSparks();
  }
  function burst() {
    // from the rim of the medallion, where the hammer face meets it: out and up, a few straight up
    sparks = [];
    for (let i = 0; i < SPARKS; i++) {
      const a = Math.random() * Math.PI * 2, sp = .7 + Math.random() * 1.9, up = .5 + Math.random() * 2.1;
      const r = COIN_R * (.75 + Math.random() * .3);
      sparks.push({ p: [PIECE_X + Math.cos(a) * r, FACE_Y + COIN_H + .01, Math.sin(a) * r],
        v: [Math.cos(a) * sp, up, Math.sin(a) * sp], age: 0, life: .35 + Math.random() * .6, size: .022 + Math.random() * .026, h: [] });
    }
  }
  function stepSparks(dt) {
    for (const k of sparks) {
      k.h.unshift(k.p.slice()); if (k.h.length > TRAIL - 1) k.h.length = TRAIL - 1;
      k.v[1] -= 6.5 * dt; k.v[0] *= 1 - dt * 1.2; k.v[2] *= 1 - dt * 1.2;
      for (let j = 0; j < 3; j++) k.p[j] += k.v[j] * dt;
      if (k.p[1] < FACE_Y - .02 && Math.abs(k.p[0] - PIECE_X) < .35 && Math.abs(k.p[2]) < .16) { k.p[1] = FACE_Y - .02; k.v[1] *= -.3; }  // bounce off the anvil face
      k.age += dt;
    }
    sparks = sparks.filter((k) => k.age < k.life);
  }
  function drawSparks() {
    let n = 0;
    for (const k of sparks) {
      const t = k.age / k.life, fade = (1 - t) ** 1.5;
      // white-hot, then orange, then dull red
      const col = t < .35 ? [2.2, 1.7, 1.] : t < .7 ? [1.9, .8, .18] : [1.2, .32, .07];
      [k.p, ...k.h].forEach((q, j) => {
        const f = fade * (1 - j / TRAIL);
        sdata.set([q[0], q[1], q[2], col[0] * f, col[1] * f, col[2] * f, k.size * (1 - j * .25)], n * 7); n++;
      });
    }
    gl.useProgram(sprog);
    gl.uniformMatrix4fv(SU.vp, false, viewProj()); gl.uniform1f(SU.px, canvas.height * 1.6);
    gl.blendFunc(gl.ONE, gl.ONE); gl.depthMask(false);
    gl.bindVertexArray(svao); gl.bindBuffer(gl.ARRAY_BUFFER, sbuf); gl.bufferSubData(gl.ARRAY_BUFFER, 0, sdata, 0, n * 7);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.depthMask(true); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }
  function project(p) {
    const v = M.apply(viewProj(), p);
    return { x: (v[0] / v[3] * .5 + .5) * canvas.clientWidth, y: (1 - (v[1] / v[3] * .5 + .5)) * canvas.clientHeight };
  }
  function points() {
    const hit = project([PIECE_X, FACE_Y + COIN_H, 0]), up = project(restPos), g = project([0, 0, 0]), l = project([anvil.lo[2], 0, 0]), r = project([anvil.hi[2], 0, 0]);
    return { x: hit.x, y: hit.y, ux: up.x, uy: up.y, ground: g.y, groundL: l.x, groundR: r.x };
  }

  // ---------- one strike ----------
  // 0-.30  the old medallion comes down onto the anvil, the hammer comes in raised, the anvil lights up
  // .30-.40 one swing down; IMPACT: the new emblem, heat, the page swaps (onImpact)
  // .44-.85 the hammer goes back up and out; .55-1 the new medallion rises and stands up; the anvil goes dark
  const ease = { in: (t) => t * t * t, out: (t) => 1 - (1 - t) ** 3, io: (t) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2 };
  const seg = (t, a, b, e = 'io') => ease[e](Math.min(1, Math.max(0, (t - a) / (b - a))));
  const IMPACT = .4, DUR = 1500;
  let anim = 0;
  function strike(next, onImpact, dur = DUR) {
    cancelAnimationFrame(anim); emblem(next);
    const t0 = performance.now(), rise0 = rise, lit0 = lit; let hitDone = false, last = t0;
    const step = (now) => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      if (sparks.length) stepSparks(dt);
      const t = Math.min(1, (now - t0) / dur);
      out = t < .5 ? 1 - seg(t, 0, .26, 'out') : seg(t, .5, .85, 'in');
      angle = t < .3 ? RAISED - .12 * seg(t, .18, .3, 'out')
        : t < IMPACT ? mix(RAISED - .12, 0, seg(t, .3, IMPACT, 'in'))
        : t < .44 ? 0 : mix(0, RAISED, seg(t, .44, .7, 'out'));
      rise = t < IMPACT ? rise0 * (1 - seg(t, 0, .3)) : seg(t, .55, 1);
      front = rise;
      lit = t < IMPACT ? mix(lit0, 1, seg(t, 0, .3)) : mix(1, REST_LIT, seg(t, .5, 1));
      if (!hitDone && t >= IMPACT) { hitDone = true; cur = next; burst(); onImpact && onImpact(); }
      const since = (now - t0) / 1000 - dur * IMPACT / 1000;
      if (since > 0) { heat = Math.max(0, 1 - since / 1.6) ** 2; hot = Math.max(0, 1 - since / 2.6); }
      draw();
      if (t < 1 || heat > 0 || hot > 0 || sparks.length) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  }
  function show(i) { cur = i; emblem(i); out = 1; rise = 1; front = 1; lit = REST_LIT; draw(); }
  // the other emblems, one per idle moment
  (async () => { for (let i = 0; i < emblems.length; i++) { await pause(); await emblem(i); } performance.mark('forge:emblems'); })();
  ready = true; performance.mark('forge:ready');
  // Put the standing medallion's centre under screen point (x, y) in CSS px, size px across, on the plane z = .1
  function setRest(x, y, size) {
    const inv = M.inv(viewProj()), w = canvas.clientWidth, h = canvas.clientHeight;
    const at = (px, py) => {
      const nx = px / w * 2 - 1, ny = 1 - py / h * 2;
      const a = M.apply(inv, [nx, ny, -1]), b = M.apply(inv, [nx, ny, 1]);
      const p0 = a.slice(0, 3).map((v) => v / a[3]), p1 = b.slice(0, 3).map((v) => v / b[3]);
      const k = (.1 - p0[2]) / (p1[2] - p0[2]);
      return p0.map((v, i) => v + (p1[i] - v) * k);
    };
    const c = at(x, y), e = at(x + 1, y);
    restPos = c; restScale = (size / 2) * Math.hypot(e[0] - c[0], e[1] - c[1], e[2] - c[2]) / COIN_R;
    draw();
  }
  function layout(opts) { Object.assign(view, opts, { asp: canvas.clientWidth / canvas.clientHeight }); draw(); return points(); }
  // for screenshots: the moment of impact (hammer down, medallion flat, anvil lit)
  function pose(a, h) { angle = a ?? 0; out = 0; rise = 0; front = 0; lit = 1; heat = h ?? 0; hot = h ?? 0; draw(); }
  return { layout, setRest, strike, show, pose, points, IMPACT, duration: DUR };
}

/* ------------------------------------------------------------------ */
/* The page                                                           */
/* ------------------------------------------------------------------ */
const root = document.querySelector('[data-forge]');
if (root) {
  const $$ = (s, r = root) => [...r.querySelectorAll(s)];
  const pin = root.querySelector('.forge__pin'), canvas = root.querySelector('.forge__gl');
  const slides = $$('.forge__slide'), bgs = $$('.forge__bg'), marks = $$('.forge__rail a');
  const N = slides.length;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAF = window.TAF || {};                     // scramble + countUp, shared with the rest of the site (site.js)
  root.style.setProperty('--n', N);
  root.classList.add('is-live');                    // the scroll track exists only with this script

  // ---- text effects ----
  function typewrite(el, delay) {
    // the whole sentence is laid out from the start (rest transparent), so nothing moves while it types
    if (calm || el.dataset.tw === undefined && el.children.length) return;
    const full = el.dataset.tw ?? el.textContent;
    el.dataset.tw = full;
    el.innerHTML = '<span class="tw-done"></span><span class="tw-caret" aria-hidden="true"></span><span class="tw-rest"></span>';
    const [done, caret, rest] = el.children; rest.textContent = full;
    const per = Math.min(9, 1600 / full.length);
    clearTimeout(el._tw);
    el._tw = setTimeout(() => {
      const start = performance.now();
      (function frame(t) {
        const n = Math.min(full.length, Math.floor((t - start) / per));
        done.textContent = full.slice(0, n); rest.textContent = full.slice(n);
        if (n < full.length) requestAnimationFrame(frame); else caret.classList.add('is-done');
      })(start);
    }, delay);
  }
  function reveal(slide, delay = 0) {
    if (calm) return;
    $$('[data-scramble]', slide).forEach((t) => TAF.scramble && TAF.scramble(t, delay));
    // the line under the title: each language block types on its own (the hidden one costs nothing)
    $$('.forge__desc', slide).forEach((p) => { const parts = $$(':scope > [lang]', p); (parts.length ? parts : [p]).forEach((x) => typewrite(x, delay + 150)); });
    $$('[data-count]', slide).forEach((n) => setTimeout(() => TAF.countUp && TAF.countUp(n), delay + 100));
  }

  // ---- the next background opens as a honeycomb from the point of impact ----
  // The picture is clipped to a union of hexagons (one CSS path, rebuilt each frame): a circle covers the
  // cells well behind the front, and only the band of cells at the front is listed one by one, each growing
  // from its centre. The tiles at the front glow brass and orange on a canvas above the dimming layer,
  // then cool as the front moves on. Runs only during a reveal (about 1.1 s).
  const heat = root.querySelector('.forge__heat'), hctx = heat && heat.getContext('2d');
  const HEX_DUR = 1150, S3 = Math.sqrt(3);
  let hexRun = 0;
  function hexReveal(im, done) {
    const run = ++hexRun;
    const W = pin.clientWidth, H = pin.clientHeight;
    const cx = parseFloat(pin.style.getPropertyValue('--hx')) || W * .7, cy = parseFloat(pin.style.getPropertyValue('--hy')) || H * .45;
    const R = Math.max(22, Math.min(46, Math.min(W, H) / 22));       // tile radius (centre to corner)
    const JIT = R * 1.6, GROW = R * 1.4, GLOW = R * 5;               // front raggedness, tile growth, glow tail
    // pointy-top lattice with a tile centred on the impact
    const cells = [];
    const rows = Math.ceil(Math.max(cy, H - cy) / (1.5 * R)) + 1, cols = Math.ceil(Math.max(cx, W - cx) / (S3 * R)) + 2;
    for (let r = -rows; r <= rows; r++) for (let q = -cols - rows; q <= cols + rows; q++) {
      const x = cx + S3 * R * (q + r / 2), y = cy + 1.5 * R * r;
      if (x < -R || x > W + R || y < -R || y > H + R) continue;
      const h = Math.sin(q * 127.1 + r * 311.7) * 43758.5453;      // steady per-tile jitter
      const rd = Math.hypot(x - cx, y - cy);
      cells.push({ x, y, rd, d: rd + (h - Math.floor(h)) * JIT });
    }
    cells.sort((a, b) => a.d - b.d);
    const done1 = new Map();                                        // outlines of fully grown tiles, built once
    const far = cells[cells.length - 1].d + GROW + 2;
    const dpr = Math.min(2, devicePixelRatio || 1);
    if (hctx) { heat.width = Math.round(W * dpr); heat.height = Math.round(H * dpr); hctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    const gold = (getComputedStyle(root).getPropertyValue('--gold-rgb') || '214, 162, 78').trim();
    const corner = (x, y, s) => { let p = ''; for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; p += (k ? 'L' : 'M') + (x + s * Math.cos(a)).toFixed(1) + ' ' + (y + s * Math.sin(a)).toFixed(1); } return p + 'Z'; };
    const hexPath = (c, x, y, s) => { for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3; c[k ? 'lineTo' : 'moveTo'](x + s * Math.cos(a), y + s * Math.sin(a)); } c.closePath(); };
    const t0 = performance.now();
    (function frame(t) {
      if (run !== hexRun) return;
      const k = Math.min(1, (t - t0) / HEX_DUR), e = 1 - Math.pow(1 - k, 2.4);
      const front = e * far;
      // cells fully grown behind (front - GROW) are covered by one circle, minus a margin for the jitter
      const inner = Math.max(0, front - GROW - JIT - R * 2);
      let path = inner > 0 ? `M${(cx - inner).toFixed(1)} ${cy.toFixed(1)}a${inner} ${inner} 0 1 1 ${2 * inner} 0a${inner} ${inner} 0 1 1 ${-2 * inner} 0Z` : '';
      if (hctx) { hctx.clearRect(0, 0, W, H); hctx.globalCompositeOperation = 'lighter'; }
      for (const c of cells) {
        if (c.d > front) break;
        const g = Math.min(1, (front - c.d) / GROW);                  // 0 -> 1 as the front passes the tile
        let o = g < 1 ? null : done1.get(c);
        if (g === 1 && !o) done1.set(c, o = { s: corner(c.x, c.y, R + .6), p: hctx && new Path2D(corner(c.x, c.y, R - 1)) });
        if (g < 1 || c.rd + R > inner) path += o ? o.s : corner(c.x, c.y, R * (.15 + .85 * g) + .6);
        const age = (front - c.d) / GLOW;                              // glow: hot at the front, cools behind
        if (hctx && age < 1) {
          const a = Math.pow(1 - age, 1.6) * (1 - k * .5);
          let hp = o && o.p;
          if (!hp) { hp = new Path2D(); hexPath(hp, c.x, c.y, R * (.15 + .85 * g) - 1); }
          hctx.fillStyle = `rgba(233, 134, 46, ${(a * .16).toFixed(3)})`; hctx.fill(hp);
          hctx.lineWidth = 5; hctx.strokeStyle = `rgba(184, 68, 26, ${(a * .35).toFixed(3)})`; hctx.stroke(hp);
          hctx.lineWidth = 1.4; hctx.strokeStyle = age < .35 ? `rgba(246, 207, 122, ${a.toFixed(3)})` : `rgba(${gold}, ${(a * .8).toFixed(3)})`; hctx.stroke(hp);
        }
      }
      im.style.clipPath = path ? `path('${path}')` : 'inset(50%)';
      if (k < 1) requestAnimationFrame(frame);
      else { im.style.clipPath = ''; if (hctx) hctx.clearRect(0, 0, W, H); done(); }
    })(t0);
  }

  // ---- sections ----
  let shown = 0;
  function showSlide(i, stamp) {
    slides.forEach((s, k) => { const on = k === i; s.classList.toggle('is-on', on); s.inert = !on; s.classList.remove('is-stamp'); });
    if (stamp) { void slides[i].offsetWidth; slides[i].classList.add('is-stamp'); }
    marks.forEach((m, k) => m.toggleAttribute('aria-current', k === i));
  }
  function background(i, from) {
    const prev = bgs[shown]; shown = i;
    bgs.forEach((im) => im.classList.remove('is-reveal'));
    const im = bgs[i]; im.loading = 'eager';
    if (from == null || calm) { bgs.forEach((x, k) => x.classList.toggle('is-on', k === i)); return; }
    im.style.clipPath = 'inset(50%)'; im.classList.add('is-reveal'); prev.classList.add('is-on');
    hexReveal(im, () => {
      if (shown !== i) return;
      bgs.forEach((x, k) => x.classList.toggle('is-on', k === i)); im.classList.remove('is-reveal');
    });
  }

  let forge = null, cur = 0, want = 0, busy = false, onSlide = () => {};
  function strike(i) {
    const from = cur; cur = i;
    if (!forge || calm) {
      if (forge) forge.show(i);
      showSlide(i, false); background(i, null); reveal(slides[i]); setMark(i);
      return;
    }
    busy = true; pin.classList.add('is-out');
    forge.strike(i, () => {
      pin.classList.remove('is-out', 'is-hit'); void pin.offsetWidth; pin.classList.add('is-hit');
      showSlide(i, true); background(i, from); reveal(slides[i]); setMark(i); onSlide();
    });
    setTimeout(() => { busy = false; if (want !== cur) strike(want); }, forge.duration * .8);
  }
  function setTarget(i) {
    if (i === want) return;
    want = i; marks.forEach((m, k) => m.toggleAttribute('aria-current', k === i));
    if (!busy && want !== cur) strike(want);
  }
  const top = () => root.getBoundingClientRect().top + scrollY;
  // jump straight to a section: the target is set first, so the scroll in between strikes nothing else
  function go(i) { setTarget(i); scrollTo({ top: top() + i * innerHeight + 2, behavior: 'instant' }); }

  // without the 3D scene (no WebGL, or before it has loaded) the list's emblem stands in for it
  const mark = root.querySelector('.forge__mark');
  function setMark(i) { if (mark) mark.src = marks[i].dataset.emblem; }

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      root.classList.toggle('is-scrolled', scrollY > 40);
      setTarget(Math.min(N - 1, Math.max(0, Math.floor((scrollY - top()) / innerHeight + .35))));
    });
  }, { passive: true });
  marks.forEach((m, i) => m.addEventListener('click', (e) => { e.preventDefault(); go(i); }));
  document.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (document.querySelector('dialog[open], .nav__drawer.is-open')) return;
    if (document.activeElement && /input|textarea|select/i.test(document.activeElement.tagName)) return;
    const d = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!d || scrollY > top() + (N - 1) * innerHeight + 4) return;
    e.preventDefault(); go(Math.min(N - 1, Math.max(0, want + d)));
  });

  // first screen: the page may open scrolled (back button)
  cur = want = Math.min(N - 1, Math.max(0, Math.round((scrollY - top()) / innerHeight)));
  showSlide(cur, false); background(cur, null); setMark(cur); reveal(slides[cur], 300);

  // ---- 3D: loaded once the page has painted, so it never competes with the first picture ----
  const start = async () => {
    try {
      forge = await createForge(canvas, new URL('./', import.meta.url).href, marks.map((m) => m.dataset.emblem));
    } catch (err) { root.classList.add('is-flat'); return; }
    // the standing medallion takes the place and size of the stand-in emblem (.forge__mark, positioned by the
    // CSS for desktop and phones), so the swap from the stand-in to the 3D scene does not move it either
    let hit = null;
    const rest = () => {
      if (!hit || !mark) return;
      const r = mark.getBoundingClientRect(), p = pin.getBoundingClientRect();   // the mark is hidden, still laid out
      forge.setRest(r.left - p.left + r.width / 2, r.top - p.top + r.height / 2, r.width);
    };
    onSlide = rest;
    const place = () => {
      const narrow = innerWidth <= 860 || innerWidth <= innerHeight;
      // desktop: copy on the left, anvil on the right; phone: anvil centred in the upper half
      const b = forge.layout(narrow ? { shiftX: 0, shiftY: .3, fit: .8 } : { shiftX: .46, shiftY: -.02, fit: 1.05 });
      for (const [k, v] of Object.entries({ hx: b.x, hy: b.y, gl: b.groundL, gr: b.groundR, gy: b.ground })) pin.style.setProperty('--' + k, v + 'px');
      pin.style.setProperty('--fx', b.x / innerWidth * 100 + '%');
      hit = b; rest();
    };
    forge.show(cur); place(); addEventListener('resize', place);
    root.classList.add('is-3d');
  };
  if (!window.WebGL2RenderingContext) root.classList.add('is-flat');
  else if (document.readyState === 'complete') (window.requestIdleCallback || setTimeout)(start);
  else addEventListener('load', () => (window.requestIdleCallback || setTimeout)(start), { once: true });
}
