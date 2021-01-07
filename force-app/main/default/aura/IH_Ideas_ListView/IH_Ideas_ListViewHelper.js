({
    loadIdeas : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var searchFilters = component.get('v.searchFilters');
        //console.log('FILTER TEST: ' + searchFilters[0].selectedFilters[0]);
        var action = component.get('c.getIdeas');
        
        action.setParams({
            "selectedFilter":"Popular",
            "searchFiltersJSON":JSON.stringify(searchFilters),
            "customField": component.get('v.CustomField'),
            "userField": component.get('v.UserField')
        });
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Test type: ' + JSON.stringify(response.getReturnValue().ideas));
                
                //var ideas = response.getReturnValue();
                //component.set("v.ideas", ideas); 
                //component.set("v.ownerUsers", response.getReturnValue().ownerUsers); 
                this.loadAllVotes(component,helper,response.getReturnValue());
                
            }
        });
        $A.enqueueAction(action);       
    },
    
    loadAllVotes : function(component, helper, ideasList) {
        console.log(' -- Loaded -- ');
        console.log(JSON.stringify(ideasList));
        //var action = component.get('c.checkAllVotes');
        //var ideasList = component.get('v.ideas');
        var searchFilters = component.get('v.searchFilters');
        /*
        var idList = [];
        
        ideasList.forEach(function(idea) {
            idList.push(idea.Id);
        });
        
        //console.log('TE1: ' + idList);        
        
        action.setParams({
            "ideas": idList
        });
        
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //Novartis debug
                //console.log('Load All Votes Success...');
                //console.log('Result: ' + JSON.stringify(ideasList));
                //component.set('v.votes', response.getReturnValue());
                
                ideasList.forEach(function(idea) {
                    //idList.push(idea.Id);
                    
                    if(response.getReturnValue()){
                        response.getReturnValue().forEach(function(query) {
                            //idList.push(idea.Id);
                            //console.log('Enters loop: ' + idea.Id + ' ' + query.Id);
                            if(idea.Id == query.innohub__Innovation_Idea__c){//console.log('The Type 2: ' + idea.innohub__Approval_Status__c);
                                                                             idea.innohub__Vote_Type__c = query.innohub__Vote_Type__c;
                                                                             //console.log('Result;' + idea.Name + ' ' + idea.innohub__Vote_Type__c);
                                                                            }
                        });
                    }
                    
                    
                    if(ideasList.ownerUsers){
                        //Novartis debug
                        //console.log('OwnerUsers Exist');
                        ideasList.ownerUsers.forEach(function(ou) {
                            if(idea.OwnerId == ou.Id){
                                //Novartis debug
                                //console.log('Owner User: ' + ou.Name + ' ,Img: ' + ou.SmallPhotoUrl);
                                idea.owner = {};
                                idea.owner.Name = ou.Name;
                                idea.owner.SmallPhotoUrl = ou.SmallPhotoUrl;
                                idea.owner.FullPhotoUrl = ou.FullPhotoUrl;
                                idea.owner.MediumPhotoUrl = ou.MediumPhotoUrl;
                            }
                            
                        });
                    }
                    
                    if(ideasList.ownerQueues){
                        ideasList.ownerQueues.forEach(function(qu) {
                            if(idea.OwnerId == qu.Id){
                                //Novartis debug
                                //console.log('Owner Queue: ' + qu.Name);
                                idea.owner = {};
                                idea.owner.Name = qu.Name;
                                idea.owner.SmallPhotoUrl = '/img/icon/t4v35/standard/orders_120.png';
                                //idea.owner.FullPhotoUrl = ou.FullPhotoUrl;
                                //idea.owner.MediumPhotoUrl = ou.MediumPhotoUrl;
                            }
                            
                        });  
                    }
                    
                });
                
                //console.log(ideasList);
                
                
            }
            //console.log('New List: ' + JSON.stringify(component.get("v.ideas")));
        });
        
        $A.enqueueAction(action);
        */
        
        
        component.set("v.ideas", ideasList); 
                
                var ideas = ideasList;
                $A.util.addClass(component.find('mySpinner'), "slds-hide");
                //console.log('ideaz : ' + JSON.stringify(ideas));
                if(searchFilters[0]){
                    if(searchFilters[0].selectedFilters[0] == 'My Submissions'){
                        var theIdeas = component.get('v.ideas');
                        //console.log('The Idss: ' + theIdeas);
                        var approved = [], submitted = [], onHold = [];
                        for(var i=0;i<theIdeas.length;i++){
                            if(theIdeas[i].innohub__Approval_Status__c == 'Approved'){
                                approved.push(theIdeas[i]);
                            }
                            else if(theIdeas[i].innohub__Approval_Status__c == 'On Hold'){
                                onHold.push(theIdeas[i]);
                            }
                                else if(theIdeas[i].innohub__Approval_Status__c == 'Submitted'){
                                    submitted.push(theIdeas[i]);
                                }
                        }
                        component.set('v.approvedIdeas', approved);
                        component.set('v.onHoldIdeas', onHold);
                        component.set('v.submittedIdeas', submitted);
                    }
                }else if(searchFilters[1]){
                    if(searchFilters[1].selectedFilters[0] == 'My Submissions'){
                        var theIdeas = component.get('v.ideas');
                        //console.log('The Idss: ' + theIdeas);
                        var approved = [], submitted = [], onHold = [];
                        for(var i=0;i<theIdeas.length;i++){
                            if(theIdeas[i].innohub__Approval_Status__c == 'Approved'){
                                approved.push(theIdeas[i]);
                            }
                            else if(theIdeas[i].innohub__Approval_Status__c == 'On Hold'){
                                onHold.push(theIdeas[i]);
                            }
                                else if(theIdeas[i].innohub__Approval_Status__c == 'Submitted'){
                                    submitted.push(theIdeas[i]);
                                }
                        }
                        component.set('v.approvedIdeas', approved);
                        component.set('v.onHoldIdeas', onHold);
                        component.set('v.submittedIdeas', submitted);
                    }
                }
        
        
        
    },
    
    loadCategories : function(component, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        var action = component.get('c.getPicklistValues');
        action.setParams({
            "picklistAPIName" : "innohub__Category__c"  
        });
        action.setCallback(this, function(response) {
            response.getReturnValue().shift();
            component.set("v.categories",response.getReturnValue());
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
            if(response.getState() === "SUCCESS"){
                if(response.getReturnValue()[0] == 'PICKLIST'){
                    component.set('v.FilterFieldType1' , 'radio');
                    response.getReturnValue().splice(1, 0, $A.get("$Label.c.Filter_Type_All"));
                }else if(response.getReturnValue()[0] == 'MULTIPICKLIST'){
                    component.set('v.FilterFieldType1' , 'checkbox');
                }
                response.getReturnValue().shift();
            }
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
            if(response.getState() === "SUCCESS"){
                if(response.getReturnValue()[0] == 'PICKLIST'){
                    component.set('v.FilterFieldType2' , 'radio');
                    response.getReturnValue().splice(1, 0, $A.get("$Label.c.Filter_Type_All"));
                }else if(response.getReturnValue()[0] == 'MULTIPICKLIST'){
                    component.set('v.FilterFieldType2' , 'checkbox');
                }
                response.getReturnValue().shift();
            }
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
            if(response.getState() === "SUCCESS"){
                if(response.getReturnValue()[0] == 'PICKLIST'){
                    component.set('v.FilterFieldType3' , 'radio');
                    response.getReturnValue().splice(1, 0, $A.get("$Label.c.Filter_Type_All"));
                }else if(response.getReturnValue()[0] == 'MULTIPICKLIST'){
                    component.set('v.FilterFieldType3' , 'checkbox');
                }
                response.getReturnValue().shift();
            }
            
            
            component.set("v.customList_3", response.getReturnValue());
            
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        
        $A.enqueueAction(action);
    }
})