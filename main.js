


$(function(){

  var page = 1;
  var filepre = "";

  var all_hide = function(){
    progressHide();
    $("#self").hide();
    $("#mes-pc").hide();
    $("#mes-add").hide();
    $("#reader").hide();
    $("#reader-close").hide();
  };

  var progressHide = function() {
    $(".download-dialog").hide();
  };

  var progressShow = function(p) {
    $(".download-dialog").show();
    $(".meter-progress").width(p+"%");
  };

  var self_show = function() {
    all_hide();
    $("#self").fadeIn();
    self_icon();
  };

  var self_icon = function() {
    $("#kumono .icon").removeClass("icon-check");
    $("#kumono .icon").removeClass("icon-download");
    $("#play .icon").removeClass("icon-check");
    $("#play .icon").removeClass("icon-download");

    if(checkImage("kumono")){
      $("#kumono .icon").addClass("icon-check");
    }else{
      $("#kumono .icon").addClass("icon-download");
    }
    if(checkImage("play")){
      $("#play .icon").addClass("icon-check");
    }else{
      $("#play .icon").addClass("icon-download");
    }
  };

  var reader_start = function() {
    all_hide();
    $("#reader").show();
    $("#reader-close").show();
    reader_show();
    reader_diff(0);
  };

  var reader_show = function() {
    $("#reader").hide();
    loadImage(filename(filepre,page),"reader-img");
    $("#reader").fadeIn();
  };

  var reader_diff = function(dx) {
    $("#reader").css("left",dx+"px");
    var w = $("#reader").width();
  };

  var filename = function(file,i) {
    var filename = "";
    if (i<10) {
      filename = "https://raw.github.com/wiki/yoshik/book/"+file+"-0"+i+".png";
    } else {
      filename = "https://raw.github.com/wiki/yoshik/book/"+file+"-"+i+".png";
    }
    return filename;
  };

  var saveImage = function(file, then) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var image = new Image();
    image.onload= function () {
    canvas.width=image.width;
    canvas.height=image.height;
      ctx.drawImage(image, 0, 0);
      localStorage[file] = canvas.toDataURL();
      then();
    };
    image.src = file;
  };

  var loadImage = function(key, id) {
      document.getElementById(id).src =  localStorage[key] ;
  };

  var maxPage = function(file) {
    var max=1;
    if (file === "kumono") { max = 11; }
    if (file === "play") { max = 4; }
    return max;
  };

  var checkImage = function(file) {
    var max = maxPage(file);
    var flag = true;

    for (var i = 1; i <= max; i++) {
      var f = filename(file,i);
      if(localStorage[f] === undefined){
        flag = false;
      }
    }
    return flag;
  };


  var download = function(file, i, finish) {
    var max = maxPage(file);

    if(i>max){
      progressHide();
      finish();
    }else{

      var f = filename(file,i);
      console.log(f);
      progressShow(Math.round(i/max*100));
      saveImage(f, function(){
        download(file,i+1,finish);
      });
    }

  };

  $("#kumono").on("click", function(){
    filepre = "kumono";
    var chk = checkImage(filepre);
    var show = function(){
      self_icon();
      reader_start();
    };
    if (chk) {
      show();
    } else {
      download(filepre,1,show);
    }
  });

  $("#play").on("click", function(){
    filepre = "play";
    var chk = checkImage(filepre);
    var show = function(){
      self_icon();
      reader_start();
    };
    if (chk) {
      show();
    } else {
      download(filepre,1,show);
    }
  });


  $("#reader-close").on("click", function(){
    page=1;
    self_show();
  });

  all_hide();

  if ( navigator.userAgent.indexOf('iPhone') <= 0) {
    $("#mes-pc").show();
  }else if(! window.navigator.standalone){
    $("#mes-add").show();
  }else{
    self_show();
  }

  var touch = {};
  var $target = $("#reader")[0];
  $target.addEventListener("touchstart",  touchstart,  false);
  $target.addEventListener("touchmove",   touchmove,   false);
  $target.addEventListener("touchend",    touchend,    false);
  $target.addEventListener("touchcancel", touchcancel, false);

  function touchstart(e){
    touch.x = e.pageX;
    touch.y = e.pageY;
  }

  function touchmove(e){
    var dx = e.pageX - touch.x;
    reader_diff(dx);
  }

  function touchend(e){
    reader_diff(0);
    var dx = e.pageX - touch.x;
    if(dx >  50){page++;}
    if(dx < -50){page--;}
    var max = maxPage(filepre);
    if(max < page ){page = max;}
    if(page < 1){page = 1;}
    reader_show();
  }

  function touchcancel(e){
    touchend();
  }

});