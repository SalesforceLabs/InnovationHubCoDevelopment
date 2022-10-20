global with sharing class IH_prototypeCtr {
    
    /* Fitered Class */
    global class Filter{
        global String filterName{get;set;}
        global List<String> selectedFilters{get;set;}
    }
    
    
    /* Get available picklist values for picklistAPIName*/
    @AuraEnabled
    global static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues ' + picklistAPIName);
        //Check innohub__Prototype__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
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
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Prototype__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    
    
    /* Get available picklist labels*/
    
    @AuraEnabled
    global static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName: ' + picklistAPIName);
        
        //Check innohub__Prototype__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the innohub__Prototype__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
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
        String theLabel = Schema.getGlobalDescribe().get('innohub__Prototype__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    
    
    /* Get Creator*/
    @AuraEnabled
    global static User getCreator(String creatorId) {
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl',
            'FullPhotoUrl',
            'MediumPhotoUrl'
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
        
        return [SELECT Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl FROM User WHERE Id = :creatorId];
    }
    
    /* Get Fitered Demos */
    @AuraEnabled
    global static List<Prototype__c> getPrototypes(String selectedFilter, String searchFiltersJSON) {
        system.debug('selectedFilter: ' +  selectedFilter);
        system.debug('searchFiltersJSON: ' +  searchFiltersJSON);
        
        //Check user
        String [] userFields = new String [] {'Id', 
            'Name',
            'SmallPhotoUrl',
            'FullPhotoUrl',
            'MediumPhotoUrl'
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
        
        
        //Check dermo1_Prototype__c
        String [] prototypeFields = new String [] {'Id', 
            'innohub__Region__c',
            'Name',
            'innohub__Image__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Description__c',
            'innohub__Overview__c',
            'innohub__Workstream__c'
            
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> prototypeMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
        for (String fieldToCheck : prototypeFields) {
            
            // Check if the user has access to view field
            if (!prototypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<Prototype__c> thePrototypes = new List<Prototype__c>();
        
        List<filter> filterList  = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
        
        String selectClause = 'SELECT Id, toLabel(innohub__Region__c), Name, innohub__Image__c, CreatedById, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedDate, OwnerId, innohub__Description__c, innohub__Overview__c FROM innohub__Prototype__c WHERE IsDeleted = false ';
        String whereClause='';
        String orderBy='';
        String workstreamsClause='';
        String regionClause='';
        List<String> theType = new List<String>();
        List<String> theWorkstreams = new List<String>();
        List<String> theRegions = new List<String>();
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type'){
                theType.add(filterList[i].selectedFilters[0]);
                system.debug('Type: ' + filterList[i].selectedFilters[0]);
            }
            else if(filterList[i].filterName == 'innohub__Workstream__c'){
                theWorkstreams = filterList[i].selectedFilters;
                system.debug('Workstreams: ' + filterList[i].selectedFilters);
                
                if(theWorkstreams.size() != 0){
                    system.debug('theWorkstreams: ' + theWorkstreams);
                    workstreamsClause = 'AND innohub__Workstream__c INCLUDES ' + theWorkstreams;
                    selectClause += workstreamsClause;
                }
            }
            else if(filterList[i].filterName == 'innohub__Region__c'){
                theRegions = filterList[i].selectedFilters;
                system.debug('Regions: ' + filterList[i].selectedFilters);
                
                if(theRegions.size() != 0){
                    system.debug('theRegions: ' + theRegions);
                    regionClause = 'AND toLabel(innohub__Region__c) INCLUDES ' + theRegions;
                    selectClause += regionClause;
                }
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
            system.debug('TYPE: ' + theType[0]);
            switch on theType[0] {
                when 'Recent' {
                    system.debug('Type: RECENT'); 
                    system.debug('selectClause: ' + selectClause);
                }
                when 'My Prototypes' {
                    system.debug('Type: MY PROTOTYPES');
                    selectClause += ' AND OwnerId =\''+ userinfo.getuserid()+'\'';
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        try {
            thePrototypes = Database.query(selectClause  += ' ORDER BY CreatedDate DESC ');
        } catch (Exception e) {
            System.debug(e);
        }
        
        return thePrototypes;
    }
    
    @AuraEnabled
    static global Prototype__c getPrototype(String recordId){
        //Check dermo1_Prototype__c
        String [] prototypeFields = new String [] {'Id', 
            'innohub__Region__c',
            'Name',
            'innohub__Image__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Description__c',
            'innohub__Overview__c',
            'innohub__Video_URL__c', 
            'innohub__Video_Title__c', 
            'innohub__Video_File_Id__c'            
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> prototypeMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
        for (String fieldToCheck : prototypeFields) {
            
            // Check if the user has access to view field
            if (!prototypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        system.debug('getPrototype');
        innohub__Prototype__c thisPrototype = [SELECT Id, toLabel(innohub__Region__c), Name, innohub__Image__c, CreatedById, CreatedDate, OwnerId, innohub__Description__c, innohub__Overview__c, innohub__Video_URL__c, innohub__Video_File_Id__c, innohub__Video_Title__c FROM innohub__Prototype__c where Id = : recordID];
        system.debug('thisPrototype: ' + thisPrototype);
        return thisPrototype;
    }
    
    /* Get available picklist values for Category*/
    @AuraEnabled
    global static List<String> getCategories() {
        //Check dermo1_Prototype__c
        String [] prototypeFields = new String [] {'innohub__Region__c'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> prototypeMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
        for (String fieldToCheck : prototypeFields) {
            
            // Check if the user has access to view field
            if (!prototypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Prototype__c').getDescribe().fields.getMap().get('innohub__Region__c').getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        
        return options;
    }
    
    /* Get available picklist values for Category*/
    @AuraEnabled
    global static List<String> getWorkstreams(){
        //Check dermo1_Prototype__c
        String [] prototypeFields = new String [] {'innohub__Workstream__c'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> prototypeMap = Schema.SObjectType.innohub__Prototype__c.fields.getMap();
        
        for (String fieldToCheck : prototypeFields) {
            
            // Check if the user has access to view field
            if (!prototypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Prototype__c').getDescribe().fields.getMap().get('innohub__Workstream__c').getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        
        return options;
    }
}