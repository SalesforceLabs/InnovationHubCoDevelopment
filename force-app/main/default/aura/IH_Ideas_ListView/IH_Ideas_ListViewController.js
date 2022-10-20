({
    doInit : function(component, event, helper) {
        helper.loadCategories(component,helper);
      
        //console.log('Custom Field Selected: ' + component.get('v.CustomField'));
        
        /*var sPageURL = decodeURIComponent(window.location.search.substring(1)); //You get the whole decoded URL of the page.
        console.log('sPageURL: ' + sPageURL);
        var sURLVariables = sPageURL.split('&'); //Split by & so that you get the key value pairs separately in a list
        console.log('sURLVariables: ' + sURLVariables);
        var sParameterName;
        
        var i;
        
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('='); //to split the key from the value.
            
            if (sParameterName[0] === 'radio') { //lets say you are looking for param name - firstName
                sParameterName[1] === undefined ? 'Not found' : sParameterName[1];
            }
        }
        console.log('sParameterName: ' + sParameterName);*/
        
        if(component.get('v.FilterFieldName1') != null){
            helper.loadCustomPicklist_1(component,helper);
        }
        
        if(component.get('v.FilterFieldName2') != null){
            helper.loadCustomPicklist_2(component,helper);
        }
        if(component.get('v.FilterFieldName3') != null){
            helper.loadCustomPicklist_3(component,helper);
        }
        
        
        //if(sParameterName[1] != 'mySubmissions' && sParameterName[1] != 'favouriteSubmissions'){
            $A.util.removeClass(component.find('mySpinner'), "slds-hide");
            var searchFilters = component.get('v.searchFilters');
            
            var action = component.get('c.getIdeas');
            
            action.setParams({
                "selectedFilter":"Popular",
                "searchFiltersJSON": '[{"filterName":"Type","selectedFilters":["All"]}]',
                "customField": component.get('v.CustomField'),
                "userField": component.get('v.UserField')
            });
            
            action.setCallback(this, function(response) {
                var state = response.getState();
                //console.log('Init callback state: ' + response.getState());
                
                if (state === "SUCCESS") {
                    //console.log('ideas: ', JSON.stringify(response.getReturnValue().ownerQueues));
                    //component.set("v.ownerUsers", response.getReturnValue().ownerUsers); 
                    //component.set("v.ideas", response.getReturnValue()); 
                    helper.loadAllVotes(component,helper,response.getReturnValue());
                    $A.util.addClass(component.find('mySpinner'), "slds-hide");
                }
            });
            $A.enqueueAction(action);
        
        
        //}
    },
    
    filterChanged : function(component, event, helper) {
        //console.log('THE FILTER HAS BEEN FIRED');
        
        var searchFilters =  event.getParam("filterList");
        component.set("v.searchFilters",searchFilters);
        //console.log('Filter: ' + JSON.stringify(searchFilters));
        helper.loadIdeas(component,helper);
    }
})