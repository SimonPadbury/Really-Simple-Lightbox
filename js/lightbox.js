/*jslint browser: true*/
/*global $, jQuery*/

$(document).ready(function () {

  'use strict';

  $('a[data-lightbox]').lightbox();

});

/*
jQuery Lightbox plugin
Author: Simon Padbury
url: http://simonpadbury.com
version: 1.0
14 August 2014
*/
(function ($) {

  'use strict';

  $.fn.lightbox = function () {
    this.each(function () {

      // lightboxOverlay() - triggered by starting lightboxOpen()

      function lightboxOverlay() {
        // Disable right-click
        $('.lightbox-overlay, .lightbox-loading, .lightbox img').bind('contextmenu', function () {
          return false;
        });
        $('<div class="lightbox-overlay"></div>').hide().appendTo('body');
        $('.lightbox-overlay').fadeTo(250, 0.75);
        // If overlay is clicked, it also clicks #close (X)
        $('.lightbox-overlay').click(function () {
          $('#close').click();
        });
        // Overlay needs cursor to become a pointer, to show that it is clickable
        $('.lightbox-overlay').hover().css({
          cursor: 'pointer'
        });
      }

      // lightboxLoading() - triggered by starting lightboxOpen()

      function lightboxLoading() {
        $('<div class="lightbox-loading"><i class="fa fa-spinner fa-3x fa-spin"></i></div>').hide().appendTo('body');
        $('.lightbox-loading').css({
          top: $(window).height() / 2 - 47,
          left: $(window).width() / 2 - 47
        });
        $('.lightbox-loading').show(0);
        // (Click anywhere to abort if image fails to load)
        $('.lightbox-overlay, .lightbox-loading').click(function () {
          $('.lightbox-loading, .lightbox-overlay, .lightbox').fadeTo(500, 0, function () {
            $('.lightbox-loading, .lightbox-overlay, .lightbox').remove();
          });
        });
        // Open the lightbox
        $('.lightbox').css({
          top: $(window).height() / 2,
          left: $(window).width() / 2
        });
      }

      // lightboxOpen() - triggered by 'Assemble the Lightbox'

      function lightboxOpen() {
        // if overlay not already visible (i.e. not during lightbox-group) then implement lightboxOverlay and lightboxLoading
        var overlayVisible;
        if ($('.lightbox-overlay').is(':visible')) {
          overlayVisible = 'true';
        }
        if (overlayVisible !== 'true' || overlayVisible === null) {
          lightboxOverlay();
          lightboxLoading();
        }
        // Disable right-click for all lightbox functions
        $('.lightbox-overlay, .lightbox-loading, .lightbox').bind('contextmenu', function () {
          return false;
        });
        // Get img width and height (any oversized images are rendered smaller)
        $('.lightbox img').load(function () {
          $(this).css({
            maxWidth: $(window).width() * 0.8,
            maxHeight: $(window).height() * 0.8
          });
          var imageWidth = $('.lightbox img').width(),
            imageHeight = $('.lightbox img').height();
          //          $('.lightbox-title').css({
          //            width: imageWidth - 170
          //          });
          // Animate opening the lightbox
          $('.lightbox').css({
            top: $(window).height() / 2,
            left: '50%'
          }).animate({
            opacity: 1,
            marginLeft: -((imageWidth + 20) / 2),
            marginTop: -((imageHeight + 90) / 2),
            width: (imageWidth + 20),
            height: (imageHeight + 90)
          }, 500, function () {
            // Add lightbox Content to lightbox after opening
            $('.lightbox-title, .lightbox-nav, .lightbox img').fadeTo(500, 1);
          });
          // Close the lightbox - by clicking #close (X), or by clicking the overlay, or by resizing the window. (This function must be within lightboxOpen() or else the closing animation doesn't work.)
          $('#close').click(function () {
            $('.lightbox-loading, .lightbox-title, .lightbox-nav, .lightbox img').remove();
            $('.lightbox').animate({
              left: '50%',
              top: $(window).height() / 2,
              marginLeft: (imageWidth / 2),
              marginTop: (imageHeight / 2),
              width: -(imageWidth + 20),
              height: -(imageHeight + 60)
            }, 500, function () {
              $('.lightbox').remove();
            });
            $('.lightbox-overlay').delay(250).fadeTo(500, 0, function () {
              $('.lightbox-overlay').remove();
            });
          });
          // If window is resized (or phone/tablet rotated), this also clicks #close (X) 
          $(window).resize(function () {
            $('#close').click();
          });

        }); // End of LightboxOpen()
      }

      // Assemble the lightbox (all starting at opacity:0 in the stylesheet)

      $(this).click(function () {
        var dataLightbox = $(this).attr('data-lightbox'),
          dataLightboxCount = $('[data-lightbox="' + dataLightbox + '"]').size(),
          index = $('[data-lightbox="' + dataLightbox + '"]').index(this),
          href = $(this).attr('href'),
          title = $(this).prop('title');

        if (title === 'undefined' || title === 'false') {
          $('<div class="lightbox"><div class="lightbox-nav"><a id="close"><i class="fa fa-times"></i></a></div>' + '<img src=' + href + ' /><div class="lightbox-title" style="height:20px"></div></div>').appendTo('body');
        } else {
          $('<div class="lightbox"><div class="lightbox-nav"><a id="close"><i class="fa fa-times"></i></a></div>' + '<img src=' + href + ' /><div class="lightbox-title"><span>' + title + '</span></div></div>').appendTo('body');
        }
        // Append buttons and image counter if this data-lightbox="lightbox-group" is > 1
        if ((dataLightbox.match('group') || dataLightbox.match('Group')) && dataLightboxCount > 1) {
          $('<a id="prev"><i class="fa fa-arrow-left"></i></a><span id="count">' + parseInt(index + 1, 10) + ' / ' + dataLightboxCount + '</span><a id="next"><i class="fa fa-arrow-right"></i></a>').appendTo('.lightbox-nav');
        }
        // Inject class="selected" and use this to determine what #prev and #next actually link to
        $('[data-lightbox="' + dataLightbox + '"]').filter('.selected').removeClass('selected');
        $(this).addClass('selected');
        $('#prev').click(function () {
          $('.lightbox').fadeTo(250, 0, function () {
            $('.lightbox').remove();
          });
          setTimeout(function () {
            var prev = $('[data-lightbox="' + dataLightbox + '"]').eq(index - 1);
            if (!prev.size()) {
              prev = $('[data-lightbox="' + dataLightbox + '"]').eq(0);
            }
            if (prev.size()) {
              prev.click();
            }
          }, 500);
          return false;
        });
        $('#next').click(function () {
          $('.lightbox').fadeTo(250, 0, function () {
            $('.lightbox').remove();
          });
          setTimeout(function () {
            var next = $('[data-lightbox="' + dataLightbox + '"]').eq(index + 1);
            if (!next.size()) {
              next = $('[data-lightbox="' + dataLightbox + '"]').eq(0);
            }
            if (next.size()) {
              next.click();
            }
          }, 500);
          return false;
        });
        // Start lightbox
        lightboxOpen();
        return false; // Prevents the image-link being opened in the browser
      });
    });
    return this;
  };


}(jQuery));