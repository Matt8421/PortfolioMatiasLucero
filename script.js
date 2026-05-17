/**
 * LÓGICA DE NAVEGACIÓN, FORMULARIO Y EFECTOS VISUALES
 * Matias Lucero - Fullstack Portfolio
 */
 
// =========================================
//   NAVEGACIÓN RESPONSIVE
// =========================================
let menuVisible = false;
 
function mostrarOcultarMenu() {
    const nav = document.getElementById("nav");
    if (menuVisible) {
        nav.classList = "";
        menuVisible = false;
    } else {
        nav.classList = "responsive";
        menuVisible = true;
    }
}
 
function seleccionar() {
    document.getElementById("nav").classList = "";
    menuVisible = false;
}
 
// =========================================
//   CURSOR PERSONALIZADO CON PARTÍCULAS
// =========================================
(function initCursor() {
    // No activar en móviles
    if (window.matchMedia("(pointer: coarse)").matches) return;
 
    const cursor      = document.createElement("div");
    const cursorDot   = document.createElement("div");
    cursor.className    = "cursor-ring";
    cursorDot.className = "cursor-dot";
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
 
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
 
    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        spawnParticle(mouseX, mouseY);
    });
 
    // Anillo con lag (efecto "elástico")
    function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursor.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(animateRing);
    }
    animateRing();
 
    // Hover sobre links y botones: expandir anillo
    document.querySelectorAll("a, button, .badge, .proyecto, .interes").forEach(el => {
        el.addEventListener("mouseenter", () => cursor.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-hover"));
    });
 
    // Partículas de destello
    const particlePool = [];
 
    function spawnParticle(x, y) {
        if (Math.random() > 0.35) return; // densidad de partículas
 
        let p = particlePool.find(p => !p.active);
        if (!p) {
            const el = document.createElement("div");
            el.className = "cursor-particle";
            document.body.appendChild(el);
            p = { el, active: false };
            particlePool.push(p);
        }
 
        const size   = Math.random() * 6 + 3;
        const angle  = Math.random() * Math.PI * 2;
        const speed  = Math.random() * 60 + 20;
        const dx     = Math.cos(angle) * speed;
        const dy     = Math.sin(angle) * speed;
        const dur    = Math.random() * 500 + 400;
 
        p.active = true;
        p.el.style.cssText = `
            left: ${x}px; top: ${y}px;
            width: ${size}px; height: ${size}px;
            opacity: 1;
            transform: translate(-50%, -50%) translate(0px, 0px);
            transition: none;
        `;
 
        requestAnimationFrame(() => {
            p.el.style.transition = `transform ${dur}ms ease-out, opacity ${dur}ms ease-out`;
            p.el.style.transform  = `translate(-50%, -50%) translate(${dx}px, ${dy}px)`;
            p.el.style.opacity    = "0";
        });
 
        setTimeout(() => { p.active = false; }, dur);
    }
})();
 
 
// =========================================
//   FONDO ANIMADO CON CANVAS
// =========================================
(function initBackground() {
    const canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
 
    let W, H;
    const COLOR = "28, 182, 152";
 
    // ── NODOS ──────────────────────────────
    const NODE_COUNT   = 70;
    const CONNECT_DIST = 140;
    let nodes  = [];
    let mouseX = 0, mouseY = 0;
 
    function createNodes() {
        nodes = [];
        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x:  Math.random() * W,
                y:  Math.random() * H,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r:  Math.random() * 2 + 1,
                pulseTimer: Math.random() * 300,
            });
        }
    }
 
    // ── ESTRELLAS ──────────────────────────
    const STAR_COUNT = 120;
    let stars = [];
 
    function createStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x:       Math.random() * W,
                y:       Math.random() * H,
                r:       Math.random() * 1.2 + 0.3,
                alpha:   Math.random(),
                dAlpha:  (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
            });
        }
    }
 
    // ── PULSOS (ondas que emiten los nodos) ─
    let pulses = [];
 
    // ── METEOROS ───────────────────────────
    let meteors = [];
 
    function spawnMeteor() {
        const startX = Math.random() * W * 1.5;
        meteors.push({
            x:     startX,
            y:     -20,
            len:   Math.random() * 120 + 60,   // largo de la estela
            speed: Math.random() * 6 + 5,       // velocidad
            angle: Math.PI / 5,                 // ~36° diagonal
            alpha: Math.random() * 0.6 + 0.4,
            width: Math.random() * 1.5 + 0.5,
            life:  1,                           // 1 = plena vida, baja hasta 0
        });
    }
 
    // ── RESIZE ─────────────────────────────
    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
 
    // ── DRAW LOOP ──────────────────────────
    function draw() {
        ctx.clearRect(0, 0, W, H);
 
        // — Estrellas parpadeantes —
        stars.forEach(s => {
            s.alpha += s.dAlpha;
            if (s.alpha >= 1)   { s.alpha = 1;   s.dAlpha *= -1; }
            if (s.alpha <= 0.1) { s.alpha = 0.1; s.dAlpha *= -1; }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR}, ${s.alpha * 0.6})`;
            ctx.fill();
        });
 
        // — Nodos: mover y dibujar —
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > W) n.vx *= -1;
            if (n.y < 0 || n.y > H) n.vy *= -1;
 
            // Disparo de pulso aleatorio
            n.pulseTimer--;
            if (n.pulseTimer <= 0) {
                pulses.push({ x: n.x, y: n.y, r: n.r + 2, maxR: 40, alpha: 0.7 });
                n.pulseTimer = Math.random() * 400 + 200;
            }
 
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${COLOR}, 0.5)`;
            ctx.fill();
        });
 
        // — Conexiones entre nodos —
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx   = nodes[i].x - nodes[j].x;
                const dy   = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
                    ctx.lineWidth   = 0.8;
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
 
        // — Conexión mouse → nodos cercanos —
        const scrollY = window.scrollY;
        nodes.forEach(n => {
            const dx   = n.x - mouseX;
            const dy   = n.y - (mouseY + scrollY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST * 1.5) {
                const alpha = (1 - dist / (CONNECT_DIST * 1.5)) * 0.35;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
                ctx.lineWidth   = 1;
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(mouseX, mouseY + scrollY);
                ctx.stroke();
            }
        });
 
        // — Pulsos expansivos —
        pulses = pulses.filter(p => p.alpha > 0.01);
        pulses.forEach(p => {
            p.r     += 0.8;
            p.alpha *= 0.94;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${COLOR}, ${p.alpha})`;
            ctx.lineWidth   = 1;
            ctx.stroke();
        });
 
        // — Meteoros —
        meteors = meteors.filter(m => m.life > 0.01 && m.y < H + 50);
        meteors.forEach(m => {
            m.x    += Math.cos(m.angle) * m.speed;
            m.y    += Math.sin(m.angle) * m.speed;
            m.life -= 0.012;
 
            const tailX = m.x - Math.cos(m.angle) * m.len;
            const tailY = m.y - Math.sin(m.angle) * m.len;
 
            const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, `rgba(${COLOR}, 0)`);
            grad.addColorStop(0.6, `rgba(${COLOR}, ${m.alpha * m.life * 0.4})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${m.alpha * m.life})`);
 
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = grad;
            ctx.lineWidth   = m.width;
            ctx.lineCap     = "round";
            ctx.stroke();
 
            // destello en la punta
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.width * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha * m.life * 0.9})`;
            ctx.fill();
        });
 
        requestAnimationFrame(draw);
    }
 
    // — Spawn de meteoros: cada 2-5 segundos —
    function scheduleMeteor() {
        spawnMeteor();
        setTimeout(scheduleMeteor, Math.random() * 3000 + 2000);
    }
 
    // — Eventos —
    document.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
 
    window.addEventListener("resize", () => { resize(); createNodes(); createStars(); });
 
    resize();
    createNodes();
    createStars();
    scheduleMeteor();
    draw();
})();
// =========================================
//   HEADER: TRANSPARENTE → SÓLIDO
// =========================================
window.addEventListener("scroll", function () {
    const header = document.querySelector(".contenedor-header");
    if (window.scrollY > 50) {
        header.classList.add("on-scroll");
    } else {
        header.classList.remove("on-scroll");
    }
});
 
 
// =========================================
//   ANIMACIÓN DE ENTRADA AL SCROLLEAR
// =========================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.1 });
 
document.querySelectorAll(".contenido-seccion").forEach(sec => observer.observe(sec));
 
 
// =========================================
//   FORMULARIO DE CONTACTO
// =========================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contacto");
    if (!form) return;
 
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
 
        const nombre  = form.querySelector('input[name="nombre"]').value.trim();
        const mensaje = form.querySelector('textarea[name="mensaje"]').value.trim();
        const btn     = document.getElementById("btn-enviar");
 
        const nombreRegex = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;
        if (!nombreRegex.test(nombre)) {
            alert("Por favor, poné un nombre válido (solo letras, mín. 3).");
            return;
        }
        if (mensaje.length < 10) {
            alert("El mensaje es muy corto, contame un poco más.");
            return;
        }
 
        btn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';
        btn.disabled  = true;
 
        try {
            const response = await fetch(form.action, {
                method:  "POST",
                body:    new FormData(form),
                headers: { Accept: "application/json" },
            });
            if (response.ok) {
                alert("¡Perfecto! El mensaje fue enviado a mi correo.");
                form.reset();
            } else {
                alert("Uy, algo falló. Probá de nuevo.");
            }
        } catch {
            alert("Parece que hay un problema de conexión.");
        } finally {
            btn.innerHTML = 'Enviar Mensaje <i class="fa-solid fa-paper-plane"></i>';
            btn.disabled  = false;
        }
    });
});