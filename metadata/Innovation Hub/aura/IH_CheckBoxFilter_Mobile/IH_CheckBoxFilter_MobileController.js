({
    doInit: function(cmp) {
        var action = cmp.get("c.getRecordTypeRadio");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var theRecordTypeList = [];
                var result = response.getReturnValue();
                var industryMap = [];
                industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All'});
                industryMap.push({label: $A.get("$Label.c.Favourite_Ideas_Label"), value: 'Favourite Submissions'});
                
                for(var key in result){
                    industryMap.push({label: key, value: result[key]});
                }
                industryMap.push({label: $A.get("$Label.c.my_Submissions_Filter_Label"), value: 'My Submissions'});
                industryMap.push({label: $A.get("$Label.c.Filter_Popular_Idea"), value: 'Popular Ideas'});
                
                
                cmp.set("v.listOfRecordTypes", industryMap);
            }
        });
        $A.enqueueAction(action);
        
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
        
        if(sParameterName[1] == 'mySubmissions'){
            console.log('Param value: '+sParameterName[1]);
            cmp.set('v.value', 'My Submissions');
            
            var filterChangedEvent = cmp.getEvent("filterChangedEvent");
            console.log('EVENT: ' + filterChangedEvent);
            
            var changeValue = 'My Submissions';
            var checkedList = [];
            var theCustomRadioSelected = '';
            checkedList.push(changeValue);
            
            filterChangedEvent.setParams({
                "filterName" : 'Type',
                "selectedFilters" : checkedList
            });
            filterChangedEvent.fire();
        }
        
        else if(sParameterName[1] == 'favouriteSubmissions'){
            console.log('Param value: '+sParameterName[1]);
            cmp.set('v.value', 'Favourite Submissions');
            
            var filterChangedEvent = cmp.getEvent("filterChangedEvent");
            console.log('EVENT: ' + filterChangedEvent);
            
            var changeValue = 'Favourite Submissions';
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
        
        var industryMap = component.get("v.listOfRecordTypes");
        
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