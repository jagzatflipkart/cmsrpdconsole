/*global define, $*/
$.fn.scrollView = function () {
    return this.each(function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top
        }, 1000);
    });
};
define(['mustache','templateloader','utils','config'], function (Mustache,$tmpl, utils, config) {
    'use strict';
    // var $fsbt = $tmpl.filter('#featureset_button_template').html(),
    // 	fsPreviewHtml = Mustache.render($fsbt,config.button_templates);
    var $rtd= $('#richTextDescription');

    if (config.rules.rteButtons){
   		$.rta(config.rules.availableButtons);
   	}

    $rtd.on('click', '.accordion-handle-link', utils.simpleAccordion)
    $rtd.find('#features-desc-panel').append($tmpl.renderFSPrvuTemplate());
    $rtd.on('click','#add-feature',utils.renderFSPrvuTemplate);

   	$rtd.on('change keyup blur','.prod-des-mu-link', utils.genPreviewFromLink);
   	$rtd.on('focus','.prod-des-mu-link', utils.desPreviewFromLink);
   	$rtd.on('click','.clone-unit', utils.addMoreUnits);
   	$rtd.on('click','.glyphicon-trash,.dismiss-item', utils.delUnit);   	
   	$rtd.on('click','.featureset-prvu-holder',{ 
   		rteconfig : config.rules.rteButtons,
   		rteBtns : config.rules.availableButtons 
   	}, utils.getTmplToRender);
   	
   	$rtd.on('click','.increase-priority',utils.moveUpUnit);
   	$rtd.on('click','.decrease-priority',utils.moveDownUnit);
   	$rtd.on('change keyup blur', '.over-large-text', utils.chkIfSmallTextApplicable);
    $('#preview-btn').on('click', utils.buildPreviewResponse);
    $('#submit-btn').on('click', utils.buildSubmitResponse);
    $('#fsn').on('blur', utils.chkIfAvailable)
});