function parseBigInt(e,t){return new BigInteger(e,t)}function linebrk(e,t){var n="";var r=0;while(r+t<e.length){n+=e.substring(r,r+t)+"\n";r+=t}return n+e.substring(r,e.length)}function byte2Hex(e){if(e<16)return"0"+e.toString(16);else return e.toString(16)}function pkcs1pad2(e,t){if(t<e.length+11){alert("Message too long for RSA");return null}var n=new Array;var r=e.length-1;while(r>=0&&t>0){var i=e.charCodeAt(r--);if(i<128){n[--t]=i}else if(i>127&&i<2048){n[--t]=i&63|128;n[--t]=i>>6|192}else{n[--t]=i&63|128;n[--t]=i>>6&63|128;n[--t]=i>>12|224}}n[--t]=0;var s=new SecureRandom;var o=new Array;while(t>2){o[0]=0;while(o[0]==0)s.nextBytes(o);n[--t]=o[0]}n[--t]=2;n[--t]=0;return new BigInteger(n)}function RSAKey(){this.n=null;this.e=0;this.d=null;this.p=null;this.q=null;this.dmp1=null;this.dmq1=null;this.coeff=null}function RSASetPublic(e,t){if(e!=null&&t!=null&&e.length>0&&t.length>0){this.n=parseBigInt(e,16);this.e=parseInt(t,16)}else alert("Invalid RSA public key")}function RSADoPublic(e){return e.modPowInt(this.e,this.n)}function RSAEncrypt(e){var t=pkcs1pad2(e,this.n.bitLength()+7>>3);if(t==null)return null;var n=this.doPublic(t);if(n==null)return null;var r=n.toString(16);if((r.length&1)==0)return r;else return"0"+r}RSAKey.prototype.doPublic=RSADoPublic;RSAKey.prototype.setPublic=RSASetPublic;RSAKey.prototype.encrypt=RSAEncrypt