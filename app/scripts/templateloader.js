/*global define*/
'use strict';
define(['jquery','text!../tmpl/featureSetTemplates.html','mustache','config'], function($, fsTmpl, $M,config){	
	var $tmpl = $(fsTmpl);
	$tmpl.render = function(id, data){
		var $temp = $tmpl.filter('#' + id).html();
		return $M.render($temp, data);
	};

	$tmpl.renderFSPrvuTemplate = function(){
		var $fsbt = $tmpl.filter('#featureset_button_template').html();
		return $M.render($fsbt,config.button_templates);
	};

	return $tmpl;
});