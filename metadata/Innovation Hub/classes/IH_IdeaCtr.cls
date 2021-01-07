public with sharing class IH_IdeaCtr {
    
    /* Fitered Class */
    public class Filter{
        public String filterName{get;set;}
        public List<String> selectedFilters{get;set;}
    }
    
    public class myRecordTypeStructure {
        @AuraEnabled
        public Id myRecordTypeId {get; set;}
        @AuraEnabled
        public String myRecordTypeLabel {get; set;}
        @AuraEnabled
        public String myRecordTypeDescription {get; set;}
        public myRecordTypeStructure(Id myId, String myLabel, String myDescription){
            myRecordTypeId = myId;
            myRecordTypeLabel = myLabel; 
            myRecordTypeDescription = myDescription;
        }
    }
    
    /* Get Fitered Ideas */
    @AuraEnabled
    public static List<innohub__Innovation_Idea__c> getIdeas(String selectedFilter, String searchFiltersJSON, String customField, String userField) {
        //system.debug('selectedFilter:' + selectedFilter);
        //system.debug('searchFiltersJSON:' + searchFiltersJSON);
        //system.debug('customField:' + customField);
        //system.debug('userField:' + userField);
        
        
        //Checking the Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Recommended__c', 
            'RecordTypeId', 
            'Name', 
            'innohub__Overview__c', 
            'innohub__Image__c',
            'CreatedById', 
            'CreatedDate', 
            'innohub__Category__c', 
            'innohub__Points__c',
            'OwnerId',
            'innohub__Approval_Status__c'
            };
                if(customField != 'None' && !String.isBlank(customField)){
                    innIdeaFields.add(customField);
                }
        
        String customSettingField;
        List<innohub__Idea__c> customSetting = innohub__Idea__c.getall().values();
        if(customSetting.size() >= 1){
            if(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c != null){
                customSettingField = customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c;
                if(!innIdeaFields.contains(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c)){
                    innIdeaFields.add(customSetting[0].innohub__User_Idea_Owner_Field_API_Name__c);
                }
            } 
        }
        
        // Obtain the field name/token map for the Expense object
        Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
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
                //return null;
            }
        }
        
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
                //return null;
            }
        }
        
        List<innohub__Innovation_Idea__c> theIdeas = new List<innohub__Innovation_Idea__c>();
        
        //String selectClause = 'SELECT Id, innohub__Recommended__c, RecordTypeId, Name, innohub__Overview__c, innohub__Image__c, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedBy.MediumPhotoUrl, CreatedDate, toLabel(innohub__Category__c), innohub__Points__c, OwnerId, innohub__Approval_Status__c';
        String selectClause = 'SELECT Id, innohub__Recommended__c, RecordTypeId, RecordType.Name, Name, innohub__Overview__c, innohub__Image__c, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedBy.MediumPhotoUrl, CreatedDate, toLabel(innohub__Category__c), innohub__Points__c, innohub__Approval_Status__c, OwnerId, typeof Owner when user then Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl when Group then Id, Name, Type end ';
        if(customField != 'None' && !String.isBlank(customField) && !selectClause.contains(customField)){
            selectClause += ', toLabel(' + customField + ')';
        }
        //Add query to get Votes..
        selectClause += ',(SELECT CreatedById, innohub__Innovation_Idea__c, innohub__Vote_Type__c FROM Innovation_Idea_Votes__r WHERE CreatedById = \''+userInfo.getUserId()+'\') ';
        selectClause += ' FROM innohub__Innovation_Idea__c WHERE IsDeleted = false ';
        String orderByRec = ' ORDER BY innohub__Recommended__c DESC NULLS LAST, CreatedDate DESC NULLS LAST';
        String isApproved = ' AND innohub__Approval_Status__c  = \'Approved\'';
        String isApprovedOrSubmittedOrOnHold = ' AND innohub__Approval_Status__c IN (\'Approved\',\'On Hold\',\'Submitted\')';
        String categoryClause = '';
        List<String> theCategories = new List<String>();
        List<String> theType = new List<String>();
        Boolean incorrectRecordTypeFlag = true;
        List<String> theRecordTypeIds = new List<String>();
        List<filter> filterList  = new List<filter>();
        if(searchFiltersJSON != null){
            filterList = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
            system.debug('filterList: ' + filterList);
        }
        
        
        
        for(RecordType rt : [SELECT Id FROM RecordType WHERE SobjectType = 'innohub__Innovation_Idea__c' AND IsActive = true]){
            theRecordTypeIds.add('\''+rt.id+'\'');
        }
        
        //system.debug(filterList[0].selectedFilters.size() + ': ' + filterList[0].selectedFilters);
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type'){
                theType.add(filterList[i].selectedFilters[0]);
            }
            else if(filterList[i].filterName == 'innohub__Category__c'){
                theCategories = filterList[i].selectedFilters;
                
                if(theCategories.size() != 0){
                    categoryClause = 'AND toLabel(innohub__Category__c) INCLUDES ' + theCategories;
                    selectClause += categoryClause;
                }
            }
            else{
                //if(){
                if (innIdeaMap.get(filterList[i].filterName).getDescribe().isAccessible()) {
                    System.debug('Checking Field');
                    innIdeaFields.add(filterList[i].filterName);
                }
                for (String fieldToCheck : innIdeaFields) {
                    System.debug('* FIELD * '+ fieldToCheck);
                    // Check if the user has access to view field
                    
                    if(fieldToCheck == filterList[i].filterName){
                        System.debug('* MATCHING FIELD TYPE * '+ innIdeaMap.get(fieldToCheck).getDescribe().getType());
                        if (innIdeaMap.get(fieldToCheck).getDescribe().getType() == Schema.DisplayType.PICKLIST) {
                            List<String> theCustomList = filterList[i].selectedFilters;
                            system.debug('theCustomList: ' + theCustomList);
                            
                            if(theCustomList.size() != 0 && theCustomList[0] != '\''+Label.Filter_Type_All+'\''){
                                selectClause += 'AND ' + filterList[i].filterName + ' = ' + theCustomList[0] + ' ';
                                system.debug('selectClause FOR PICKLIST: ' + selectClause);
                            } 
                        }else if(innIdeaMap.get(fieldToCheck).getDescribe().getType() == Schema.DisplayType.MULTIPICKLIST){
                            //system.debug('WOOHOO IN ELSE');
                            /* NEED TO TEST WITH MORE THAN ONE PICKLIST FIELD VALUE SELECTED */
                            List<String> theCustomList = filterList[i].selectedFilters;
                            system.debug('theCustomList: ' + theCustomList);
                            
                            if(theCustomList.size() != 0){
                                selectClause += 'AND toLabel(' + filterList[i].filterName + ') INCLUDES ' + theCustomList + ' ';
                                system.debug('selectClause: ' + selectClause);
                            }  
                        }
                    }
                }
                
                //}
                
            }
        } 
        
        
        if(theType.size() != 0){
            switch on theType[0] {
                when 'All' {
                    selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds + isApproved;
                }
                
                when 'My Submissions' {
                    
                    if(customSettingField != null){
                        selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds + isApprovedOrSubmittedOrOnHold + ' AND '+customSettingField+' =\''+ userinfo.getuserid()+'\'';
                    }else{
                        if(userField == 'Created By'){
                            selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds + isApprovedOrSubmittedOrOnHold + ' AND CreatedById =\''+ userinfo.getuserid()+'\'';
                        }else if(userField == 'Owner'){
                            selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds + isApprovedOrSubmittedOrOnHold + ' AND OwnerId =\''+ userinfo.getuserid()+'\'';
                        }
                    }
                    
                }
                
                when 'Favourite Submissions' { 
                    List<String> ideaVotesTrue = new List<String>();
                    List<innohub__Innovation_Idea_Vote__c> ideaVotes = new List<innohub__Innovation_Idea_Vote__c>();
                    ideaVotes = [SELECT Id, innohub__Innovation_Idea__c FROM innohub__Innovation_Idea_Vote__c WHERE innohub__Vote_Type__c = true AND CreatedById = :userinfo.getuserid()];
                    system.debug('ideaVotes: ' + ideaVotes);
                    
                    for (innohub__Innovation_Idea_Vote__c myIdeaVote : ideaVotes) {
                        ideaVotesTrue.add('\'' + myIdeaVote.innohub__Innovation_Idea__c  + '\'');
                    }
                    selectClause += 'AND Id IN ' + ideaVotesTrue + ' AND RecordTypeId IN ' + theRecordTypeIds + isApproved;
                    system.debug('selectClause: ' + selectClause);
                }
                
                when 'Popular Ideas'{
                    selectClause += isApproved;
                    orderByRec = ' ORDER BY innohub__Recommended__c DESC NULLS LAST, innohub__Points__c DESC NULLS LAST, CreatedDate DESC NULLS LAST';
                }
                
                when else{
                    try{
                        system.debug('RECORD TYPE NAME: ' + theType[0]);
                        RecordType theCustomRadioName_1RecordType = [SELECT Id FROM RecordType WHERE SobjectType = 'innohub__Innovation_Idea__c' AND Id = :theType[0]];
                        selectClause += ' AND RecordTypeId =' + '\'' + theCustomRadioName_1RecordType.Id + '\'' + isApproved;
                    } catch(Exception ex){
                        system.debug('EXCEPTION: ' + ex);
                        incorrectRecordTypeFlag = false;
                    }
                }
            }
        }
        else{
            selectClause += ' AND RecordTypeId IN ' + theRecordTypeIds + isApproved; 
        }
        
        system.debug('selectClause: ' + selectClause);
        if(incorrectRecordTypeFlag){
            try {
                theIdeas = Database.query(selectClause + orderByRec);
            } catch (Exception e) {
                System.debug(e);
            }
        }
        else{
            theIdeas = null;
        }
        /*
        ideaWrapper iowList = new ideaWrapper();
        iowList.ownerUsers = new List<User>();
        iowList.ideas = new List<innohub__Innovation_Idea__c>();
        iowList.ideas = theIdeas;
        if(userField != 'Created By'){
            //List<Queue> q = new List<Queue>();
            List<User> users = new List<User>();
            List<Id> userIds = new List<Id>();
            List<Id> queueIds = new List<Id>();
            for(innohub__Innovation_Idea__c ini : theIdeas){
                if(string.valueOf(ini.OwnerId.getSObjectType()) == 'User'){
                    userIds.add(ini.OwnerId);
                }else if(string.valueOf(ini.OwnerId.getSObjectType()) == 'Group'){
                    queueIds.add(ini.OwnerId);
                }
                //System.debug('The Owner is Object: ' + string.valueOf(ini.OwnerId.getSObjectType()));  
            }
            if(userIds.size()>0){
                iowList.ownerUsers = [SELECT Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl FROM User WHERE Id IN: userIds];
            }
            if(queueIds.size()>0){
                iowList.ownerQueues = [SELECT Id, Name FROM Group WHERE Id IN: queueIds];
            }*/
            /*
for(innohub__Innovation_Idea__c ini : theIdeas){
for(User user : users){
if(ini.OwnerId == user.Id){
//ini.Owner.SmallPhotoUrl = user.Name;
ideaOwnerWrapper iow = new ideaOwnerWrapper();
iow.ownerUser = user;
iow.idea = ini;
iowList.add(iow);
}
}
}*/
        //}
    
        return theIdeas;
        //System.debug('MDBG: ' + iowList.ideas + ' !! ' + iowList.ownerQueues);
        //return iowList;
    }
    
    public class ideaWrapper
    {
        @AuraEnabled
        public List<User> ownerUsers { get; set; }
        @AuraEnabled
        public List<Group> ownerQueues { get; set; }
        @AuraEnabled
        public List<innohub__Innovation_Idea__c> ideas { get; set; }
    }
    
    @AuraEnabled
    public static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues ' + picklistAPIName);
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        List<String> options = new List<String>();
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        options.add(Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getType().name());
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    
    
    /* Get Creator*/
    @AuraEnabled
    public static User getCreator(String creatorId) {
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
                //return null;
            }
        }
        
        return [SELECT Id, Name, SmallPhotoUrl, FullPhotoUrl, MediumPhotoUrl FROM User WHERE Id = :creatorId]; // Query called too many times??
    }
    
    @AuraEnabled
    public static Innovation_Idea__c getIdea(String recordId){
        //Checking the innohub__Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Recommended__c', 
            'RecordTypeId', 
            'Name', 
            'innohub__Overview__c', 
            'innohub__Image__c',
            'CreatedById', 
            'CreatedDate', 
            'innohub__Category__c', 
            'innohub__Points__c',
            'innohub__Approval_Status__c',
            'OwnerId' 
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        innohub__Innovation_Idea__c thisIdea = [SELECT Id, innohub__Recommended__c, Name, RecordTypeId, innohub__Overview__c, innohub__Image__c, innohub__Description__c, toLabel(innohub__Category__c), innohub__Points__c, OwnerId, innohub__Describe_your_evolution__c, innohub__Approval_Status__c FROM innohub__Innovation_Idea__c where Id = : recordID  AND innohub__Improvement_Request__c  != true];
        system.debug('thisIdea: ' + thisIdea);
        return thisIdea;
    }
    
    //Depreceated - checkAllVotes to be used instead
    
    @AuraEnabled
    public static Boolean checkVote(Id recordId){
        //Check User
        String [] userFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Innovation_Idea_Vote__c
        String [] voteFields = new String [] {'CreatedById', 'innohub__Vote_Type__c'
            };
                
                // Obtain the field name/token map for the Innovation_Idea_Vote__c object
                Map<String,Schema.SObjectField> voteMap = Schema.SObjectType.innohub__Innovation_Idea_Vote__c.fields.getMap();
        
        for (String fieldToCheck : voteFields) {
            // Check if the user has access to view field
            if (!voteMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        innohub__Innovation_Idea_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c  FROM innohub__Innovation_Idea_Vote__c WHERE innohub__Innovation_Idea__c = :recordId AND CreatedById = :voterId LIMIT 1];
        return myObject.innohub__Vote_Type__c;  
    }   
    
    
    @AuraEnabled
    public static List<innohub__Innovation_Idea_Vote__c> checkAllVotes(List<Id> ideas){
        //Check User
        String [] userFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Innovation_Idea_Vote__c
        String [] voteFields = new String [] {'CreatedById', 'innohub__Vote_Type__c'
            };
                
                // Obtain the field name/token map for the Innovation_Idea_Vote__c object
                Map<String,Schema.SObjectField> voteMap = Schema.SObjectType.innohub__Innovation_Idea_Vote__c.fields.getMap();
        
        for (String fieldToCheck : voteFields) {
            // Check if the user has access to view field
            if (!voteMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        List<innohub__Innovation_Idea_Vote__c> myObject = [SELECT CreatedById, innohub__Innovation_Idea__c, innohub__Vote_Type__c FROM innohub__Innovation_Idea_Vote__c WHERE innohub__Innovation_Idea__c IN: ideas AND CreatedById = :voterId];
        if(myObject.size() > 0){
            System.debug('DBG: ' + ideas);
            return myObject; 
        }else{
            return null;
        }
        
    }  
    
    
    @AuraEnabled
    public static Boolean upvote(Id recordId){
        //Check User
        String [] userFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Check Innovation_Idea_Vote__c
        String [] innIdeaFields = new String [] {
            'innohub__Vote_Type__c', 
                'innohub__Innovation_Idea__c'
                };
                    
                    // Obtain the field name/token map for the Innovation_Idea_Vote__c object
                    Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea_Vote__c.fields.getMap();
        
        if (!innIdeaMap.get('CreatedById').getDescribe().isAccessible()) {
            
            // Pass error to client
            throw new System.NoAccessException();
            
            // Suppress editor logs
            //return null;
        }
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isCreateable() && !innIdeaMap.get(fieldToCheck).getDescribe().isUpdateable()) {
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Innovation_Idea_Vote__c
        system.debug('upvote');
        String voterId = userinfo.getuserid();
        system.debug('voterId: ' + voterId);
        try{
            
            innohub__Innovation_Idea_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c, innohub__Innovation_Idea__c  FROM innohub__Innovation_Idea_Vote__c WHERE innohub__Innovation_Idea__c = :recordId AND CreatedById = :voterId LIMIT 1];
            system.debug('myObject: ' + myObject);
            
            myObject.innohub__Vote_Type__c = True;
            update myObject;
            
        }
        catch(Exception e){
            system.debug('New vote');
            innohub__Innovation_Idea_Vote__c myObject = new innohub__Innovation_Idea_Vote__c();
            myObject.innohub__Innovation_Idea__c = recordId;
            myObject.innohub__Vote_Type__c = True;
            insert myObject;         
            System.debug('created up-vote' + myObject);
        } 
        return null;
    }     
    
    
    @AuraEnabled
    public static Boolean downvote(Id recordId){
        //Check User
        String [] userFields = new String [] {'Id'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Check Innovation_Idea_Vote__c
        String [] innIdeaFields = new String [] {
            'innohub__Vote_Type__c', 
                'innohub__Innovation_Idea__c'
                };
                    
                    // Obtain the field name/token map for the Innovation_Idea_Vote__c object
                    Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea_Vote__c.fields.getMap();
        
        if (!innIdeaMap.get('CreatedById').getDescribe().isAccessible()) {
            
            // Pass error to client
            throw new System.NoAccessException();
            
            // Suppress editor logs
            //return null;
        } 
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isCreateable() && !innIdeaMap.get(fieldToCheck).getDescribe().isUpdateable()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        system.debug('downvote');
        String voterId = userinfo.getuserid();
        system.debug('voterId: ' + voterId);
        try{
            
            innohub__Innovation_Idea_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c, innohub__Innovation_Idea__c  FROM innohub__Innovation_Idea_Vote__c WHERE innohub__Innovation_Idea__c = :recordId AND CreatedById = :voterId LIMIT 1];
            system.debug('myObject: ' + myObject);
            System.debug('downvoteing' + myObject);
            
            myObject.innohub__Vote_Type__c = False;
            update myObject;
            
        }
        catch(Exception e){
            
            innohub__Innovation_Idea_Vote__c myObject = new innohub__Innovation_Idea_Vote__c();
            myObject.innohub__Innovation_Idea__c = recordId;
            myObject.innohub__Vote_Type__c = False;
            insert myObject;
        }
        return null;
    }
    
    
    /*Get available record types*/
    
    @AuraEnabled
    public static String getRecordTypeName(String recordTypeId){
        //RecordType
        String [] recordTypeFields = new String [] {'Name'};
            
            // Obtain the field name/token map for the RecordType object
            Map<String,Schema.SObjectField> recordTypeMap = Schema.SObjectType.RecordType.fields.getMap();
        
        for (String fieldToCheck : recordTypeFields) {
            
            // Check if the user has access to view field
            if (!recordTypeMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        /*List<Schema.RecordTypeInfo> recordtypes = innohub__Innovation_Idea__c.SObjectType.getDescribe().getRecordTypeInfos();    
Map<Id, String> recordtypemap = new Map<Id, String>();
System.debug('We are here');*/
        
        //List<Schema.RecordTypeInfo> recordtypes = innohub__Innovation_Idea__c.SObjectType.getDescribe().getRecordTypeInfos(); 
        
        String theName = Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().getRecordTypeInfosById().get(recordTypeId).getName();
        system.debug('theName: ' + theName);
        return theName;
    }
    
    @AuraEnabled
    public static String isApproved(String recordId){
        //Checking the Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Points__c'
            };
                
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        Innovation_Idea__c theIdea = [SELECT Approval_Status__c FROM Innovation_Idea__c WHERE Id = :recordId];
        
        return theIdea.Approval_Status__c;
    }
    
    @AuraEnabled
    public static Double getPoints(String recordId){
        //Checking the Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'innohub__Points__c'
            };
                
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        innohub__Innovation_Idea__c theIdea = [SELECT innohub__Points__c FROM innohub__Innovation_Idea__c WHERE Id =: recordId];
        
        return theIdea.innohub__Points__c;
    }
    
    
    @AuraEnabled
    public static innohub__Innovation_Idea__c getLatestIdea(){
        //Checking the Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Recommended__c', 
            'RecordTypeId', 
            'Name', 
            'innohub__Overview__c', 
            'innohub__Image__c', 
            'CreatedById', 
            'CreatedDate', 
            'innohub__Category__c', 
            'innohub__Points__c',
            'OwnerId' 
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        innohub__Innovation_Idea__c latestIdea = [SELECT Id, RecordTypeId, Name, innohub__Overview__c, innohub__Image__c, CreatedById, CreatedDate, toLabel(innohub__Category__c), innohub__Points__c, OwnerId FROM innohub__Innovation_Idea__c WHERE IsDeleted = false AND innohub__Improvement_Request__c  != true AND innohub__Approval_Status__c = 'Approved' ORDER BY CreatedDate DESC NULLS LAST LIMIT 1];
        
        return latestIdea;
    }
    
    @AuraEnabled
    public static Boolean getLoggedInUser(Id recordId, User theUser){
        system.debug('getLoggedInUser');
        
        //Checking the innohub__Innovation_Idea__c Field Level Security
        String [] innIdeaFields = new String [] {'Id', 
            'innohub__Recommended__c', 
            'RecordTypeId', 
            'Name', 
            'innohub__Overview__c', 
            'innohub__Image__c',
            'CreatedById', 
            'CreatedDate', 
            'innohub__Category__c', 
            'innohub__Points__c',
            'innohub__Approval_Status__c',
            'OwnerId' 
            };
                
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        //Checking the User Field Level Security
        String [] userFields = new String [] {'Id',
            'profileId',
            'Name'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> userMap = Schema.SObjectType.User.fields.getMap();  
        
        for (String fieldToCheck : userFields) {
            
            // Check if the user has access to view field
            if (!userMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        User myUser = new User();
        
        if(theUser != null){
            myUser = theUser;
        }
        
        else{
            myUser = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];
        }
        //Profile myProfile = [SELECT Id FROM Profile WHERE Name = 'System Administrator'];
        innohub__Innovation_Idea__c thisIdea = [SELECT Id, OwnerId FROM innohub__Innovation_Idea__c where Id = : recordID  AND innohub__Approval_Status__c = 'Submitted'];
        system.debug('thisIdea: ' + thisIdea);
        
        if(myUser.Id == thisIdea.OwnerId){
            return true;
        }
        else{
            return false;
        }
    }
    
    @AuraEnabled
    public static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName: ' + picklistAPIName);
        
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Innovation_Idea__c.fields.getMap();
        
        for (String fieldToCheck : innIdeaFields) {
            
            // Check if the user has access to view field
            if (!innIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                //return null;
            }
        }
        
        system.debug('Before Schema.getGlobalDescribe()');
        String theLabel = Schema.getGlobalDescribe().get('innohub__Innovation_Idea__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    @AuraEnabled
    public static List<myRecordTypeStructure> getIdeaRecordTypesButton(){
        system.debug('*** getIdeaRecordTypesButton ***');
        List<myRecordTypeStructure> theRecordList = new List<myRecordTypeStructure>();
        
        List<Schema.RecordTypeInfo> recordtypes = innohub__Innovation_Idea__c.SObjectType.getDescribe().getRecordTypeInfos();    
        Map<Id, String> recordtypemap = new Map<Id, String>();
        System.debug('We are here');
        for(RecordTypeInfo rt : recordtypes){
            
            System.debug('rt.isAvailable() ' + rt.isAvailable());
            System.debug(' rt.getName() rt.isActive() ' + rt.isActive());
            System.debug('rt.getName ' + rt.getName());
            
            if(rt.isMaster() != true && rt.isAvailable()==true)
            {
                String theName = rt.getName();
                Id theId = rt.getRecordTypeId();
                //system.debug('theName: ' + theName);
                //RecordType theRecordTypeDescription = [SELECT Description FROM RecordType WHERE Name = :theName];
                RecordType theRecordTypeDescription = [SELECT Description FROM RecordType WHERE Id = :theId];
                system.debug('theRecordTypeDescription: ' + theRecordTypeDescription);
                system.debug('getRecordTypeId: ' + rt.getRecordTypeId());
                theRecordList.add(new myRecordTypeStructure(rt.getRecordTypeId(), rt.getName(), theRecordTypeDescription.Description)); 
                
            }     
        }        
        return theRecordList;
    } 
    
    @AuraEnabled
    public static Map<String, String> getRecordTypeRadio(){
        Map<String, String> options = new Map<String, String>();
        
        List<Schema.RecordTypeInfo> recordtypes = innohub__Innovation_Idea__c.SObjectType.getDescribe().getRecordTypeInfos();    
        Map<Id, String> recordtypemap = new Map<Id, String>();
        System.debug('We are here');
        for(RecordTypeInfo rt : recordtypes){
            
            System.debug('rt.isAvailable() ' + rt.isAvailable());
            System.debug(' rt.getName() rt.isActive() ' + rt.isActive());
            System.debug('rt.getName ' + rt.getName());
            System.debug('rt.getId ' + Schema.SObjectType.innohub__Innovation_Idea__c.getRecordTypeInfosByName().get(rt.getName()).getRecordTypeId());
            
            //Id recid = Schema.SObjectType.innohub__Innovation_Idea__c.getRecordTypeInfosByName().get(recordTypeLabel).getRecordTypeId(); 
            
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