const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Fixed endpoints (P0, P3)
    P0 = { x: 100, y: canvas.height / 2 };
    P3 = { x: canvas.width - 100, y: canvas.height / 2 };
}

//Control points
let P0, P3; 
let P1 = { x: 300, y: window.innerHeight / 2 };
let P2 = { x: window.innerWidth - 300, y: window.innerHeight / 2 };

resize();
window.addEventListener("resize", resize);

//PHYSICS 
let v1 = { x: 0, y: 0 };
let v2 = { x: 0, y: 0 };

const k = 0.02;
const damping = 0.85; 

 
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

canvas.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

//BÉZIER MATH 
function bezier(t, P0, P1, P2, P3) {
    const u = 1 - t;
    return {
        x: u*u*u*P0.x + 3*u*u*t*P1.x + 3*u*t*t*P2.x + t*t*t*P3.x,
        y: u*u*u*P0.y + 3*u*u*t*P1.y + 3*u*t*t*P2.y + t*t*t*P3.y
    };
}

function tangent(t, P0, P1, P2, P3) {
    const u = 1 - t;
    return {
        x: 3*u*u*(P1.x - P0.x) +
           6*u*t*(P2.x - P1.x) +
           3*t*t*(P3.x - P2.x),
        y: 3*u*u*(P1.y - P0.y) +
           6*u*t*(P2.y - P1.y) +
           3*t*t*(P3.y - P2.y)
    };
}

//ANIMATION LOOP 
function update() {
    let targetP1x = mouse.x - 100;
    let targetP2x = mouse.x + 100;

    //Spring physics for P1
    let ax1 = -k * (P1.x - targetP1x) - damping * v1.x;
    let ay1 = -k * (P1.y - mouse.y) - damping * v1.y;

    //Spring physics for P2
    let ax2 = -k * (P2.x - targetP2x) - damping * v2.x;
    let ay2 = -k * (P2.y - mouse.y) - damping * v2.y;

    v1.x += ax1;
    v1.y += ay1;
    P1.x += v1.x;
    P1.y += v1.y;

    v2.x += ax2;
    v2.y += ay2;
    P2.x += v2.x;
    P2.y += v2.y;

    draw();
    requestAnimationFrame(update);
}

// RENDERING 
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //Bezier curve
    ctx.beginPath();
    for (let t = 0; t <= 1; t += 0.01) {
        const p = bezier(t, P0, P1, P2, P3);
        if (t === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.stroke();

    //tangents
    ctx.lineWidth = 1;
    for (let t = 0; t <= 1; t += 0.1) {
        const p = bezier(t, P0, P1, P2, P3);
        const tan = tangent(t, P0, P1, P2, P3);
        const len = Math.hypot(tan.x, tan.y);

        if (len > 0.001) {
            tan.x /= len;
            tan.y /= len;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + tan.x * 30, p.y + tan.y * 30);
            ctx.strokeStyle = "rgba(255,255,0,0.5)";
            ctx.stroke();
        }
    }

    //Dynamic control points (P1, P2)
    [P1, P2].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    });

    //Fixed control points (P0, P3)
    [P0, P3].forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#00ff00";
        ctx.fill();
    });
}


update();
