/*
jquery.fancybox.blockui()	:	version	: 1.1.1
							:	date	: 16-Jan-2012
							: 	author	: Rezaul Kabir
							:	email	: rezaul.kabir@gmail.com
							

This plugin extends fancybox (http://fancybox.net) with UI block and unblock functions with a overlay.

release history	:
v 1.0			: 	first release
v.1.0.1			: 	fixed an issue where if you clicked on the Activity image it would disappeare. 
v.1.1.0	(date: 06-Oct-2011)		
				: 	removed previous callback and utilized fancybox callbacks. Now all fancybox callbacks could be used. 
					Renamed the custom parameter names
					solved issue when Activity image is clicked and hideOnOverlayClick is true.
v.1.1.1	(date: 16-Jan-2012)		
				: fixed a bug regarding the content. the m_fancyboxContent was declared but I was using fancyboxContent var which does not exist
				  added feature to show html content as a message

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
							However, the functions onStart, onComplete, onCleanup, onClosed cannot be overridden. 
	
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
					m_hideActivity: false,
					m_onClosed: false,
					m_onComplete: false,
					m_onStart: false,
					fancyboxContent:'<div></div>', 
					onStart: function(scrollToTop, timeout) {
				
									//console.log('onStart');
									if (fancyboxBlockUI.scrollToTop) window.parent.scroll(0,0);
									
									if (fancyboxBlockUI.timeout) {
										fancyboxBlockUI.timeoutId = window.setTimeout(function(){$.fancybox.close();}, fancyboxBlockUI.timeout);
									}

									if (typeof fancyboxBlockUI.m_onStart == 'function') {
									
										fancyboxBlockUI.m_onStart();
									}	
					},
					onComplete: function() {

									//console.log('onComplete');

									if (!fancyboxBlockUI.m_hideActivity) 
										$.fancybox.showActivity();

									if (typeof fancyboxBlockUI.m_onComplete == 'function') {
											
										fancyboxBlockUI.m_onComplete();		
									}	
	
					},
					onClosed: function() {
					

									//console.log('onClosed: timeoutId=' + fancyboxBlockUI.timeoutId);
									
									$.fancybox.hideActivity();


									if (fancyboxBlockUI.timeoutId) 
										window.clearTimeout (fancyboxBlockUI.timeoutId);
					
									if (typeof fancyboxBlockUI.m_onClosed == 'function') {
									
										fancyboxBlockUI.m_onClosed();	
									}
					},
					validateDataType: function(func, datatype){
									
									return (func)? ((typeof func == datatype) ? func :false) :false;
					
					},
					blockUI: function(params) {
					
									params = (params)?params:{};
									if (typeof params != 'object') params = {};

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
										'enableEscapeButton': false,

										'onClosed'			: null,
										'onComplete'		: null,
										'onStart'			: null,
										
										'hideActivity'		: false,
										'scrollToTop'		: false,
										'timeout'			: false,
										'fancyboxContent'	: false
										
										
									}
									
									$.extend(defaults, params);
									
									fancyboxBlockUI.m_onClosed 		= this.validateDataType(defaults.onClosed, 'function');
									fancyboxBlockUI.m_onComplete	= this.validateDataType(defaults.onComplete, 'function');
									fancyboxBlockUI.m_onStart 		= this.validateDataType(defaults.onStart, 'function');
									
									fancyboxBlockUI.m_hideActivity 	= this.validateDataType(defaults.hideActivity, 'boolean'); 
									fancyboxBlockUI.scrollToTop		= this.validateDataType(defaults.scrollToTop, 'boolean'); 
									fancyboxBlockUI.timeout 		= this.validateDataType(defaults.timeout, 'number');
	 								fancyboxBlockUI.fancyboxContent = defaults.fancyboxContent;
	 								
									// remove items that fancybox does not recognize - a precausion 
									delete defaults.hideActivity;
									delete defaults.timeout;
									delete defaults.scrollToTop;
									delete defaults.fancyboxContent;
									

									
									// bring control back to this plugin. 
									var fixedParams = {
									
										'onStart'			: this.onStart,
										'onComplete'		: this.onComplete,
										'onClosed'			: this.onClosed
									};
									
									$.extend(defaults, fixedParams);									
									
									if (!fancyboxBlockUI.fancyboxContent) {
										
										$('#fancybox-outer').hide();
										
									} else {
										
										// hide activity animation if hideActivity param is not explicitly defined for showing html content
										if (typeof params.hideActivity != 'boolean') {
										
											fancyboxBlockUI.m_hideActivity = true;
										}
										
										$('#fancybox-outer').show();
									
									}
									
									// stop closing ovelay when user clicks on atvity animation 
									$('#fancybox-loading').click(function(){
									
										$('#fancybox-loading').css('display','block');
									});
									//alert(fancyboxBlockUI.fancyboxContent);
									$.fancybox(fancyboxBlockUI.fancyboxContent, defaults); // div added to force inline type for safety reasons
					
					}, // end blockUI
					
					unblockUI: function(){
					
							$.fancybox.close();

					} // end unblockUI
		
		
		};
		
		
		$.extend(true, $.fancybox, fancyboxBlockUI);
	
	
	
	
});
