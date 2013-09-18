javascript-html5-canvas-basic-window-system
===========================================
This is the javascript code I wrote during my work with Jamison Signs during
summer 2013. It it an implementation of a basic window system, in which you
can create a square (the "window") which you can resize and move around the
canvas. With the proper button's setup, you can place an image in the window
and move and resize the subsequent image. The code is ment to be part of a
suite to allow users to create their own slideshows for use on a separate
set of advertising software which runs on the raspberry pi. The core window
drawing and movement code is in the movement.js file, while the code which
managed the creation and manipulations of slideshows is in (you guessed it)
slideshow.js. Both slideshow.js and fileInput.js are here mainly for completeness,
and integrate more with the HTML5 page produced by Common Lisp code on the server
(which for, what I hope are, obvious reasons I am not allowed to provide).
