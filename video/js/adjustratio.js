function adjust(){
	height = (window.innerHeight/2) - 13;
	boxes = document.getElementsByClassName('box');
	for(i = 0; i < boxes.length; ++i){
		box = boxes[i];
		// box.style.width = width + 'px';
		box.style.height = height + 'px';
	}
}
window.addEventListener('resize', adjust);
adjust()