({
    loadDemos : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters')
        
        var action = component.get('c.getDemos');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON":JSON.stringify(searchFilters)
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                /*var demos = response.getReturnValue();
                component.set("v.demos", demos); 
                */
                this.loadAllVotes(component,helper,response.getReturnValue());
                
            }
        });
        
        $A.enqueueAction(action);        
    },
    
    loadAllVotes : function(component, helper, demoList) {
        var action = component.get('c.checkAllVotes');
        //var ideasList = component.get('v.ideas');
        var idList = [];
        
        demoList.forEach(function(demo) {
            idList.push(demo.Id);
            
        });
        
        //console.log(idList);        
        
        action.setParams({
            "demos": idList
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //console.log('Success...');
                //component.set('v.votes', response.getReturnValue());
                if(response.getReturnValue()){
                    demoList.forEach(function(demo) {
                        //idList.push(idea.Id);
                        response.getReturnValue().forEach(function(query) {
                            //idList.push(idea.Id);
                            //console.log('Enters loop: ' + idea.Id + ' ' + query.Id);
                            if(demo.Id == query.innohub__Demo__c){
                                demo.innohub__Vote_Type__c = query.innohub__Vote_Type__c;
                                //console.log('Result;' + idea.Name + ' ' + idea.innohub__Vote_Type__c);
                            }
                        });
                    });
                }
                //console.log(ideasList);
                component.set("v.demos", demoList); 
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
                
            }
            //console.log('New List: ' + JSON.stringify(component.get("v.demos")));
        });
        
        $A.enqueueAction(action);
    },
    
    loadCategories : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : "innohub__Demo_Type__c"  
        });
        action.setCallback(this, function(response) {
            component.set("v.categories",response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    loadClouds : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : "innohub__Clouds_Involved__c"  
        });
        action.setCallback(this, function(response) {
            component.set("v.clouds",response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    loadTheCategories : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : "innohub__Category__c"  
        });
        
        action.setCallback(this, function(response) {
            component.set("v.theCategories",response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    //Custom picklist
    loadCustomPicklist_1 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName1')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_1", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    
    //Custom picklist 2
    loadCustomPicklist_2 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName2')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_2", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    },
    //Custom picklist 3
    loadCustomPicklist_3 : function(component, helper) {
        
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        
        action.setParams({
            "picklistAPIName" : component.get('v.FilterFieldName3')
        });
        
        action.setCallback(this, function(response) {
            component.set("v.customList_3", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    }
})