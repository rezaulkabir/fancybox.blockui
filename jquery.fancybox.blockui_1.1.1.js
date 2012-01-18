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
				: fixed a bug regarding the content. the m_html was declared but I was using html var which does not exist
				  added feature 
				  	a. show html content as a message. Parameter name: html
				  	b. set border color. param name: borderColor
				  	c. set background color. param name: backgroundColor
				  	d. message tempalte boxes. param name: messageType. Options are: none, info, warning, success, error
				  

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
					
					timeoutId	: null,
					timeout		: false,
					scrolToTop	: false,
					m_hideActivity: false,
					m_onClosed	: false,
					m_onComplete: false,
					m_onStart	: false,
					m_backgroundColor: 'white',
					m_borderColor: 'white',
					m_html		: false, 
					m_messageType: 'none',
					
					m_originalBorderColor: 'white',
					m_originalbackgroundColor: 'white',

					onStart: function(scrollToTop, timeout) {
				
									
									if (fancyboxBlockUI.timeout) {
									
										fancyboxBlockUI.timeoutId = window.setTimeout(function(){$.fancybox.close();}, fancyboxBlockUI.timeout);
									}
									
									
									//console.log('onStart');
									if (fancyboxBlockUI.scrollToTop) window.parent.scroll(0,0);

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
					
									console.log('[onClosed]');
									$.fancybox.hideActivity();

									if (fancyboxBlockUI.timeoutId) {
									
										window.clearTimeout (fancyboxBlockUI.timeoutId);
									}	
									
									//console.log(fancyboxBlockUI.m_originalBorderColor + ':' + fancyboxBlockUI.m_originalbackgroundColor);							
									$('#fancybox-content').css('border-color', fancyboxBlockUI.m_originalBorderColor);
									$('#fancybox-outer').css('background-color', fancyboxBlockUI.m_originalbackgroundColor);
									$('#fancybox-outer').show();
	
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
										//'transitionIn'		: 'none',
										//'transitionOut'		: 'none',
										'hideOnContentClick': false,
										'hideOnOverlayClick': true,
										'centerOnScroll'	: true,
										'enableEscapeButton': true,

										'onClosed'			: null,
										'onComplete'		: null,
										'onStart'			: null,
										
										'hideActivity'		: false,
										'scrollToTop'		: false,
										'timeout'			: false,
										'html'				: false,
										'backgroundColor'	: 'white',
										'borderColor'		: 'white',
										'messageType'		: 'none'
										
										
									}
									
									$.extend(defaults, params);
									
									fancyboxBlockUI.m_onClosed 		= this.validateDataType(defaults.onClosed, 'function');
									fancyboxBlockUI.m_onComplete	= this.validateDataType(defaults.onComplete, 'function');
									fancyboxBlockUI.m_onStart 		= this.validateDataType(defaults.onStart, 'function');
									
									fancyboxBlockUI.m_hideActivity 	= this.validateDataType(defaults.hideActivity, 'boolean'); 
									fancyboxBlockUI.scrollToTop		= this.validateDataType(defaults.scrollToTop, 'boolean'); 
									fancyboxBlockUI.timeout 		= this.validateDataType(defaults.timeout, 'number');
	 								fancyboxBlockUI.m_html 			= defaults.html;
	 								fancyboxBlockUI.m_backgroundColor = defaults.backgroundColor;
	 								fancyboxBlockUI.m_borderColor 	= defaults.borderColor;
	 								fancyboxBlockUI.m_messageType	= defaults.messageType;
										
									// bring control back to this plugin. 
									var fixedParams = {
									
										'onStart'			: this.onStart,
										'onComplete'		: this.onComplete,
										'onClosed'			: this.onClosed
									};
									
									$.extend(defaults, fixedParams);									
									
									
									// stop closing ovelay when user clicks on activity animation 
									$('#fancybox-loading').click(function(){
									
										$('#fancybox-loading').css('display','block');
									});
									
									if (fancyboxBlockUI.m_messageType != 'none') {
									
										if (fancyboxBlockUI.m_html) {
										
											$('#fancybox_messagebox_'+fancyboxBlockUI.m_messageType).html(fancyboxBlockUI.m_html);	
										}
										
										fancyboxBlockUI.m_html = $('#fancybox_messagebox_'+fancyboxBlockUI.m_messageType).parent().html();
									}
									
									
									console.log('[blockUI] html:' + fancyboxBlockUI.m_html);
									if (!fancyboxBlockUI.m_html) {
										
										$('#fancybox-outer').hide();
										
									} else {
										
										// hide activity animation if hideActivity param is not explicitly defined for showing html content
										if (typeof params.hideActivity != 'boolean') {
										
											fancyboxBlockUI.m_hideActivity = true;
										}
										// make this visible to show the html content
										$('#fancybox-outer').show();
									
									}
									
									
									
									
									// remove items that fancybox does not recognize - a precausion 
									delete defaults.hideActivity;
									delete defaults.timeout;
									delete defaults.scrollToTop;
									delete defaults.html;
									delete defaults.backgroundColor;
									delete defaults.borderColor;
									delete defaults.messageType;
									

									console.log('[blockUI] show');
									fancyboxBlockUI.m_originalBorderColor = $('#fancybox-content').css('border-color');
									fancyboxBlockUI.m_originalbackgroundColor = $('#fancybox-outer').css('background-color');

									$('#fancybox-content').css('border-color', fancyboxBlockUI.m_borderColor);
									$('#fancybox-outer').css('background-color', fancyboxBlockUI.m_backgroundColor);

									if (fancyboxBlockUI.m_html) {
									
										$.fancybox(fancyboxBlockUI.m_html, defaults);									
									
									} else {
									
										$.fancybox(defaults);	
									}
					
					}, // end blockUI
					
					unblockUI: function(){
					
							
							this.close();
							//$('#fancybox-outer').show();
	
					} // end unblockUI
		
		
		};
		
		
		
		var css = '<style type="text/css">.fancybox_messagebox{border: 1px solid;margin: 10px 0px;padding:15px 10px 15px 50px;background-repeat: no-repeat;background-position: 10px center;}.fancybox_info{color: #00529B;background-color: #BDE5F8;background-image: url(data:image/png;base64,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);}.fancybox_success{color: #4F8A10;background-color: #DFF2BF;background-image:url(data:image/png;base64,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);}.fancybox_warning {color: #9F6000;background-color: #FEEFB3;background-image: url(data:image/png;base64,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);}.fancybox_error{color: #D8000C;background-color: #FFBABA;background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFT0lEQVRYw81WaU9VVxTFkJL6RRQV9Q80RmNwRHHEeQBxhKg4IKKoyCDOGnGIBjXYvsbwIMYhgWgYPkDQoIg29lPTpN/apolNTDSkUG30Tm9Cyu5a5737RHiAD0gsycrl3XvOWmvvs8/ZJ0JEIr4kIv4XBnLGjPlcJADFwEPgF+D3wPNh4H3C53KFYyAKKAJay5ctk5/PnpWX5eXSdu+evK2ulrbKSnlZWio/nTolZUuWCMcFxkcNhYHCggkTpHH/fjEaGsT37Jn4nj71o7lZfE+eiK+pSXyPH4vv0SPxNTaKBlMPMjIkf/x4mikcjAEHI3pXWxsU89bViefuXXE7neJyOMRVUuIH/neXlYnn/n3x1tercW9u35bSRYtowjEQA876XbvEw6gAD9LsunZNXJcuieviRbHOnxfr3DmxsBzWmTNiIf3WyZNiHT+u/nffuCHeqipxw1Dt5s004QzHgKNuxw6VTm9NjbiuXvULFhV9KnjihJjHjol59KiYhYViFhSImZcn5qFDYh48KObhw+JBbXgqKqR6/foemejNQCHT5kEaPXfu+AVPn/ZHR0FbDORmfr6Yubl+wQMHxMjOFmPfPjGyssTYvVsM1AHhunxZrJs3xREf/0lNhDIQxcJ5C2EPJqh0IkILghYELVswJ0cJmhA0IWhC0LQFd+4UY/t2MbZtE2PrVjHS0sRITRUXstdaXCz548aJvTtCGbjQgNR7UDxK1BZkOm3BvXvF3LPnY4S2YHq6GFu2KEEdgvqmTaJv2CA6Uq+npCiwdmrXrqWBC6EMRObFxop265ZYR46EFkRRKkGKMcK+BJOTRU9KEm3VKtFWrhRtxQr1/h8Uce7YsTQR2d1A0u3ly8V95YoY3QXtlEJQ700QYkpw9eqgoIZDS8M21hYvFi0xUbSFC1VgzjlzaCCpu4HrP+KwMTMzxewiaK+hAUEDggYEDTvCNWtEh6AOQZ0RQlCHoA5BPSCoLVgg2vz5os2dKxqEdbxrAh/1uht4/gIVrkQpiL1rbNyoBFWEWLugKMUoRJF58/zkCQlKQEOlv585U97PmOHH9OkfMW2aev6KOqNedwN//sV9zCgZFaOAW53ks2aJBlJt6lTR4uIGBR0GXiNI6nU38KoFURqIQINTJTbUAC/5W5BJ6vXIwGuk1kRKdUYLp8rIUAF85CU/dUJl4PlvS5eKC+tqslgwmOkaMlAcvOSnTqgacDSjYt3YtxbW3pg9229iiEA+8pKfOtTrcQ6Uokh8qHo3UmQhVVwvAwU4aICHfOT1rlsn1Al1DkTyhHqHXeCFCRfSZGIH0LkyMlBgPnnIR17y93YSql5Qhb3bjkPIi71vYSsGTQwQnE8e8pG3BsvRWy9Q3ZD9oA37tB2noaerCRRQuLDFyUM+8pK/r26o7gPXJ06UdrTZD+gF9nJYOE5JaOLE6xcUxng77eQhH3n7uw8Eb0QVWL9OtOIONCYfjmY3znsLFxXu4z7F8Z3jON6H45zzyVPhv4w4wroTViKNHbgX/Isbzwf0fi8akhvHtMoI9jO3VRD4zff8znEcz3mcX+nvfmHdCSPwF5k9erSzZNIkeYMuKbgddaJXdCCV7WjRPqwnI6QYn/zN9/zOcRzPed9OnizkIV+4Br4CYlNHjvyOhVPDXk5i3A1tdOK61okOymfX9xzH8ZzH+eQh34AMAPFfDxuWlhId3YBITMeUKdKENP+BlvoKd8FWRMknf/M9v3Mcx3Me5w/UQCQQDXwDJAKpQFbc8OHfJ48Y8UP6qFEvMmJiWjJjYv7mk7/5nt85LjA+MTA/ut8l+JL4DwtxyllDb+BlAAAAAElFTkSuQmCC);}</style>';
		var infoBox = '<div style="display:none"><div id="fancybox_messagebox_info" class="fancybox_messagebox fancybox_info">Info message</div></div>';
		var successBox = '<div style="display:none"><div id="fancybox_messagebox_success" class="fancybox_messagebox fancybox_success">Successful operation message</div></div>';
		var warningBox = '<div style="display:none"><div id="fancybox_messagebox_warning" class="fancybox_messagebox fancybox_warning">Warning message</div></div>';
		var errorBox = '<div style="display:none"><div id="fancybox_messagebox_error" class="fancybox_messagebox fancybox_error">Error message</div</div>';
		
		$('body').append(css, infoBox, successBox, warningBox, errorBox );
		$.extend(true, $.fancybox, fancyboxBlockUI);
	
	
	
	
});
