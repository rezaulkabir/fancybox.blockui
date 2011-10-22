var c = false;
$(function() {
  if(!$.fancybox) {
    throw"Fancybox plugin needs to be loaded first";
  }
  var a = {i:null, timeout:c, r:c, d:c, e:c, f:c, g:c, q:"<div></div>", l:function() {
    a.h && window.parent.scroll(0, 0);
    if(a.timeout) {
      a.i = window.setTimeout(function() {
        $.fancybox.close()
      }, a.timeout)
    }
    a.g && a.g()
  }, k:function() {
    a.d || $.fancybox.s();
    a.f && a.f()
  }, j:function() {
    $.fancybox.p();
    a.i && window.clearTimeout(a.i);
    a.e && a.e()
  }, b:function(a, d) {
    return a ? typeof a == d ? a : c : c
  }, m:function(b) {
    b = b ? b : {};
    typeof b != "object" && (b = {});
    a.e = this.b(b.j, "function");
    a.f = this.b(b.k, "function");
    a.g = this.b(b.l, "function");
    a.d = this.b(b.d, "boolean");
    a.h = this.b(b.h, "boolean");
    a.timeout = this.b(b.timeout, "number");
    a.c = b.c ? b.c : a.c;
    delete b.d;
    delete b.timeout;
    delete b.h;
    var d = {autoDimensions:c, height:"none", width:"none", transitionIn:"none", transitionOut:"none", hideOnContentClick:c, hideOnOverlayClick:true, transitionIn:"none", transitionOut:"none", centerOnScroll:true, enableEscapeButton:c};
    $.extend(d, b, {onStart:a.l, onComplete:a.k, onClosed:a.j});
    $("#fancybox-outer").o();
    $("#fancybox-loading").click(function() {
      $("#fancybox-loading").n("display", "block")
    });
    $.fancybox(a.c, d)
  }, t:function() {
    $.fancybox.close()
  }};
  $.extend(true, $.fancybox, a)
});