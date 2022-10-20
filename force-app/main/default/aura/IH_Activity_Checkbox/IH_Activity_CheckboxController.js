({
    doInit: function(cmp) {
        var action = cmp.get("c.getRecordTypeRadio");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                
                var theRecordTypeList = [];
                var result = response.getReturnValue();
                console.log('result: ' + result);
                var industryMap = [];
                industryMap.push({label: $A.get("$Label.c.Filter_Type_All"), value: 'All'});
                
                for(var key in result){
                    industryMap.push({label: key, value: result[key]});
                }
                industryMap.push({label: $A.get("$Label.c.my_Activities_Filter_Label"), value: 'My Activities'});
                console.log('industryMap: ' , industryMap);
                cmp.set("v.listOfRecordTypes", industryMap);
                console.log('The Radio Buttons: ', industryMap);
            }
        });
        $A.enqueueAction(action);
    },
    
    handleChange : function(component, event, helper) {
		var changeValue = event.getParam("value");
        var checkedList = [];
        checkedList.push(changeValue);
                    
        var filterChangedEvent = component.getEvent("filterChangedEvent");
        
        filterChangedEvent.setParams({
            "filterName" : 'Type1',
            "selectedFilters" : checkedList
        });
        
        filterChangedEvent.fire();
    }
});