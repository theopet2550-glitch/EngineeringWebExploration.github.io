// Use the existing element in the DOM if present (from index.html)
let arrow = document.getElementById('arrow');

// If the element does not exist, create a fallback so the script still works.
if (!arrow) {
    arrow = document.createElement('div');
    arrow.id = 'arrow';
    arrow.className = 'arrow';
    document.body.appendChild(arrow);
}

// Ensure positioning and smooth rotation
arrow.style.position = arrow.style.position || 'absolute';
arrow.style.top = arrow.style.top || '50%';
arrow.style.left = arrow.style.left || '50%';
// match the CSS transform-origin Y so the pivot point aligns with center
const originYPercent = 97;
arrow.style.transform = `translate(-50%, -${originYPercent}%) rotate(0deg)`;
arrow.style.transformOrigin = `50% ${originYPercent}%`;
// Remove CSS transition so JS-driven interpolation is smooth and deterministic
arrow.style.transition = 'none';
arrow.style.pointerEvents = 'none'; // allow mouse events to pass through

// Internal angle state (degrees). Initialize from computed style if possible.
let currentDeg = 0;
const st = window.getComputedStyle(arrow);
const tr = st.transform || st.webkitTransform || st.mozTransform;
if (tr && tr !== 'none') {
    const m = tr.match(/matrix\(([^)]+)\)/);
    if (m) {
        const parts = m[1].split(',').map(s => parseFloat(s.trim()));
        const a = parts[0];
        const b = parts[1];
        currentDeg = Math.atan2(b, a) * (180 / Math.PI);
    }
}
let targetDeg = currentDeg;

function shortestAngleDiff(from, to) {
    let diff = ((to - from + 540) % 360) - 180;
    if (diff === -180) diff = 180;
    return diff;
}

// Make the arrow responsive: increase this for faster tracking (0..1],
// where 1 jumps immediately to target, smaller values smooth the motion.
const responsiveness = 0.5; // 0.5 is quick but still smooth; increase towards 1.0 for more reactive

document.addEventListener('mousemove', (event) => {
    const rect = arrow.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleRad = Math.atan2(event.clientY - centerY, event.clientX - centerX);
    targetDeg = angleRad * (180 / Math.PI) + 90; // arrow points up by default
});

// Animation loop: interpolate currentDeg toward targetDeg via shortest path
let rafId = null;
function animate() {
    const diff = shortestAngleDiff(currentDeg, targetDeg);
    // If the difference is tiny, snap to avoid jitter
    if (Math.abs(diff) < 0.1) {
        currentDeg = targetDeg;
    } else {
        currentDeg += diff * responsiveness;
    }
    arrow.style.transform = `translate(-50%, -${originYPercent}%) rotate(${currentDeg}deg)`;
    rafId = requestAnimationFrame(animate);
}
// Start the loop
if (!rafId) animate();