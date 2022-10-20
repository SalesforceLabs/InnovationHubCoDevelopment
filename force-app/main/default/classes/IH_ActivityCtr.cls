global with sharing class IH_ActivityCtr {
    
    /* Fitered Class */
    global class Filter{
        global String filterName{get;set;}
        global List<String> selectedFilters{get;set;}
    }
    
    /* Get Fitered Activities */
    @AuraEnabled
    global static List<Activity__c> getActivities(String selectedFilter, String searchFiltersJSON) {
        //Checking the Activity__c Field Level Security
        String [] activityFields = new String [] {'Id', 
            'Name', 
            'innohub__Subject__c', 
            'innohub__Description__c', 
            'innohub__Type__c',
            'innohub__Step__c', 
            'innohub__BU__c', 
            'CreatedById', 
            'CreatedDate', 
            'innohub__Image__c', 
            'OwnerId'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> activityMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
        for (String fieldToCheck : activityFields) {
            
            // Check if the user has access to view field
            if (!activityMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //RecordType
        String [] recordTypeFields = new String [] {'Id', 'Name'
            };
                
                // Obtain the field name/token map for the RecordType object
                Map<String,Schema.SObjectField> recordTypeMap = Schema.SObjectType.RecordType.fields.getMap();
        
        for (String fieldToCheck : recordTypeFields) {
            
            // Check if the user has access to view field
            if (!recordTypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        List<Activity__c> theActivities = new List<Activity__c>();
        List<String> theRecordTypeIds = new List<String>();
        List<String> theType = new List<String>();
        List<String> theCategories = new List<String>();
        List<String> theBU = new List<String>();
        String theQuery = '';
        String selectClause = 'SELECT Id, Name, innohub__Subject__c, innohub__Description__c, toLabel(innohub__Type__c), innohub__Step__c, toLabel(innohub__BU__c), CreatedById, CreatedDate, innohub__Image__c, OwnerId FROM innohub__Activity__c WHERE IsDeleted = false';
        Boolean incorrectRecordTypeFlag = true;
        
        List<filter> filterList  = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
        system.debug('filterList: ' + filterList);
        
        
        for(RecordType rt : [SELECT Id FROM RecordType WHERE SobjectType = 'innohub__Activity__c' AND IsActive = true]){
            theRecordTypeIds.add('\''+rt.id+'\'');
        }
        /*if(filterList == null){
            system.debug(filterList[0].selectedFilters.size() + ': ' + filterList[0].selectedFilters  + ': ' + filterList[0].filterName);
        }*/
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type1'){
                theType.add(filterList[i].selectedFilters[0]);
                system.debug('Type: ' + filterList[i].selectedFilters[0]);
                
                if(theType.size() != 0){
                    switch on theType[0] {
                        when 'All' {
                            selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds;
                        }
                        
                        when 'My Activities' {
                            system.debug('Type: MY ACTIVITIES'); 
                            selectClause += ' AND OwnerId =\''+ userinfo.getuserid()+'\'';
                            system.debug('selectClause: ' + selectClause);
                        }
                        
                        when else{
                            try{
                                RecordType theCustomRadioName_1RecordType = [SELECT Id FROM RecordType WHERE SobjectType = 'innohub__Activity__c' AND Id = :theType[0]];
                                selectClause += ' AND RecordTypeId =' + '\'' + theCustomRadioName_1RecordType.Id + '\'';
                            } catch(Exception ex){
                                system.debug('EXCEPTION: ' + ex);
                                incorrectRecordTypeFlag = false;
                            }
                        }
                    }
                }
            }
            else if(filterList[i].filterName == 'innohub__Type__c'){
                theCategories = filterList[i].selectedFilters;
                system.debug('Categories: ' + filterList[i].selectedFilters);
                
                if(theCategories.size() != 0){
                    selectClause += ' AND toLabel(innohub__Type__c) IN ' + theCategories;
                }
            }
            else if(filterList[i].filterName == 'innohub__BU__c'){
                theBU = filterList[i].selectedFilters;
                system.debug('BU: ' + filterList[i].selectedFilters);
                
                if(theBU.size() != 0){
                    selectClause += ' AND toLabel(innohub__BU__c) INCLUDES ' + theBU;
                }
            }
            else{
                system.debug('WOOHOO IN ELSE');
                /* NEED TO TEST WITH MORE THAN ONE PICKLIST FIELD VALUE SELECTED */
                List<String> theCustomList = filterList[i].selectedFilters;
                system.debug('theCustomList: ' + theCustomList);
                
                if(theCustomList.size() != 0){
                    selectClause += ' AND toLabel(' + filterList[i].filterName + ') INCLUDES ' + theCustomList + ' ';
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        selectClause += ' ORDER BY CreatedDate DESC ';
        system.debug('selectClause: ' + selectClause);
        if(incorrectRecordTypeFlag){
            try {
                theActivities = Database.query(selectClause);
            } catch (Exception e) {
                System.debug(e);
            }
        }
        else{
            theActivities = null;
        }
        
        return theActivities;
    }
    
    
    /* Get available picklist values for Step*/
    @AuraEnabled
    global static List<String> getTypes() {
        //Checking the Activity__c Field Level Security
        String [] activityFields = new String [] {'Id',  
            'innohub__Type__c'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> activityMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
        for (String fieldToCheck : activityFields) {
            
            // Check if the user has access to view field
            if (!activityMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Activity__c').getDescribe().fields.getMap().get('innohub__Type__c').getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        
        return options;
    }
    
  
    /* Get picklist values*/
    @AuraEnabled
    global static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues ' + picklistAPIName);
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
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
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Activity__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    /* Get picklist label*/
    
    @AuraEnabled
    global static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName: ' + picklistAPIName);
        
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
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
        String theLabel = Schema.getGlobalDescribe().get('innohub__Activity__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    
    /* Get Creator*/
    @AuraEnabled
    global static User getCreator(String creatorId) {
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
    global static Activity__c getActivity(String recordId){
        //Checking the Activity__c Field Level Security
        String [] activityFields = new String [] {'Id', 
            'Name', 
            'innohub__Subject__c', 
            'innohub__Description__c', 
            'innohub__Type__c',
            'innohub__Step__c', 
            'innohub__BU__c', 
            'CreatedById', 
            'CreatedDate', 
            'innohub__Image__c', 
            'OwnerId'
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> activityMap = Schema.SObjectType.innohub__Activity__c.fields.getMap();
        
        for (String fieldToCheck : activityFields) {
            
            // Check if the user has access to view field
            if (!activityMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        Activity__c thisActivity = [SELECT Id, Name, innohub__Subject__c, innohub__Description__c, toLabel(innohub__Type__c), toLabel(innohub__BU__c), OwnerId, innohub__Image__c  FROM innohub__Activity__c where Id = : recordID];
        return thisActivity;
    }  
    
    
    /*Get available record types*/
    
    global class myRecordTypeStructure {
        @AuraEnabled
        global Id myRecordTypeId {get; set;}
        @AuraEnabled
        global String myRecordTypeLabel {get; set;}
        @AuraEnabled
        global String myRecordTypeDescription {get; set;}
        global myRecordTypeStructure(Id myId, String myLabel, String myDescription){
            myRecordTypeId = myId;
            myRecordTypeLabel = myLabel; 
            myRecordTypeDescription = myDescription;
        }
    }
    
    @AuraEnabled
    global static List<myRecordTypeStructure> getIdeaRecordTypes(){
        List<myRecordTypeStructure> theRecordList = new List<myRecordTypeStructure>();
        
        List<Schema.RecordTypeInfo> recordtypes = innohub__Activity__c.SObjectType.getDescribe().getRecordTypeInfos();    
        Map<Id, String> recordtypemap = new Map<Id, String>();
        System.debug('We are here');
        for(RecordTypeInfo rt : recordtypes){
            
            System.debug('rt.isAvailable() ' + rt.isAvailable());
            System.debug('rt.getName ' + rt.getName());
            
            if(rt.getName() != 'Master' && rt.isAvailable()==true)
            {
                String theName = rt.getName();
                system.debug('theName: ' + theName);
                
                RecordType theRecordTypeDescription = [SELECT Description FROM RecordType WHERE Name = :theName];
                system.debug('theRecordTypeDescription: ' + theRecordTypeDescription);
                system.debug('getRecordTypeId: ' + rt.getRecordTypeId());
                theRecordList.add(new myRecordTypeStructure(rt.getRecordTypeId(), rt.getName(), theRecordTypeDescription.Description)); 
                
            }     
        }        
        return theRecordList; 
    }
    
    
    @AuraEnabled
    global static Map<String, String> getRecordTypeRadio(){
        Map<String, String> options = new Map<String, String>();
        
        List<Schema.RecordTypeInfo> recordtypes = innohub__Activity__c.SObjectType.getDescribe().getRecordTypeInfos();    
        Map<Id, String> recordtypemap = new Map<Id, String>();
        System.debug('We are here');
        for(RecordTypeInfo rt : recordtypes){
            
            System.debug('rt.isAvailable() ' + rt.isAvailable());
            System.debug(' rt.getName() rt.isActive() ' + rt.isActive());
            System.debug('rt.getName ' + rt.getName());
            
            if(rt.isMaster() != true && rt.isAvailable()==true)
            {
                String theName = rt.getName();
                system.debug('theName: ' + theName);
                Id theId = rt.getRecordTypeId();
                
                RecordType theRecordTypeDescription = [SELECT Description FROM RecordType WHERE Id = :theId];
                system.debug('theRecordTypeDescription: ' + theRecordTypeDescription);
                system.debug('getRecordTypeId: ' + rt.getRecordTypeId());
                //theRecordList.add(new myRecordTypeStructure(rt.getRecordTypeId(), rt.getName(), theRecordTypeDescription.Description)); 
                options.put(rt.getName(), rt.getRecordTypeId());
            }     
        }        
        return options;
    }
}