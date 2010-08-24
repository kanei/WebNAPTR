
/**
 * @file
 * JavaScript library for creating NAPTR records
 */
var Webnaptr = {
   order : 0,
   preference : 1,
   flags : 0,
   enumProvider : 0,
   replacement: 0,
   uri : 0,
   tel : 0,

   error : '',

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
      else {
         this.error = "setOrder: Wrong input data - not of INT type.";
         return false;
      }
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
      else {
         this.error = "setPreference: Wrong input data - not of INT type.";
         return false;
      }
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
      else {
         this.error = "setFlags: Wrong input data - only 's', 'u', 'a' and 'p' letters are allowed.";
         return false;
      }
   },

   //@TODO: +123456* numbers??

   /**
    * Set telephone number, which is used for constructing NAPTR record
    * @param tel input telephone number
    * @return true on success, false on failure
    */
   setTelNum: function(tel) {
      if(parseInt(tel)) {
         var result = '';
         for (var i = tel.length-1; i>=0; i--) {
            result += tel.charAt(i) + ".";
         }
         if(this.enumProvider == this.Providers.E164ARPA)
            result += "e164.arpa.";
         else if(this.enumProvider == this.Providers.NRENUM)
            result += "nrenum.net.";
         this.tel = result;
         return true;
      }
      else {
         this.tel = 0;
         this.error = "setTelNum: Wrong input data - not a correct telephone number.";
         return false;
      }
   },

   /**
    * Set URI address, which is used for constructing NAPTR record
    * @param uri address for replacement
    * @return true on success, false on failure
    */
   setURI: function(uri) {
      if(uri!=''){
         this.uri = uri;
         return true;
      }
      else {
         this.error = "setURI: Wrong input data - empty string.";
         return false;
      }
   },

   /**
    * Set Replacement
    * A <domain-name> which specifies the new value in the
    * case where the regular expression is a simple replacement
    * operation.
    */
   setReplacement: function(rep) {
      //!! Regexp for email^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$
      //@TODO check by regular expreesion
      this.replacement = rep;
   },
   
   /**
    * Generates NAPTR record for desired service
    * @param service_enum defines which service will be generated
    * enums are available as part of Webnaptr object
    * @return on success string containing NAPTR record or false on failure
    */
   generate : function(service_enum) {
      var record = '';

      if(!this.tel) {
          this.error = "generate: telephone number has not been set.";
          return false;
      }
      if(!this.uri) {
          this.error = "generate: URI has not been set.";
          return false;
      }

      //first row
      //$ORIGIN 2.4.2.4.5.5.5.1.e164.arpa.
      record += '$origin ' + this.tel + '\n';

      //second row
      //IN NAPTR 100 10 "u" "E2U+sip"  "!^.*$!sip:test@test.net!"
      record += 'IN NAPTR ' + this.order + ' ' + this.preference + ' ';
      //                      ^order             ^preference
      record += '"' + this.flags + '" ';
      //                     ^flags

      //Add rest of record, which depends on every service
      switch(service_enum) {
         case this.Services.H323:
            record += '"E2U+H323" "!^.*$!h323:' + this.uri + '!"';
            //                 ^service        ^regexp
            break;
         case this.Services.SIP:
            record += '"E2U+sip" "!^.*$!sip:' + this.uri + '!"';
            break;
         case this.Services.EMAIL:
            record += '"E2U+email" "!^.*$!mailto:' + this.uri + '!"';
            break;
         case this.Services.IFAX:
            record += '"E2U+ifax:mailto" "!^.*$!mailto:' + this.uri + '!"';
            break;
         default:
            break;
      }

      //Check for 'U' flag - if present, skip replacement field
      if(this.flags == 'U') {
         record += ' .';
      }
      else {
         if(!this.replacement) {
            this.error = "generate: Replacement string has not been set."
            return false;
         }
         record += ' ' + this.replacement + ' .';
      }

      return record;
   }
};

/** ENUM services **/
Webnaptr.Services = {
   /**
    * Record for E@U+H323 service.
    */
   H323 : 0,
   /**
   * Record for E2U+SIP service.
   *
   * Service for converting from E.164 to SIP address
   */
   SIP : 1,
   /**
   * Record for E2U+ifax service.
   *
   * Service for converting from E.164 telephone number
   * to URI address. Is used for fax to email address conversion.
   */
   IFAX : 2,
   PRES: 3,
   WEB: 4,
   /**
   * Record for E2U+email service.
   * 
   * Service for converting from E.164 to email address
   */
   EMAIL: 5
};

  /** ENUM providers **/
 Webnaptr.Providers = {
   E164ARPA : 0,
   NRENUM : 1
 }
