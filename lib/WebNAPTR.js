
/**
 * @file
 * JavaScript library for creating NAPTR records
 */
var Webnaptr = {
   order : 0,
   preference : 1,
   flags : '',
   enumProvider : 0,

   /** ENUM providers **/
   E164ARPA : 0,
   NRENUM : 1,

   /**
   * Sets all of the common parametres of NAPTR record
   *
   * @param o order - 16-bit unsigned integer specifying the order in which
   * the NAPTR records will be processed.
   * @param p preference - 16-bit unsigned integer that specifies the order
   * in which NAPTR records with equal "order" values should be processed.
   * @param f flags - one of four so far defined flags, "S", "A", "U", and "P".
   * @return true if everything went ok, otherwise false
   */
   setParams: function(o, p, f) {
      return this.setOrder(o) && this.setPreference(p) && this.setFlags(f);
   },

   /**
   * Sets order value for NAPTR record.
   *
   * A 16-bit unsigned integer specifying the order in which the NAPTR records
   * will be processed.
   *
   * @param o order numeric value
   * @return true if number was an correct input, otherwise false
   */
   setOrder: function(o) {
      if((o = parseInt(o))) {
         order = o;
         return true;
      }
      return false;
   },

   /**
   * Sets preference value for NAPTR record.
   *
   * A 16-bit unsigned integer that specifies the order in which NAPTR records
   * with equal "order" values should be processed.
   *
   * @param p preference numeric value
   * @return true if number was an correct input, otherwise false
   */
   setPreference: function(p) {
      if((p = parseInt(p))) {
         order = p;
         return true;
      }
      return false;
   },

   /**
   * Sets flags for NAPTR record.
   *
   * At this time only four flags, "S", "A", "U", and "P", are defined.
   * "S" means that the next lookup should be for SRV records.
   * "A" means that the next lookup should be for either an A, AAAA, or A6
   * record.
   * "U" means that the next step is not a DNS lookup but that the output of
   * the Regexp field is an URI that adheres to the 'absoluteURI'.
   *
   * @param f defines flag character
   * @return true if character was accepted, otherwise returns false
   */
   setFlags: function(f) {
      f = f.toUpperCase();
      if(f == 'S' || f == 'U' || f == 'A' || f == 'P') {
         this.flags = f;
         return true;
      }
      return false;
   },

   //@TODO: +123456* numbers??

   /**
   * converts telephone number to ENUM E.164
   *
   * @param tel telephone number
   * @return converted string in ENUM E.164 format or false on failure
   */
   convert_tel_enum: function(tel) {
      if(parseInt(tel)) {
         var result = '';
         for (var i = tel.length-1; i>=0; i--) {
            result += tel.charAt(i) + ".";
         }
         if(this.enumProvider == this.E164ARPA)
            result += "e164.arpa.";
         else if(this.enumProvider == this.NRENUM)
            result += "nrenum.net.";
         return result;
      }
      else {
         return false;
      }
   },

   /**
   * returns NAPTR record for E2U+SIP service
   * Service for converting from E.164 to SIP address
   * @param uri SIP URI address for resolving number
   * @param tel telephone number for converting to ENUM format
   * @return string containing NAPTR record or false on failure
   */
   generate_e2u_sip: function(uri, tel) {
      var record = '';
      var tel_enum = this.convert_tel_enum(tel);
    
      if(!tel_enum) {
         return false;
      }

      //first row
      //$ORIGIN 2.4.2.4.5.5.5.1.e164.arpa.
      record += '$origin ' + tel_enum + '\n';
      //second row
      //IN NAPTR 100 10 "u" "E2U+sip"  "!^.*$!sip:test@test.net!"
      record += 'IN NAPTR ' + this.order + ' ' + this.preference + ' ';
      //                      ^order             ^preference
      record += '"' + this.flags + '" "E2U+sip" "!^.*$!sip:' + uri + '!" .';
      //                     ^flags             ^service      ^regexp

      return record;
   },

   /**
   * Returns NAPTR record for E2U+email service.
   * Service for converting from E.164 to email address
   * @param uri SIP URI address for resolving number
   * @param tel telephone number for converting to ENUM format
   * @return string containging NAPTR record or false on failure
   */
   generate_e2u_email: function(uri, tel) {
      var record = '';
      var tel_enum = this.convert_tel_enum(tel);

      // checking tel_num result
      if(!tel_enum) {
         return false;
      }

      //first row
      //$ORIGIN 2.4.2.4.5.5.5.1.e164.arpa.
      record += '$origin ';
      record += this.convert_tel_enum(tel) + '\n';
      //second row
      //IN NAPTR 100 10 "u" "E2U+email"  "!^.*$!mailto:test@test.net!"
      record += 'IN NAPTR ' + this.order + ' ' + this.preference + ' ';
      //                                    ^order               ^preference
      record += '"' + this.flags + '" "E2U+email" "!^.*$!mailto:' + uri + '!" .';
      //                     ^flags             ^service         ^regexp

      return record;
   },

   /**
   * Returns NAPTR record for E2U+h323 service.
   * Service for converting from E.164 to H.323 address
   * @param uri SIP URI address for resolving number
   * @param tel telephone number for converting to ENUM format
   * @return string containging NAPTR record or false on failure
   */
   generate_e2u_h323: function(uri, tel) {
      var record = '';
      var tel_enum = this.convert_tel_enum(tel);

      // checking tel_num result
      if(!tel_enum) {
         return false;
      }

      //first row
      //$ORIGIN 2.4.2.4.5.5.5.1.e164.arpa.
      record += '$origin ';
      record += this.convert_tel_enum(tel) + '\n';
      //second row
      //IN NAPTR 100 10 "u" "E2U+email"  "!^.*$!mailto:test@test.net!"
      record += 'IN NAPTR ' + this.order + ' ' + this.preference + ' ';
      //                                    ^order               ^preference
      record += '"' + this.flags + '" "E2U+H323" "!^.*$!h323:' + uri + '!" .';
      //              ^flags                    ^service         ^regexp

      return record;
   },

   /**
   * Returns NAPTR record for E2U+ifax service.
   * Service for converting from E.164 telephone number 
   * to URI address. Service is used for fax to email address.
   * @param uri SIP URI address for resolving number
   * @param tel telephone number for converting to ENUM format
   * @return string containging NAPTR record or false on failure
   */
   generate_e2u_ifax: function(uri, tel) {
      var record = '';
      var tel_enum = this.convert_tel_enum(tel);

      // checking tel_num result
      if(!tel_enum) {
         return false;
      }

      //first row
      //$ORIGIN 2.4.2.4.5.5.5.1.e164.arpa.
      record += '$origin ';
      record += this.convert_tel_enum(tel) + '\n';
      //second row
      //IN NAPTR 100 10 "u" "E2U+email"  "!^.*$!mailto:test@test.net!"
      record += 'IN NAPTR ' + this.order + ' ' + this.preference + ' ';
      //                                    ^order               ^preference
      record += '"' + this.flags + '" "E2U+ifax:mailto" "!^.*$!mailto:' + uri + '!" .';
      //              ^flags                    ^service                ^regexp

      return record;
   },
};

