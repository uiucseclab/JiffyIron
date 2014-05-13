var pubkey = {
	n: '00be4b951374976ea8390c04158fb8f3093f8b076a31a612ebcdd1e7edd8110e99ab42c94ce25075e9a90c127997a67205d0e7d272caf453a08b3b06b5c5af257034298986a45814f18a3ed657207aea8d5814581144a490c7cf867174f201e14906eb80f00d00da7ca3d19d57d28fcffb5cadfd80fcd8705b828957c310fee960b1ac9457c0f9c61c61dd46b90adcb4084a06a18a2244461372d7352a6cc26dc7aa73fb5f5c7b2d7c966c9d3e42127ab2e409008ebc90c28bbe62f0c108fe4374bdc069419be319e76d4409d3aade61095dfa4f49edc7910f43ef8bcfd31dc6e7d09b162248d2c910c8cc82b4d67902ee04b60503c5e6d1587d0e949f9bcbb313',
	e: '10001'
}

var privkey = {
	n: '00be4b951374976ea8390c04158fb8f3093f8b076a31a612ebcdd1e7edd8110e99ab42c94ce25075e9a90c127997a67205d0e7d272caf453a08b3b06b5c5af257034298986a45814f18a3ed657207aea8d5814581144a490c7cf867174f201e14906eb80f00d00da7ca3d19d57d28fcffb5cadfd80fcd8705b828957c310fee960b1ac9457c0f9c61c61dd46b90adcb4084a06a18a2244461372d7352a6cc26dc7aa73fb5f5c7b2d7c966c9d3e42127ab2e409008ebc90c28bbe62f0c108fe4374bdc069419be319e76d4409d3aade61095dfa4f49edc7910f43ef8bcfd31dc6e7d09b162248d2c910c8cc82b4d67902ee04b60503c5e6d1587d0e949f9bcbb313',
	e: '10001',
	d: '36b8c96fc4d15f32e4e4bdafed9a83d91efabdf11dc1e2230916d9991dcf19e1bacc03d32629791eee4bd86c3addd46033c8d64dc86b26393e9084c774c77efe9b216eb8d73db5181867257ffc891c35f524348712b438261d594dfb1134d53208d96444a398a13bc2681ed50869eea71be9b4c288f33cac340786c34379ea6632ad4a93886a30f27f2cf2270896574bab3e10d052f24b1c2a8142ce8330d5c9b3b6e007176157e747acede9810e7c0dd23ed9005d1b739603f993819361f4884f21eaf2f689fc024dd28b3464726dec10e0d688227c943a66c6b4922550a441325fbce8e1a053d3e7250a3d634c4596d180bf7d5514acb91afdee6d1da91e01',
	p: '00ed1ab8ba4528061b91cf15734e5b09f7101f01f48baa1a3e1c8c8249fd0c19baefa78bbfcef42af5e9830dfadd67bd2817d774b296f409cb58a8da804fb5168abf7cdf43cfa281ac904a7807af905835fd64b152c701684fad9e2c606acfa546ee7baa85ed3d1b52ce90ede13b5e06e60b38e9a35f1916b7d4821259f8569c81',
	q: '00cd75e2aae4179b4366151332bc75edf57b15587b4423e8f7bc87f890895e053ab437580ad1859b5cc2f8356315a9effcfa962f6b5f74575cf15fae288161a09dfba01fffadeba25c097db2d8d62ec968ec8326afc4b773a9c8ff5cdeaff669c2b2c8bd060845c254fd2079faaddb0c128725736cf1fba516306d4d1e37995593',
	dmp1: '43b649e30834f1e995ae6a15cfdeb7edd2b0c8422a509dc5f729395c1fe400c51e03df291bd5271fab5c3df5d29cf9ac2582e654ca3f4f3cbf49197d6345f7f60fd17d81441ec8a19b6368fbe8eb74059723d670295d01891faff84460bc841ac9a88f7e47ce17ab824a6964d52b7914e1479391906afdcde9e66b8f3e189e01',
	dmq1: '009f1bebaceb765c8695473cd6cd9b85ebd4a573200264ccc50cfb3f42af1e606e55a1864cda74dd1bb8e0fe76fd0fdd09cc050233e477f42fc5bc92e24b4f8f52c8c9f7fdc871f209d44fc370a86d130c6e1c22997b7d95d4a6131b98582c3b3acbb928a8c33f427f0e8757ef0933d8e58043405fde0542932c6d788b2e035081',
	coeff: '4a0a1824e69853a4ba43cd83f8a14d9990810d9a1978c5f963a619bacd6aa7adedbcd7578e6cda07a849f7c36cef0ac0f12d7f497d53913f5e97f9e5ff264cca4b7668d3c439f734e04671f864a0f33b5be49ca0655e201c006c6ab21b3fa19f9ebd3c742af95b80e5575fae8dcaa6d2c9c24889f89c2418978a8ce07418b509'
}

var encrypt = function (plaintext){
	var rsa = new RSAKey();
	rsa.setPublic(pubkey.n, pubkey.e);
	return rsa.encrypt(plaintext);
}

var decrypt = function (ciphertext){
	var rsa = new RSAKey();
	rsa.setPrivateEx(
		privkey.n,
		privkey.e,
		privkey.d,
		privkey.p,
		privkey.q,
		privkey.dmp1,
		privkey.dmq1,
		privkey.coeff
	);
	return rsa.decrypt(ciphertext);
}

var doEncrypt = function () {
	var c = encrypt(document.getElementById('plaintext').value);
	document.getElementById('ciphertext').value = c;
}

var doDecrypt = function (){
	var d = decrypt(document.getElementById('ciphertext').value);
	document.getElementById('decrypttext').innerHTML = d;
}