(function($) {
   $(document).ready(function () {

      // replace default submit function
      $(".form-submit").click(function(){
         var result;
         var selected = $('#edit-services input:radio:checked').val();
         var flags = $('#flags_fs input:radio:checked').val();
         var uri = $('#edit-sip-uri').val();
         var tel = $('#edit-sip-telnum').val();
         
         Webnaptr.setFlags(flags);
         Webnaptr.setURI(uri);
         Webnaptr.setTelNum(tel);
      
         switch(selected){
            case '1':
               result = Webnaptr.generate(Webnaptr.Services.SIP);
               break;
            case '2':
               result = Webnaptr.generate(Webnaptr.Services.EMAIL);
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
