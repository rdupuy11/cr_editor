
/*
 * GET home page.
 */
var locals =  {
			stylesheets : ['../stylesheets/view.css', '../stylesheets/ddsmoothmenu.css', '../stylesheets/ddsmoothmenu-v.css'],
			scripts: ['../javascripts/view.js', '../javascripts/jquery-1.4.2.min.js', '../javascripts/ddsmoothmenu.js', '../javascripts/ddinit.js', '../javascripts/jszip.js'],
			data : {},
			data_string : ''
	};
	
exports.index = function(req, res){
	res.redirect('/edit/theme_color_assets', 302);
}

exports.edit = function(req,res){
	locals.form = req.params['page'];
	res.render(locals.form,{
		locals: locals
	});
}

var fs = require('fs');
exports.submit = function(req,res,next){

	var form_name = req.params['form'];
	locals.form = form_name;
	if(typeof(locals.data[form_name]) === 'undefined') locals.data[form_name] = {};
	for(var key in req.body){
		if(key != 'submit' && key != 'form_id'){
			locals.data[form_name][key] = req.body[key];
		}
	}
	
	//console.log(req.body);
	//console.log(req.files);
	for(var i in req.files){
		if(req.files[i].name == '') continue;	
		var tmp_path = req.files[i].path;
		var target_path = './public/files/' + /*form_name + '/' +*/ i;
		locals.data[form_name][i] = 'f/'+ target_path;
		
		fs.rename(tmp_path, target_path, function(err){
			if(err) console.log( err );
			
			fs.unlink(tmp_path, function(){
				if(err) console.log( err );
			});
		});
	}
console.log(locals.data);
	locals.data_string = JSON.stringify(locals.data);
	//console.log(locals.data);
	res.redirect('/edit/' + form_name, 302);
}

var AdmZip = require('adm-zip');
exports.download = function(req,res,next){
	var zip = new AdmZip();
	
	zip.addFile('data.js', "var data="+JSON.stringify(locals.data)+";", '');
	zip.addLocalFolder('/Users/echu/workspace/cr_editor/public/files');
	zip.writeZip('/Users/echu/workspace/cr_editor/public/download.zip');
	res.redirect('/download.zip',200);
}
