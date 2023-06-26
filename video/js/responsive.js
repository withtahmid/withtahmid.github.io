function isHorizontal(){
	// document.getElementById('test').textContent ='height:'+ window.innerHeight + ' * width: ' + window.innerWidth;
	return (window.innerHeight * 1.3) < window.innerWidth;
}
function update_boxes(height, width){
	boxes = document.getElementsByClassName('box');
	for(i = 0; i < boxes.length; ++i){
		box = boxes[i];
		// box.style.width = width + 'px';
		box.style.height = height + 'px';
	}
}
function percent(value, percent) {
  if (typeof value !== 'number' || typeof percent !== 'number' || percent < 0 || percent > 100) {
    throw new Error('Invalid input. Please provide a number for value and a percentage between 0 and 100.');
  }

  return (value * percent) / 100;
}

function adjust_display(){
	displayWidth = window.innerWidth;
	displayHeight = window.innerHeight;
	height = (displayHeight/2) - 5;
	width = (displayWidth/2) - Math.ceil(percent(displayWidth, 0.625));

	if(!isHorizontal()){
		// console.log("vertical");
		width = displayWidth - percent(displayWidth, 1.302);
		height = (displayHeight/2)-10;
		if(height > (2*width)){
			height = (width*2)-10;
		}
	}
	update_boxes(height, width);
	alert(height, width);
	
}
adjust_display();
function resized(){
	adjust_display();
	// setTimeout(adjust_display, 500);
	// setTimeout(adjust_display, 2000);
}
window.addEventListener('resize', resized);