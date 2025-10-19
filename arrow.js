const arrow = document.createElement('div');
arrow.style.width = '100px';
arrow.style.height = '100px';
arrow.style.position = 'absolute';
arrow.style.top = '50%';
arrow.style.left = '50%';
arrow.style.transform = 'translate(-50%, -50%)';
arrow.style.backgroundColor = 'transparent';
arrow.style.border = 'solid 20px transparent';
arrow.style.borderBottomColor = 'green';
arrow.style.transition = 'transform 0.1s';
document.body.appendChild(arrow);

document.addEventListener('mousemove', (event) => {
    const arrowRect = arrow.getBoundingClientRect();
    const arrowCenterX = arrowRect.left + arrowRect.width / 2;
    const arrowCenterY = arrowRect.top + arrowRect.height / 2;
    const angle = Math.atan2(event.clientY - arrowCenterY, event.clientX - arrowCenterX) * (180 / Math.PI);
    arrow.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
});