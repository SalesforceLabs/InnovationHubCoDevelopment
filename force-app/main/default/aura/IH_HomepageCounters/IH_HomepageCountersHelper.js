({
	getIdeaCount : function(component, event) {
		// My Ideas
		var action = component.get('c.getMyIdeas');
        action.setCallback(this, function(result){
            component.set("v.myIdeas", result.getReturnValue());
        });
        $A.enqueueAction(action);
	},
    
    getMyEventsCount : function(component, event) {
        // my Events
		var action_myEvents = component.get('c.getMyEvents');
        action_myEvents.setCallback(this, function(result){
            component.set("v.myEvents", result.getReturnValue());
        });
        $A.enqueueAction(action_myEvents);
    },
    
    setSelectedRadio : function(component, event, theRadio) {
        console.log('theRadio: ' + theRadio);
        
        var appEvent = $A.get("e.c:IH_Radio_Selected");
        appEvent.setParams({
            "radioSelected" : theRadio
        });
        appEvent.fire();
    },
    
    getFavDemoCount : function(component, event) {
        // fav Demos
		var action_favDemos = component.get('c.getFavDemos');
        action_favDemos.setCallback(this, function(result){
            component.set("v.favDemos", result.getReturnValue());
            $A.util.addClass(component.find('myDemoSpinner'), "slds-hide");
        });
        $A.enqueueAction(action_favDemos);
    },
    
    getFavIdeaCount : function(component, event) {
        // Fav Ideas
		var action_favIdeas = component.get('c.getFavIdeas');
        action_favIdeas.setCallback(this, function(result){
            component.set("v.favIdeas", result.getReturnValue());
            $A.util.addClass(component.find('mySpinner'), "slds-hide");
        });
        $A.enqueueAction(action_favIdeas);
    },
    
    navigateToURL : function(component, event, theURL) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
          "url": theURL
        });
        urlEvent.fire(); 
    }
    
})