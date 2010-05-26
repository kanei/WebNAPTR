
/**
 * @file
 * JavaScript library for creating NAPTR records
 */
var Webnaptr = {
  order : 0,
  preference: 1,
  flags : '',

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
    f = f.toLowerCase();
    if(f == 's' || f == 'u' || f == 'a' || f == 'p') {
      this.flags = f;
      return true;
    }
    return false;
  },

  /**
   * converts telephone number to ENUM E.164
   *
   * @param tel telephone number
   * @return converted string in ENUM E.164 format
   */
  convert_tel_enum: function(tel) {
    var result = '';
    for (var i = tel.length-1; i>=0; i--) {
      result += tel.charAt(i) + ".";
    }
    result += "e164.arpa.";
    return result;
  },

  /**
   * returns NAPTR record for E2U+SIP service
   * Service for converting from E.164 to SIP address
   * @param uri URI for SIP address
   * @param tel telephone number
   */
  generate_e2u_sip: function(uri, tel) {
    var record = '';
    record += '$origin';
    record += convert_tel_arpa(tel);
    record += '\n';



  }

};

