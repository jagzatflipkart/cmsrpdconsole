/*global define*/
'use strict';

define(['jquery', 'templateloader', 'config'], function($, $tmpl, config) {
  var utils = {
    simpleAccordion: function(e) {
      var $targ = $(e.currentTarget),
        $titleHolder = $targ.parent(),
        $targetPane = $titleHolder.parent(),
        $accHolder = $targ.parents('.accordion-holder').eq(0),
        $paneContentToAnimate = $targetPane.children('.accordion-pane-content');

      if ($targetPane.hasClass('shown')) {
        $targetPane.removeClass('shown');
      } else {
        $accHolder.find('.shown').removeClass('shown');
        $targetPane.addClass('shown');
      }
      e.preventDefault();
    },
    isValidCdnImageURL: function(s) {
      var cdnUrlPattern = /^(https?):\/\/(img[0-9a-zA-Z]*)\.(flixcart.com)\/.*.(jpg|png|gif|jpeg)$/;
      return cdnUrlPattern.test(s);
    },
    isValidYouTubeLink: function(s) {
      var youtubeUrlPattern = /^(((https?):\/\/)?(www.)?|\/\/(www.)?)(youtube.com|youtu.be)\/.*$/;
      return youtubeUrlPattern.test(s);
    },
    getVideoIdFromYoutubeLink: function(link) {
      if (link.indexOf('youtu.be') != -1) {
        return link.substr(link.lastIndexOf('/') + 1);
      } else {
        return link.split('v=')[1].split('&')[0];
      }
    },
    getVideoPreviewImage: function(youtubeLink, holder) {
      var oembedUrl = 'http://www.youtube.com/oembed?url=' + youtubeLink + '%26format=json',
        qUrl = "http://query.yahooapis.com/v1/public/yql?q=select+*+from+json+where+url+='" + oembedUrl + "'&format=json";

      $.ajax({
        url: qUrl,
        dataType: "jsonp",
        success: function(data) {
          var response = data.query.results.json;
          var link = response.thumbnail_url;
          holder.find('.preview-link').val(link);
          holder.find('.preview').removeClass('disabled').attr('data-content', '<img src="' + link + '" width=180 alt="" />').attr('data-delay', "1000");
        },
        error: function(result) {

        }
      });
    },
    getTypeOfLink: function(val) {
      if (val) {
        if (utils.isValidCdnImageURL(val)) {
          return 'photo';
        } else if (utils.isValidYouTubeLink(val)) {
          return 'Video';
        }
        return 'some-text';
      }
    },
    genPreviewFromLink: function(e) {
      var $field = $(e.currentTarget),
        val = $field.val(),
        typeOfLink = utils.getTypeOfLink(val),
        muHolder = $field.parents('.mu-link-holder'),
        prvu = $field.parents('.mu-link-holder').find('.preview');
      if (val) {
        switch (typeOfLink) {
          case 'photo':
            prvu.removeClass('disabled').attr('data-content', '<img src="' + val + '" width=180 alt="" />').attr('data-delay', "1000");
            break;
          case 'Video':
            val = 'http://www.youtube.com/watch?v=' + utils.getVideoIdFromYoutubeLink(val);
            utils.getVideoPreviewImage(val, muHolder);
            break;
          default:
            $field.parent().addClass('has-warning');
            break;

        };
        prvu.popover({
          "html": "true",
          "placement": "top",
          "trigger": "hover"
        });
      } else {
        utils.desPreviewFromLink(e);
      }
    },
    desPreviewFromLink: function(e) {
      var $field = $(e.currentTarget),
        prvu = $field.closest('.mu-link-holder').find('.preview');
      $field.parent().removeClass('has-warning');
      prvu.addClass('disabled').popover('destroy');
    },
    createCleanObects: function($clone) {
      $clone.find('input').val('').removeAttr('disabled');
      $clone.find('.preview').popover('destroy');
      $clone.find('.op-btns-holder').append('<span class="btn btn-default glyphicon glyphicon-trash"></span>');
      return $clone;
    },
    addMoreUnits: function(e) {
      var $formgrp = $(e.currentTarget).parent(),
        $clone = utils.createCleanObects($formgrp.find('.cloneable-unit').eq(0).clone());
      e.preventDefault();
      $clone.find('.dismiss-item,.glyphicon-arrow-up').removeClass('hidden');

      $formgrp.find('.clones-holder').eq(0).append($clone);
    },
    delUnit: function(e) {
      var $formgrp = $(e.currentTarget).closest('.cloneable-unit');
      e.preventDefault();
      if ($formgrp.hasClass('featureset')) {
        $formgrp.parents('#features-desc-panel').find('.add-feature').click();
        $formgrp.parents('.feature-holder').eq(0).parent().remove();
      } else {
        $formgrp.remove();
      }

    },
    getTmplToRender: function(e) {
      var targ = $(e.currentTarget),
        tmpId = targ.data('tmplid'),
        skl = $tmpl.render(tmpId, null),
        dest = $('#features-desc-panel');
      dest.find('.fs-prvu-template').remove();
      dest.append(skl);
      utils.initializeRTE(dest, e.data.rteconfig, e.data.rteBtns);
      $('#add-feature').removeClass('hidden');
    },
    initializeRTE: function(dest, rteConfig, rteBtns) {
      if (rteConfig) {
        dest.find('.rta').rta(rteBtns);
      }
    },
    renderFSPrvuTemplate: function(e) {
      var $targ = $('#features-desc-panel');
      e.preventDefault();
      $targ.find('.fs-prvu-template').remove();
      $targ.append($tmpl.renderFSPrvuTemplate());
      $targ.find('.fs-prvu-template').scrollView();
      $('#add-feature').addClass('hidden');
    },
    moveUpUnit: function(e) {
      var $unitToMove = $(e.currentTarget).closest('.cloneable-unit'),
        $destPos = $unitToMove.prev();
      $unitToMove.insertBefore($destPos);
      e.preventDefault();
    },
    moveDownUnit: function(e) {
      var $unitToMove = $(e.currentTarget).closest('.cloneable-unit'),
        $destPos = $unitToMove.next();
      $unitToMove.insertAfter($destPos);
      e.preventDefault();
    },
    chkIfSmallTextApplicable: function(e) {
      var $field = $(e.currentTarget),
        val = $field.val(),
        typeOfInp = utils.getTypeOfLink(val);

      if (typeOfInp === 'photo') {
        $field.parent().next().find('input').attr('disabled', 'disabled');
      }
    },
    precacheImages: function(list) {
      for (imgLink in list) {
        var i;
        if (document.images) {
          i = new Image();
          i.src = imgLink;
        }
      }
    },
    buildFeatureDescsUnits: function(featuresDescArray) {
      var featureDescUnits = [],
        len = featuresDescArray.length,
        titleVal = '',
        mediaUrlVal = '',
        thumbnailVal = '',
        description = '',
        i, unit, tmp, priority = 0;

      for (i = 0; i < len; i++) {
        tmp = $(featuresDescArray[i]);
        unit = {};

        titleVal = tmp.find('.mu-title').val();
        mediaUrlVal = tmp.find('.mu-link').val();
        thumbnailVal = tmp.find('.preview-link').val();
        descriptionVal = tmp.find('.feature-description-holder textarea').val();

        if (titleVal != '') {
          unit.title = {
            value: titleVal,
            status: 'pending'
          };
        }

        if (mediaUrlVal != '') {
          unit.mediaUrl = {
            value: mediaUrlVal,
            status: 'pending'
          };
        }

        if (thumbnailVal != '') {
          unit.thumbnail = {
            value: thumbnailVal,
            status: 'pending'
          };
        }
        unit.mediaType = {
          value: utils.getTypeOfLink(unit.mediaUrl.value)
        };
        if (descriptionVal != '') {
          unit.description = {
            value: descriptionVal,
            status: 'pending'
          };
        }

        if (titleVal || mediaUrlVal || thumbnailVal || descriptionVal) {
          unit.priority = priority++;
          featureDescUnits.push(unit);
          titleVal = '';
          mediaUrlVal = '';
          thumbnailVal = '';
          description = '';
        }
      }

      return featureDescUnits;
    },
    buildproductOverview: function(productOverviewEl) {
      var productOverview = {},
        i = 0,
        muLinkHolders = productOverviewEl.find('.media-unit-holder').children();

      // productOverview.title = {
      //   value: productOverviewEl.find('#product-title').val(),
      //   status: 'pending'
      // };

      productOverview.title = productOverviewEl.find('#product-title').val();

      // productOverview.description = {
      //   value: productOverviewEl.find('#product-description').val(),
      //   status: 'pending'
      // };

      productOverview.description = {
        "text": productOverviewEl.find('#product-description').val(),
        "calloutList": []
      }

      productOverview.media = utils.buildMediaUnits(muLinkHolders);

      return productOverview;
    },
    /*
     * @param array of nodes with class featureset-unit
     * @return array of featureSets
     */
    buildFeatureSetList: function(featuresEl, forSave) {
      var features = [],
        numFeatureSets = featuresEl.length,
        priority = 0,
        i, tmp, el;


      for (i = 0; i < numFeatureSets; i++) {
        tmp = {};
        el = featuresEl[i];
        if (!(el instanceof $)) {
          el = $(el);
        }
        tmp.overview = utils.buildOverviewObject(el.find('.overviewUnit').eq(0), forSave);
        tmp.priority = priority++;
        tmp.features = utils.buildFeaturesArray(el.find('.featuresUnit .clones-holder').eq(0).children(), forSave);
        
        if (forSave){
          tmp.templateType = el.attr('data-template-type');
        }
          
        features.push(tmp);
      }

      return features;
    },
    buildFeaturesArray: function(featuresEl, forSave) {
      var features = [],
        numFeatureSets = featuresEl.length,
        priority = 0,
        i, tmp, el;

      for (i = 0; i < numFeatureSets; i++) {
        tmp = {};
        el = featuresEl[i];
        if (!(el instanceof $)) {
          el = $(el);
        }
        tmp.title = utils.getTitle(el.find('.overview-title').eq(0));
        tmp.priority = priority++;
        tmp.description = utils.getDescriptionObject(el.find('.descriptionUnit').eq(0), forSave);
        tmp.media = utils.getMediaObject(el.find('.mediaUnit .media-unit-holder').eq(0), forSave);
        features.push(tmp);
      }

      return features;
    },
    /* @param element containing the title
     * @return string
     */
    getTitle: function(el) {
      if (!(el instanceof $)) {
        el = $(el);
      }
      return el.val();
    },
    getDescriptionObject: function(el, forSave) {
      var descriptionObject = {};
      if (!(el instanceof $)) {
        el = $(el);
      }
      if (forSave) {
        descriptionObject.text = {
          value: utils.getDescriptionText(el.find('.overview-description').eq(0)),
          status: 'pending'
        };
        descriptionObject.calloutList = utils.getCalloutList(el.find('.calloutList').eq(0).children(), forSave);
      } else {
        descriptionObject.text = utils.getDescriptionText(el.find('.overview-description').eq(0));
        descriptionObject.calloutList = utils.getCalloutList(el.find('.calloutList').eq(0).children(), forSave);
      }
      return descriptionObject;
    },
    getDescriptionText: function(el) {
      if (!(el instanceof $)) {
        el = $(el);
      }

      return el.val();
    },
    /* @param element the wrapper containing the callout units
     * @return array of callout unit objects
     */
    getCalloutList: function(calloutsArray, forSave) {
      var calloutUnits = [],
        callout,
        unit, i, el,
        txt1 = '',
        txt2 = '',
        txt3 = '',
        len = calloutsArray.length,
        priority = 0;


      //calloutsArray = el.children('.calloutUnit');

      for (i = 0; i < len; i++) {
        callout = $(calloutsArray[i]);
        txt1 = callout.find('.over-large-text').val();
        txt2 = callout.find('.over-small-text').val();
        txt3 = callout.find('.under-text').val();
        unit = {};
        unit.highlight = {};
        unit.subHighlight = {};

        if (utils.getTypeOfLink(txt1) === 'photo') {
          if (forSave) {
            unit.highlight.icon = {
              value: txt1,
              status: 'pending'
            }
          } else {
            unit.highlight.image = txt1;
          }
        } else {
          if (forSave) {
            unit.highlight.text1 = {
              value: txt1,
              status: 'pending'
            }
          } else {
            unit.highlight.text1 = txt1;
          }
          if (txt2 != '') {
            if (forSave) {
              unit.highlight.text2 = {
                value: txt2,
                status: 'pending'
              };
            } else {
              unit.highlight.text2 = txt2;
            }
          }
        }
        if (txt3 != '') {
          if (forSave) {
            unit.subHighlight = {
              value: txt3,
              status: 'pending'
            };
          } else {
            unit.subHighlight = txt3;
          }
        }

        if (txt1 || txt2 || txt3) {
          unit.priority = priority++;
          calloutUnits.push(unit);
          txt1 = '';
          txt2 = '';
          txt3 = '';
        }
      }

      return calloutUnits;
    },
    getMediaObject: function(el, forSave) {
      var mediaUnits = [],
        muHolder,
        titleVal = '',
        mediaUrlVal = '',
        thumbnailVal = '',
        priority = 0,
        unit,
        muLinkHolders;

      if (!(el instanceof $)) {
        el = $(el);
      }

      muLinkHolders = el.children('.mu-link-holder');

      for (var i = 0, len = muLinkHolders.length; i < len; i++) {
        muHolder = muLinkHolders.eq(i);
        unit = {};

        titleVal = muHolder.find('.mu-title').val();
        mediaUrlVal = muHolder.find('.mu-link').val();
        thumbnailVal = muHolder.find('.preview-link').val();

        if (titleVal != '') {
          if (forSave) {
            unit.title = {
              value: titleVal,
              status: 'pending'
            };
          } else
            unit.title = titleVal;
        }

        if (mediaUrlVal != '') {
          if (forSave) {
            unit.url = {
              value: mediaUrlVal,
              status: 'pending'
            };
          } else {
            unit.url = mediaUrlVal;
          }
        }

        if (thumbnailVal != '') {
          if (forSave) {
            unit.thumbnail = {
              value: thumbnailVal,
              status: 'pending'
            };
          } else {
            unit.thumbnail = thumbnailVal
          }

        }
        if (mediaUrlVal) {
          unit.type = utils.getTypeOfLink(mediaUrlVal);
        }



        if (titleVal || mediaUrlVal || thumbnailVal) {
          unit.priority = priority++;
          mediaUnits.push(unit);
          titleVal = '';
          mediaUrlVal = '';
          thumbnailVal = '';
        }

      }

      return mediaUnits;
    },
    buildOverviewObject: function(el, forSave) {
      var overview = {};

      if (forSave) {
        overview.title = {
          value: utils.getTitle(el.find('.overview-title').eq(0)),
          status: 'pending'
        };
      } else {
        overview.title = utils.getTitle(el.find('.overview-title').eq(0));
      }
      
      overview.description = utils.getDescriptionObject(el.find('.descriptionUnit').eq(0), forSave);
      
      overview.media = utils.getMediaObject(el.find('.mediaUnit').eq(0), forSave);

      return overview;
    },
    /* @param form element containing the entire entered data
     * @return
     */
    buildRichProductDescription: function(el, forSave) {
      var response = {};

      if (!(el instanceof $)) {
        el = $(el);
      }

      response.fsn = el.find('#fsn').val();
      response.overview = utils.buildOverviewObject(el.find('.overviewUnit').eq(0), forSave);
      response.featureSetList = utils.buildFeatureSetList(el.find('#features-desc-panel').children('.featureset-unit'), forSave);
      utils.dataSafe = true;
      console.log(JSON.stringify(response, null, ' '));
    },
    buildPreviewResponse: function(e) {
      e.preventDefault();
      utils.buildRichProductDescription($('#richTextDescription'), false);
    },
    buildSubmitResponse: function(e) {
      e.preventDefault();
      utils.buildRichProductDescription($('#richTextDescription'), true);
    },
    chkIfAvailable: function(e){
      var fsn = $('#fsn').val();
      $.ajax({
        //url:
        url: 'MOBDZBZ9FSEKF2TV.json',
        success: utils.loadDataFromJson
      })
    },
    loadDataFromJson: function(json) {
      var topLevelOverViewData = json.overview,
          featuresList = json.featureSetList,
          theContent = $tmpl.render('overviewUnit',topLevelOverViewData),
          i,numFeatures = featuresList.length,
          tmplToLoad, featureData, tmpId, featuresContent = '';
      
      $('#topLevelOverview .overviewUnit').parent().html(theContent);
      

      for (i=0; i<numFeatures; i++){
        featureData = featuresList[i];
        tmpId = featureData.templateType + '_ms';
        featuresContent += $tmpl.render(tmpId, featureData);
      }
      $('#features-desc-panel').append(featuresContent);
      $('#features-desc-panel .fs-prvu-template').remove();
      $('#add-feature').removeClass('hidden');
      $('#topLevelOverview .accordion-pane').addClass('shown');
    }
  };

  return utils;
});