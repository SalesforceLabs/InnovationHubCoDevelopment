({
    doInit : function(component, event, helper) {
        //Perhaps put if statement around these so not all fired
        var action = component.get('c.getPopularIdea');
        action.setParams({
            "userField": component.get('v.userField')
        });
        action.setCallback(this, function(result){
            //component.set("v.popIdea", result.getReturnValue());
            var ideasList = result.getReturnValue();
            var idea = result.getReturnValue().idea;
            if(idea){
                if(ideasList.ownerUser){
                        if(idea.OwnerId == ideasList.ownerUser.Id){
                            idea.owner = {};
                            idea.owner.Name = ideasList.ownerUser.Name;
                            idea.owner.SmallPhotoUrl = ideasList.ownerUser.SmallPhotoUrl;
                            idea.owner.FullPhotoUrl = ideasList.ownerUser.FullPhotoUrl;
                            idea.owner.MediumPhotoUrl = ideasList.ownerUser.MediumPhotoUrl;
                        }
                        
                }
                
                if(ideasList.ownerQueue){
                        if(idea.OwnerId == ideasList.ownerQueue.Id){
                            idea.owner = {};
                            idea.owner.Name = ideasList.ownerQueue.Name;
                            idea.owner.SmallPhotoUrl = '/img/icon/t4v35/standard/orders_120.png';
                            //idea.owner.FullPhotoUrl = ou.FullPhotoUrl;
                            //idea.owner.MediumPhotoUrl = ou.MediumPhotoUrl;
                        }
                        
                }
                
            };
            //console.log(ideasList);
                        //console.log('IDEA: ' + JSON.stringify(ideasList.idea));

            component.set("v.popIdea", ideasList.idea); 
            
            
            
            
        });
        $A.enqueueAction(action);
        
        
        var action_latestDemo = component.get('c.getLatestDemo');
        
        action_latestDemo.setCallback(this, function(result){
            component.set("v.latestDemo", result.getReturnValue());
        });
        $A.enqueueAction(action_latestDemo);
        
        var action_thePrototype = component.get('c.getThePrototype');
        
        action_thePrototype.setCallback(this, function(result){
            component.set("v.thePrototype", result.getReturnValue());
        });
        $A.enqueueAction(action_thePrototype);
        
        var action_thUserVoice = component.get('c.getThUserVoice');
        
        action_thUserVoice.setCallback(this, function(result){
            component.set("v.theInspiration", result.getReturnValue());
        });
        $A.enqueueAction(action_thUserVoice);
        
        var action_activity = component.get('c.getTheActivity');
        
        action_activity.setCallback(this, function(result){
            component.set("v.theActivity", result.getReturnValue());
        });
        $A.enqueueAction(action_activity);
    },
    
    goToAllIdeas : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/innovation-idea/innohub__Innovation_Idea__c/Recent"
        });
        urlEvent.fire();
    },
    
    goToAllDemos : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/demo/innohub__Demo__c/Recent"
        });
        urlEvent.fire();		
    },
    
    goToAllPrototypes : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/prototype/innohub__Prototype__c/Recent"
        });
        urlEvent.fire();		
    },
    
    goToAllInspirations : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/user-voice/innohub__User_Voice__c/Recent"
        });
        urlEvent.fire();		
    },
    
    goToAllActivities : function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/activity/innohub__Activity__c/Recent"
        });
        urlEvent.fire();		
    }
})