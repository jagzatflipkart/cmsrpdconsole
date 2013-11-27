/*global define*/
'use strict';
define(function() {
	var config = {
		"rules": {
			"rteButtons": false,
			"availableButtons": 'bold italic underline, link'
		},
		"button_templates": {
			"prvu_templates": [{
				"tmpl_id": "featureset_type1",
				"title": "CO + MU + Desc",
				"helpText": "Blah blah",
				"previewImage": "/images/featureset_preview_01.png",
				minUnits : {
					"callouts" : 3,
					"mediaUnits" : 1
				}
			}, {
				"tmpl_id": "featureset_type2",
				"title": "TD + (MU + Desc)*",
				"helpText": "Blah blah",
				"previewImage": "/images/featureset_preview_02.png",
				minUnits : {
					"callouts" : 3,
					"mediaUnits" : 1
				}
			}, {
				"tmpl_id": "featureset_type3",
				"title": "Desc + Callouts",
				"helpText": "Blah blah",
				"previewImage": "/images/featureset_preview_03.png",
				minUnits : {
					"callouts" : 3,
					"mediaUnits" : 1
				}
			}]
		}

	};

	return config;
});