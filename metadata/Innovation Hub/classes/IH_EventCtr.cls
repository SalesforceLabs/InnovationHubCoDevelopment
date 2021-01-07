public with sharing class IH_EventCtr {
    
    /* Fitered Class */
    public class Filter{
        public String filterName{get;set;}
        public List<String> selectedFilters{get;set;}
    }
    
    /* Get Fitered innohub__Event__c */
    @AuraEnabled
    public static List<innohub__Event__c> getCampaignes(String selectedFilter, String searchFiltersJSON) {
        //Checking the innohub__Event__c Field Level Security
        String [] campFields = new String [] {'Id', 
            'Name', 
            'innohub__Description__c',
            'innohub__Agenda__c', 
            'innohub__Image__c', 
            'innohub__Start__c', 
            'innohub__End__c', 
            'innohub__Type__c', 
            'innohub__Location__c', 
            'CreatedById',
            'innohub__Contact__c',
            'innohub__Spaces_Available__c',
            'innohub__Registration_Open__c',
            'innohub__Venue__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> campMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : campFields) {
            
            // Check if the user has access to view field
            if (!campMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<innohub__Event__c> theEvents = new List<innohub__Event__c>();
        
        List<filter> filterList  = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
        system.debug('filterList: ' + filterList);
        
        String selectClause = 'SELECT Id, Name, innohub__Description__c, innohub__Agenda__c, innohub__Image__c, innohub__Start__c, innohub__End__c, toLabel(innohub__Type__c), toLabel(innohub__Location__c), CreatedById, innohub__Contact__c, innohub__Spaces_Available__c,innohub__Registration_Open__c, innohub__Venue__c From innohub__Event__c WHERE innohub__Active__c = true ';
        String orderBy='ORDER BY innohub__Start__c DESC';
        String locationClause='';
        String sessionTypeClause='';
        List<String> theType = new List<String>();
        List<String> theLocation = new List<String>();
        List<String> theSessionType = new List<String>();
        String theDate = '';
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type'){
                theType.add(filterList[i].selectedFilters[0]);
                system.debug('Type: ' + filterList[i].selectedFilters[0]);
            }
            else if(filterList[i].filterName == 'innohub__Location__c'){
                theLocation = filterList[i].selectedFilters;
                system.debug('Location: ' + filterList[i].selectedFilters);
                
                if(theLocation.size() != 0){
                    system.debug('theLocations: ' + theLocation);
                    locationClause = 'AND toLabel(innohub__Location__c) IN ' + theLocation;
                    selectClause += locationClause;
                }
            }
            else if(filterList[i].filterName == 'innohub__Type__c'){
                theSessionType = filterList[i].selectedFilters;
                system.debug('SessionTypes: ' + filterList[i].selectedFilters);
                
                if(theSessionType.size() != 0){
                    system.debug('theSessionTypes: ' + theSessionType);
                    sessionTypeClause = 'AND toLabel(innohub__Type__c) IN ' + theSessionType;
                    selectClause += sessionTypeClause;
                }
            }
            else if(filterList[i].filterName == 'Date'){
                theDate = string.join(filterList[i].selectedFilters, ',');
                system.debug('Date: ' + filterList[i].selectedFilters);
            }
            else{
                system.debug('WOOHOO IN ELSE');
                List<String> theCustomList = filterList[i].selectedFilters;
                system.debug('theCustomList: ' + theCustomList);
                
                if(theCustomList.size() != 0){
                    selectClause += 'AND toLabel(' + filterList[i].filterName + ') INCLUDES ' + theCustomList + ' ';
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        if(theType.size() != 0){
            switch on theType[0] {
        		when 'All Events' {
                    system.debug('Type: ALL EVENTS'); 
                }
                when 'My Events' {
                    system.debug('Type: MY EVENTS'); 
                    //Need to check if registered for future events  - show them here
                    List<String> EventRegisteredTrue = new List<String>();
                    List<innohub__Event_Member__c > eventMembers = new List<innohub__Event_Member__c >();
                    eventMembers = [SELECT Id, innohub__Event__c FROM innohub__Event_Member__c WHERE innohub__Attending__c = true AND CreatedById = :userinfo.getuserid()];
                    system.debug('eventMembers: ' + eventMembers);
                    
                    for (innohub__Event_Member__c myEventMember : eventMembers) {
                        EventRegisteredTrue.add('\'' + myEventMember.innohub__Event__c + '\'');
                    }
                    
                    selectClause += 'AND innohub__End__c >= TODAY AND Id IN ' + EventRegisteredTrue;
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        if(theDate != ''){
            switch on theDate {
        		when 'All' {
                    system.debug('Date: ALL'); 
                }
                when 'This Week' {
                    system.debug('Date: THIS WEEK');
                    selectClause += ' AND innohub__Start__c = THIS_WEEK ';
                }
                when 'This Month' {
                    system.debug('Date: THIS MONTH'); 
                    selectClause += ' AND innohub__Start__c = THIS_MONTH ';
                }
                when 'This Quarter' {
                    system.debug('Date: THIS QUARTER'); 
                    selectClause += ' AND innohub__Start__c = THIS_QUARTER ';
                }
            }
        }
        
        try {
            theEvents = Database.query(selectClause  += orderBy);
            System.debug('selectClause: ' + selectClause);
        } catch (Exception e) {
            System.debug(e);
        }
        
        return theEvents;
    }
    
        /* Get available picklist values */

    @AuraEnabled
    public static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues' + picklistAPIName);
        //Check innohub__Event__c 
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the innohub__Event__c  object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Event__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    
     /* Get available picklist labels */
    
    @AuraEnabled
    public static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName: ' + picklistAPIName);
        
        //Check innohub__Event__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the innohub__Event__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        system.debug('Before Schema.getGlobalDescribe()');
        String theLabel = Schema.getGlobalDescribe().get('innohub__Event__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    /* Get Creator*/
    @AuraEnabled
    public static User getCreator(String creatorId) {
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        return [SELECT Id, Name, SmallPhotoUrl FROM User WHERE Id = :creatorId];
    } 
    
    @AuraEnabled
    static public innohub__Event__c getEvent(String recordId){
        //Checking the Campaigns Field Level Security
        String [] campFields = new String [] {'Id', 
            'Name', 
            'innohub__Description__c',
            'innohub__Agenda__c', 
            'innohub__Image__c', 
            'innohub__Start__c', 
            'innohub__End__c', 
            'innohub__Type__c', 
            'innohub__Location__c', 
            'CreatedById',
            'innohub__Contact__c',
            'innohub__Speaker__c',
            'innohub__Spaces_Available__c',
            'innohub__Registration_Open__c',
            'innohub__Venue__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> campMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : campFields) {
            
            // Check if the user has access to view field
            if (!campMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        innohub__Event__c thisEvent = [SELECT Id, Name, innohub__Description__c, innohub__Agenda__c, innohub__Image__c, innohub__Start__c, innohub__End__c, toLabel(innohub__Type__c), toLabel(innohub__Location__c), CreatedById, innohub__Contact__c, innohub__Speaker__c, innohub__Spaces_Available__c, innohub__Registration_Open__c, innohub__Venue__c From innohub__Event__c WHERE Id = : recordID];
        return thisEvent;
    }
    
    @AuraEnabled
    public static innohub__Event_Member__c checkIfEventMember(innohub__Event__c theEvent, User theUser){
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event__c
        String [] innoEventFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : innoEventFields) {
            
            // Check if the user has access to view field
            if (!innoEventMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event_Member__c
        String [] innoEventMemberFields = new String [] {'Id',
            'innohub__Attending__c',
            'CreatedById',
            'innohub__Event__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMemberMap = Schema.SObjectType.innohub__Event_Member__c.fields.getMap();
        
        for (String fieldToCheck : innoEventMemberFields) {
            
            // Check if the user has access to view field
            if (!innoEventMemberMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        User myUser = new User();
        if(theUser == null){
            System.debug('theUser is NULL');
            myUser = [SELECT Id from User WHERE Id = :UserInfo.getUserId()];
            System.debug('myUser: ' + myUser);
        }
        else{
            System.debug('theUser NOT NULL');
            myUser = theUser;
            System.debug('myUser: ' + myUser);
        }
        
        
        innohub__Event_Member__c  myEventMember = [SELECT Id FROM innohub__Event_Member__c WHERE innohub__Event__c = :theEvent.Id AND CreatedById = :myUser.Id AND innohub__Attending__c = true];
        return myEventMember;
    }
    
    @AuraEnabled
    public static innohub__Event_Member__c createEventMember(innohub__Event__c theEvent, User theUser){
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event__c
        String [] innoEventFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : innoEventFields) {
            
            // Check if the user has access to view field
            if (!innoEventMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event_Member__c
        String [] innoEventMemberFields = new String [] {'Id',
            'innohub__Attending__c',
            'CreatedById',
            'innohub__Event__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMemberMap = Schema.SObjectType.innohub__Event_Member__c.fields.getMap();
        
        for (String fieldToCheck : innoEventMemberFields) {
            
            // Check if the user has access to view field
            if (!innoEventMemberMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        
         User myUser = new User();
        if(theUser == null){
            System.debug('theUser is NULL');
            myUser = [SELECT Id from User WHERE Id = :UserInfo.getUserId()];
            System.debug('myUser: ' + myUser);
        }
        else{
            System.debug('theUser NOT NULL');
            myUser = theUser;
            System.debug('myUser: ' + myUser);
        }
        
        innohub__Event_Member__c  myEventMember = new innohub__Event_Member__c();
        
        try{
            myEventMember = [SELECT Id FROM innohub__Event_Member__c WHERE innohub__Event__c = :theEvent.Id AND CreatedById = :myUser.Id];
            myEventMember.innohub__Attending__c = true;
            update myEventMember;
            
        }
        catch(Exception e){
            myEventMember.innohub__Event__c = theEvent.Id;
            myEventMember.innohub__Attending__c = true;
            insert myEventMember;
        } 
        return myEventMember;
    }
    
    @AuraEnabled
    public static innohub__Event_Member__c removeEventMember(innohub__Event__c theEvent){
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event__c
        String [] innoEventFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : innoEventFields) {
            
            // Check if the user has access to view field
            if (!innoEventMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        } 
        
        //Check innohub__Event_Member__c
        String [] innoEventMemberFields = new String [] {'Id',
            'innohub__Attending__c',
            'CreatedById',
            'innohub__Event__c',
            'Name',
            'LastModifiedById'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> innoEventMemberMap = Schema.SObjectType.innohub__Event_Member__c.fields.getMap();
        
        for (String fieldToCheck : innoEventMemberFields) {
            
            // Check if the user has access to view field
            if (!innoEventMemberMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        User myUser = [SELECT Id from User WHERE Id = :UserInfo.getUserId()];
        innohub__Event_Member__c  myEventMember = [SELECT Id FROM innohub__Event_Member__c WHERE innohub__Event__c = :theEvent.Id AND CreatedById = :myUser.Id AND innohub__Attending__c = true];
		myEventMember.innohub__Attending__c = false;
        update myEventMember;
        
        return myEventMember;
    }
    
    @AuraEnabled
    public static innohub__Event__c checkAvailability(Id theEvent) {
        //Checking the innohub__Event__c Field Level Security
        String [] campFields = new String [] {'Id', 
            'Name', 
            'innohub__Agenda__c', 
            'innohub__Image__c', 
            'innohub__Start__c', 
            'innohub__End__c', 
            'innohub__Type__c', 
            'innohub__Location__c', 
            'CreatedById',
            'innohub__Contact__c',
            'innohub__Spaces_Available__c',
            'innohub__Registration_Open__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> campMap = Schema.SObjectType.innohub__Event__c.fields.getMap();
        
        for (String fieldToCheck : campFields) {
            
            // Check if the user has access to view field
            if (!campMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        system.debug('theEvent');
        system.debug('theEvent: ' + theEvent);
        innohub__Event__c mySpaces = [SELECT Id, innohub__Spaces_Available__c FROM innohub__Event__c WHERE Id = :theEvent];
        system.debug('mySpaces: ' + mySpaces);
        return mySpaces;
    }
}