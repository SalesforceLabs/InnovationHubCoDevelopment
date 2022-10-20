({
    doInit : function(component, event, helper) {
        //helper.loadCreator(component, helper);
        
        var today = new Date();
        var monthDigit = today.getMonth() + 1;
        if (monthDigit <= 9) {
            monthDigit = '0' + monthDigit;
        }
        
        var dayDigit = today.getDate()
        if(dayDigit <= 9){
            dayDigit = '0' + dayDigit;
        }
        
        component.set('v.today', today.getFullYear() + "-" + monthDigit + "-" + dayDigit);
        
        if(component.get("v.today") > component.get("v.event.innohub__End__c ")){
            $A.util.addClass(component.find('theEvent'), 'opacityClass');
            console.log('v.today: ' + component.get("v.today"));
            console.log('EndDate: ' + component.get("v.event.innohub__End__c "));  
            $A.util.addClass(component.find('theCountofSpaces'), 'slds-hide');
            console.log('Past event');
        }
        
        else{
            $A.util.removeClass(component.find('theEvent'), 'opacityClass');
            console.log('v.today: ' + component.get("v.today"));
            console.log('EndDate: ' + component.get("v.event.innohub__End__c "));     
            console.log('Future event');
        } 
    },
    
    handleClick : function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.event.Id"),
            "slideDevName": "related"
        });
        navEvt.fire(); 
    }
})