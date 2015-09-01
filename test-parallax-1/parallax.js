var mouseX = 0;
var mouseY = 0;
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
document.onmousemove = getMouseXY;


function getMouseXY(e) {
  mouseX = e.pageX
  mouseY = e.pageY
  $('#parallaxdots').css({"transform":"translate("+( (-mouseX+ (w/2)) / (w/100) )+"px, "+ ( (-mouseY+ (h/2)) / (h/100) )+"px)"})
  $('#rocket').css({"transform":"translate("+( (-mouseX+ (w/2)) / (w/500) )+"px, "+ ( (-mouseY+ (h/2)) / (h/500) )+"px)"})
  $('#oswaldsvg').css({"transform":"translate("+( (-mouseX+ (w/2)) / (w/1000) )+"px, "+ ( (-mouseY+ (h/2)) / (h/1000) )+"px)" + " rotate("+(mouseX+(w/2)/(w/100))+"deg)"})
  return true
}