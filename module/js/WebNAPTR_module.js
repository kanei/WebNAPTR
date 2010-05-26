(function($) {
  $(document).ready(function () {

    // replace default submit function
    $(".form-submit").click(function(){
      Webnaptr.order = 10;
      
      var arpa = Webnaptr.convert_tel_enum("420775287458");
      $("#edit-result").val(arpa);

      alert(Webnaptr.flags);
      return false;
    });

    $(".form-radio").click(function(){
      Webnaptr.setFlags(this.value);
    });

    $("#edit-order").change(function(){
      Webnaptr.setOrder(this.value);
    });
    
    
  });

})(jQuery);
