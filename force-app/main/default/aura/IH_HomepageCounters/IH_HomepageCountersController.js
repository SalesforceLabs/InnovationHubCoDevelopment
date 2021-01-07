({
	doInit : function(component, event, helper) {
        helper.getIdeaCount(component, event);
        helper.getFavIdeaCount(component, event);
        helper.getFavDemoCount(component, event);
        helper.getMyEventsCount(component, event);
	},
  	
	gotoIdeas : function(component, event, helper) {
        //?radio=mySubmissions
        helper.navigateToURL(component, event, '/innovation-idea/innohub__Innovation_Idea__c/Recent?innohub__show=mySubmissions');
        helper.setSelectedRadio(component, event, 'My Submissions');
	},
    
    gotoIdeasFavourite : function(component, event, helper) {
        //?radio=favouriteSubmissions
        helper.navigateToURL(component, event, '/innovation-idea/innohub__Innovation_Idea__c/Recent?innohub__show=liked');
        helper.setSelectedRadio(component, event, 'Favourite Submissions');
	},
    
   
    gotoDemos : function(component, event, helper) {
        helper.navigateToURL(component, event, '/demo/innohub__Demo__c/Recent?radio=favouriteDemos&innohub__show=liked');
        //helper.setSelectedRadio(component, event, 'Favourite Demos');
	}, 
    
    gotoEvents : function(component, event, helper) {
        helper.navigateToURL(component, event, '/event/innohub__Event__c/Recent?radio=myEvents&innohub__show=mySubmissions');
        //helper.setSelectedRadio(component, event, 'My Events');
	},
    
    getIdeaCount : function(component, event, helper) {
        $A.util.removeClass(component.find('mySpinner'), "slds-hide");
        helper.getFavIdeaCount(component, event);
    },
    
    getDemoCount : function(component, event, helper) {
        $A.util.removeClass(component.find('myDemoSpinner'), "slds-hide");
        helper.getFavDemoCount(component, event);
    }
})