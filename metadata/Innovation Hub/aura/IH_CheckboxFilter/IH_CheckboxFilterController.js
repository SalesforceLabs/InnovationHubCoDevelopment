({
    doInit: function(cmp, event) {
        var action = cmp.get("c.getRecordTypeRadio");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var theRecordTypeList = [];
                var result = response.getReturnValue();
                //console.log('RESULT: ', result);
                var industryMap = [];
                industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All'});
                industryMap.push({label: $A.get("$Label.c.Favourite_Ideas_Label"), value: 'Favourite Submissions'});
                
                for(var key in result){
                    //console.log('RECORD Name: ' + key);
                    //console.log('RECORD Id: ' + result[key]);
                    
                    industryMap.push({label: key, value: result[key]});
                }
                industryMap.push({label: $A.get("$Label.c.my_Submissions_Filter_Label"), value: 'My Submissions'});
                industryMap.push({label: $A.get("$Label.c.Filter_Popular_Idea"), value: 'Popular Ideas'});
                
                cmp.set("v.listOfRecordTypes", industryMap);
            }
        });
        $A.enqueueAction(action); 
        
        /*var sPageURL = decodeURIComponent(window.location.search.substring(1)); //You get the whole decoded URL of the page.
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
        
        else{
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
        }*/
    },
    
    theRadioSelected : function(cmp, event) {
        var message = event.getParam("radioSelected");
        //console.log('theRadio: ',  message);
        
        cmp.set('v.value', message);
        
        /*var filterChangedEvent = cmp.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : theRadio
        });
        filterChangedEvent.fire();*/
    },
    
    handleChange : function(component, event, helper) {
        var changeValue = event.getParam("value");
        var checkedList = [];
        var theCustomRadioSelected = '';
        checkedList.push(changeValue);
        //console.log('checkedList: ' + checkedList);
        
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type',
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    }
});