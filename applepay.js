function checkApplePay(){var paymenttype=document.getElementsByName('transaction.paymenttype');var pageform=document.getElementsByClassName("en__component--page");if(paymenttype.length==0)return false;var applepayReady=false;for(var i=0;i<paymenttype[0].length;i++){if(paymenttype[0].options[i].value=='applepay'){applepayReady=true;}}
if(applepayReady){var div=document.createElement("div");div.setAttribute("id","apple-pay");document.getElementsByClassName("en__submit")[0].parentNode.appendChild(div);div.innerHTML='<div id="apple-pay-button"></div><p id="apple-pay-message"></p>';var input=document.createElement("input");input.setAttribute("type","hidden");input.setAttribute("name","PkPaymentToken");pageform[0].appendChild(input);paymenttype[0].addEventListener('change',function(){(paymenttype[0].value=='applepay')?showApplePayBlock():hideApplePayBlock();});(paymenttype[0].value=='applepay')?showApplePayBlock():hideApplePayBlock();document.getElementById('apple-pay-button').addEventListener('click',onPayClicked);}
return applepayReady;}
function showApplePayButton(){document.getElementById('apple-pay-button').hidden=false;document.getElementById('apple-pay-message').hidden=true;}
function hideApplePayButton(){document.getElementById('apple-pay-button').hidden=true;document.getElementById('apple-pay-message').hidden=false;}
function showApplePayBlock(){document.getElementById('apple-pay').className='enabled';document.getElementsByClassName("en__submit")[0].hidden=true;}
function hideApplePayBlock(){document.getElementById('apple-pay').className='disabled';document.getElementsByClassName("en__submit")[0].hidden=false;}
function performValidation(url){return new Promise(function(resolve,reject){var merchantSession={};merchantSession.merchantIdentifier=merchantIdentifier;merchantSession.merchantSessionIdentifier=merchantSessionIdentifier;merchantSession.nonce=merchantNonce;merchantSession.domainName=merchantDomainName;merchantSession.epochTimestamp=merchantEpochTimestamp;merchantSession.signature=merchantSignature;var validationData="&merchantIdentifier="+merchantIdentifier+"&merchantDomain="+merchantDomainName+"&displayName="+merchantDisplayName;var validationUrl='/ea-dataservice/rest/applepay/validateurl?url='+url+validationData;var xhr=new XMLHttpRequest();xhr.onload=function(){var data=JSON.parse(this.responseText);resolve(data);};xhr.onerror=reject;xhr.open('GET',validationUrl);xhr.send();});}
function log(name,msg){var xhr=new XMLHttpRequest();xhr.open('GET','/ea-dataservice/rest/applepay/log?name='+name+'&msg='+msg);xhr.send();}
function sendPaymentToken(token){return new Promise(function(resolve,reject){resolve(true);});}
function onPayClicked(){try{var donationAmount=document.querySelector('input[name="transaction.donationAmt"]:checked').value;if(isNaN(parseFloat(donationAmount)) || donationAmount==''){donationAmount=document.querySelector('input[name="transaction.donationAmt.other"]').value.replace(/[^0-9\.]/g,'');}
var request={supportedNetworks:merchantSupportedNetworks,merchantCapabilities:merchantCapabilities,countryCode:merchantCountryCode,currencyCode:merchantCurrencyCode,total:{label:merchantTotalLabel,amount:donationAmount,type:'final'}}
var session=new ApplePaySession(3,request);session.onvalidatemerchant=function(event){performValidation(event.validationURL).then(function(merchantSession){session.completeMerchantValidation(merchantSession);});}
session.onpaymentauthorized=function(event){sendPaymentToken(event.payment.token).then(function(success){document.getElementsByName("PkPaymentToken")[0].value=JSON.stringify(event.payment.token);document.getElementsByClassName("en__submit")[0].hidden=false;document.getElementsByClassName("en__component--page")[0].submit();});}
session.oncancel=function(event){alert("You cancelled. Sorry it didn't work out.");}
session.begin();}catch(e){alert("Developer mistake: '"+e.message+"'");}}
document.addEventListener('DOMContentLoaded',function(){if(!checkApplePay())return;if(window.ApplePaySession){var promise=ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier);promise.then(function(canMakePayments){if(canMakePayments){showApplePayButton();}else{hideApplePayButton();}});}else{hideApplePayButton();}});
var applePayPaymentOption = document.querySelector('option[value="applepay"]') ? document.querySelector('option[value="applepay"]').cloneNode(true) : null;
document.querySelectorAll('input[name="transaction.recurrpay"]').forEach(function(element) { element.addEventListener('change', function(ev) { if(this.checked) { switch(this.value) { case 'Y': removeApplePayOption(); break; default: addApplePayOption(); break; } } }); });
function addApplePayOption() {
    if(applePayPaymentOption && document.querySelectorAll('option[value="applepay"]').length == 0) {
        document.querySelector('select[name="transaction.paymenttype"]').appendChild(applePayPaymentOption.cloneNode(true));
    }
}
function removeApplePayOption() {
    if(document.querySelector('option[value="applepay"]')) {
        document.querySelector('select[name="transaction.paymenttype"]').removeChild(document.querySelector('option[value="applepay"]'))
    }
}