(function($) {
  $(document).ready(function () {

    // replace default submit function
    $(".form-submit").click(function(){
      var result, uri, tel;
      var selected = $('#edit-services input:radio:checked').val();
      var flags = $('#flags_fs input:radio:checked').val();
      Webnaptr.setFlags(flags);
      
      switch(selected){
      case '1':
        uri = $('#edit-sip-uri').val();
        tel = $('#edit-sip-telnum').val();
        result = Webnaptr.generate_e2u_sip(uri, tel);
        break;
      case '2':
        uri = $('#edit-sip-uri').val();
        tel = $('#edit-sip-telnum').val();
        result = Webnaptr.generate_e2u_email(uri, tel);
        break;
      default:
        //Error message
        break;
      }

      $("#edit-result").val(result);

      return false;
    });

    $("#edit-order").change(function(){
      Webnaptr.setOrder(this.value);
    });

    $("#edit-preference").change(function(){
      Webnaptr.setPreference(this.value);
    })
    
    
  });

})(jQuery);
