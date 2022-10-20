({
    doInit : function(component, event, helper) {
        var industryMap = [];
        industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All Events'});
        industryMap.push({label: $A.get("$Label.c.my_Events_Filter_Label"), value: 'My Events'});
        component.set("v.listOfRecordTypes", industryMap);


        var sPageURL = decodeURIComponent(window.location.search.substring(1)); //You get the whole decoded URL of the page.
        var sURLVariables = sPageURL.split('&'); //Split by & so that you get the key value pairs separately in a list
        var sParameterName;
        var i;
        
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('='); //to split the key from the value.
            
            if (sParameterName[0] === 'firstName') { //lets say you are looking for param name - firstName
                sParameterName[1] === undefined ? 'Not found' : sParameterName[1];
            }
        }
                
        if(sParameterName[1] == 'myEvents'){
            console.log('Param value: '+sParameterName[1]);
            component.set('v.value', 'My Events');
            
            var filterChangedEvent = component.getEvent("filterChangedEvent");
            console.log('EVENT: ' + filterChangedEvent);
            
            var changeValue = 'My Events';
            var checkedList = [];
            var theCustomRadioSelected = '';
            checkedList.push(changeValue);
            
            filterChangedEvent.setParams({
                "filterName" : 'Type',
                "selectedFilters" : checkedList
            });
            filterChangedEvent.fire();
        }
    },
    
    handleChange : function(component, event, helper) {
		var changeValue = event.getParam("value");
        var checkedList = [];
        checkedList.push(changeValue);
                    
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    },
    
    theRadioSelected : function(component, event, helper) {
        var theRadio = event.getParam("radioSelected");
        var checkedList = [];
        component.set('v.value', theRadio);
        checkedList.push(theRadio);
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        filterChangedEvent.fire();
    }
});