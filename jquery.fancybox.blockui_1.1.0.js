/*
jquery.fancybox.blockui()	:	version	: 1.1.0
							:	date	: 06-Oct-2011
							: 	author	: Rezaul Kabir
							:	email	: rezaul.kabir@gmail.com
							

This plugin extends fancybox (http://fancybox.net) with UI block and unblock functions with a overlay.

release history	:
v 1.0			: 	first release
v.1.0.1			: 	fixed an issue where if you clicked on the Activity image it would disappeare. 
v.1.1.0			: 	removed previous callback and utilized fancybox callbacks. Now all fancybox callbacks could be used. 
					Renamed the custom parameter names
					solved issue when Activity image is clicked and hideOnOverlayClick is true.


How to Load:

	Load the plugin after Fancybox. 

Default Usage:

	$fancybox.blockUI() : 	Blocks the UI with gray overlay. Default behavior to hide th UI overlay is to click on the overlay. Use fancybox param to 
							override this behavior. 
							
	$fancybox.unblockUI(): 	hides the Blocked overlay
	
	
	
Extended usage with parameters:

	$fancybox.blockUI(parameters)
							
							parameter is optional is an object with arrtibutes and values. You can also pass fancybox parameter to override the
							default behaviors on this plugin.for example, to disable the click functionality that hides the overlay UI use
							 hideOnOverlayClick. parameter object is {hideOnOverlayClick: false}
	
							All standard fancy box parameters could be passed to override the defaul values. 
	
	scrollToTop:			boolean. Before showing the UI overlay, window will be scrolled to top. this is just a simple call to
							window.parent.scroll(0,0)
	
	timeout:				positive integer. Automatically hide the UI overlay after the given timeout milliseconds. use null or ignore if
							do not want to timeout.
							

	hideProgressImage:			booelen value. hides the default activity animation that comes with fancybox
	
	
	
	BlockUI Default parameter values are 
	
	{
		scrollToTop: false,
		timeout: false,
		hideProgressImage: false
	}

*/

;$(function(){
	
	if (!$.fancybox) throw "Fancybox plugin needs to be loaded first";
	
	var fancyboxBlockUI = {
					
					timeoutId: null,
					timeout: false,
					scrolToTop: false,
					hideProgressImage: false,
					m_onClosed: false,
					m_onComplete: false,
					m_onStart: false,
					m_fancyboxContent:'<div></div>', 
					onStart: function(scrollToTop, timeout) {
				
									//console.log('onStart');
									if (fancyboxBlockUI.scrollToTop) window.parent.scroll(0,0);
									
									if (fancyboxBlockUI.timeout) {
										fancyboxBlockUI.timeoutId = window.setTimeout(function(){$.fancybox.close();}, fancyboxBlockUI.timeout);
									}

									if (fancyboxBlockUI.m_onStart)																																fancyboxBlockUI.m_onStart();

					},
					onComplete: function() {

									//console.log('onComplete');

									if (!fancyboxBlockUI.hideProgressImage) 
										$.fancybox.showActivity();

									if (fancyboxBlockUI.m_onComplete)																																fancyboxBlockUI.m_onComplete();

					},
					onClosed: function() {
					

									//console.log('onClosed: timeoutId=' + fancyboxBlockUI.timeoutId);
									
									$.fancybox.hideActivity();


									if (fancyboxBlockUI.timeoutId) 
										window.clearTimeout (fancyboxBlockUI.timeoutId);
					
									if (fancyboxBlockUI.m_onClosed)																																fancyboxBlockUI.m_onClosed();
					},
					validateDataType: function(func, datatype){
									
									return (func)? ((typeof func == datatype) ? func :false) :false;
					
					},
					blockUI: function(params) {
					
									params = (params)?params:{};
									if (typeof params != 'object') params = {};

									
									fancyboxBlockUI.m_onClosed 		= this.validateDataType(params.onClosed, 'function');
									fancyboxBlockUI.m_onComplete	= this.validateDataType(params.onComplete, 'function');
									fancyboxBlockUI.m_onStart 		= this.validateDataType(params.onStart, 'function');
									
									fancyboxBlockUI.hideProgressImage 	= this.validateDataType(params.hideProgressImage, 'boolean'); 
									fancyboxBlockUI.scrollToTop		= this.validateDataType(params.scrollToTop, 'boolean'); 

									fancyboxBlockUI.timeout 		= this.validateDataType(params.timeout, 'number');
									
	 								fancyboxBlockUI.fancyboxContent = (params.fancyboxContent)?params.fancyboxContent:fancyboxBlockUI.fancyboxContent;
	 								
									delete params.hideProgressImage;
									delete params.timeout;
									delete params.scrollToTop;
									
									
									// can be overridden by user
									var defaults = {

							       		'autoDimensions'	: false,
										'height'     		: 'none',
										'width'				: 'none',
										'transitionIn'		: 'none',
										'transitionOut'		: 'none',
										'hideOnContentClick': false,
										'hideOnOverlayClick': true,
										'transitionIn'		: 'none',
										'transitionOut'		: 'none',
										'centerOnScroll'	: true,
										'enableEscapeButton': false
									};
									
									var fixedParams = {
									
										'onStart'			: fancyboxBlockUI.onStart,
										'onComplete'		: fancyboxBlockUI.onComplete,
										'onClosed'			: fancyboxBlockUI.onClosed
									};
									
									$.extend(defaults, params, fixedParams);
									
									$('#fancybox-outer').hide();
									$('#fancybox-loading').click(function(){
									
										//console.log('fancybox-loading click event');
										$('#fancybox-loading').css('display','block');
									});

									$.fancybox(fancyboxBlockUI.fancyboxContent, defaults); // div added to force inline type for safety reasons
					
					}, // end blockUI
					
					unblockUI: function(){
					
							$.fancybox.close();

					} // end unblockUI
		
		
		};
		
		
		$.extend(true, $.fancybox, fancyboxBlockUI);
	
	
	
	
});
