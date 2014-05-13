window.onload = function() {
	var fileInput = document.getElementById('fileInput');
	var testdiv = document.getElementById('test');

	fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var reader = new FileReader();
		reader.onload = function(e) {
			var r = reader.result.split('\n');
			for (var i=0; i<r.length-1; i++){
				$('#data').append('<tr id="'+i+'"></tr>');
				
				var p = decrypt(r[i]).split('||');
				for (var j=0; j<p.length; j++){
					$('#'+i).append('<td>'+ p[j] + '</td>');
				}
			}
			// fileDisplayArea.innerText = reader.result;
		}
		reader.readAsText(file);
	});

var fileinput = $('fileInput');

$('#unload').on('click', function(){
	$('#data').html('');
	$('input[type="file"]').val(null);
});

}