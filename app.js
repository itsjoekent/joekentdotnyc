import './style.scss';

const canvas = document.getElementById('chaos');
const ctx = canvas.getContext('2d');

function sizeCanvas() {
  const { innerWidth, innerHeight } = window;
  const { availWidth, availHeight } = screen;

  canvas.width = screen.availWidth;
  canvas.height = screen.availHeight;
}
sizeCanvas();

window.onresize = sizeCanvas;

const rho = 28;
const sigma = 10;
const beta = 8 / 3;
const delta = 0.02;

class Vector {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(vec) {
    return new Vector(
      this.x + vec.x,
      this.y + vec.y,
      this.z + vec.z,
    );
  }

  scale(scalar) {
    return new Vector(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar,
    );
  }

  copy() {
    return new Vector(this.x, this.y, this.z);
  }

  rk4(step, func) {
    const base = this.copy();

    const k1 = func(base).scale(step);
    const k2 = func(base.add(k1.scale(0.5))).scale(step);
    const k3 = func(base.add(k2.scale(0.5))).scale(step);
    const k4 = func(base.add(k3)).scale(step);

    return base.add((k1.add(k2.scale(2)).add(k3.scale(2)).add(k4)).scale(1 / 6));
  }
}

class Particle {
  constructor(pos) {
    this.pos = pos;

    this.opacity = 0.7;
  }

  render() {
    ctx.fillStyle = "#111";
    ctx.globalAlpha = this.opacity;

    const tpos = this.pos.copy().scale(20);
    const tx = tpos.x + (canvas.width / 2) + (Particle.radius() / 2);
    const ty = tpos.y + (canvas.height / 2) + (Particle.radius() / 2);

    ctx.beginPath();
    ctx.arc(tx, ty, Math.max(Particle.radius() + (this.pos.z / 100), 0), 0, 2 * Math.PI, false);
    ctx.fill();

    this.opacity -= Particle.decomposeRate;
  }
}

Particle.radius = () => canvas.width * 0.001;
Particle.decomposeRate = 0.0005;

let particles = [new Particle(new Vector(1, 1, 1))];
let time = 1;

function cleanParticleList() {
  return particles.filter(p => p.opacity > 0);
}

function lorenz(vec) {
  const x = sigma * (vec.y - vec.x);
  const y = vec.x * (rho - vec.z) - vec.y;
  const z = vec.x * vec.y - beta * vec.z;

  return new Vector(x, y, z);
}

function generateParticle() {
  const prev = particles[0];
  const vec = prev.pos.rk4(delta, lorenz);
  time += delta;

  particles.unshift(new Particle(vec));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  generateParticle();
  particles.forEach(p => p.render());
  particles = cleanParticleList();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
