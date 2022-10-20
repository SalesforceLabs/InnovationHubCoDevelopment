global with sharing class IH_DemoCtr {
    
    /* Fitered Class */
    global class Filter{
        global String filterName{get;set;}
        global List<String> selectedFilters{get;set;}
    }
    
    /* Get Fitered Demos */
    @AuraEnabled
    global static List<innohub__Demo__c> getDemos(String selectedFilter, String searchFiltersJSON) {
        system.debug('getDemos');
        system.debug('selectedFilter: ' + selectedFilter);
        system.debug('searchFiltersJSON: ' + searchFiltersJSON);
        
        //Checking the Demo__c Field Level Security
        String [] demoFields = new String [] {'Id', 
            'Name', 
            'innohub__Image__c', 
            'innohub__Overview__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Category__c',
            'innohub__Clouds_Involved__c',
            'innohub__Video_URL__c',
            'innohub__Video_Title__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoIdeaMap = Schema.SObjectType.innohub__Demo__c.fields.getMap();  
        
        for (String fieldToCheck : demoFields) {
            
            // Check if the user has access to view field
            if (!demoIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
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
                return null;
            }
        }
        
        List<innohub__Demo__c> theDemos = new List<innohub__Demo__c>();
        
        List<filter> filterList  = (List<filter>)JSON.deserialize(searchFiltersJSON, List<filter>.class);
        
        String selectClause = 'SELECT Id, Name, innohub__Image__c, innohub__Points__c, innohub__Overview__c, CreatedById, CreatedBy.Name, CreatedBy.SmallPhotoUrl, CreatedBy.FullPhotoUrl, CreatedDate, OwnerId, toLabel(innohub__Category__c), toLabel(innohub__Clouds_Involved__c), innohub__Video_URL__c FROM innohub__Demo__c WHERE IsDeleted = false ';
        String whereClause='';
        String categoryClause = '';
        String workstreamClause = '';
        String DemoTypeClause = '';
        String orderBy='ORDER BY CreatedDate DESC NULLS LAST';
        List<String> theType = new List<String>();
        List<String> theWorkstreams = new List<String>();
        List<String> theDemoType = new List<String>();
        List<String> theCategories = new List<String>();
        
        for(Integer i=0; i < filterList.size(); i++){
            if(filterList[i].filterName == 'Type'){
                theType.add(filterList[i].selectedFilters[0]);
                system.debug('Type: ' + filterList[i].selectedFilters[0]);
                
                
            }
            else if(filterList[i].filterName == 'innohub__Clouds_Involved__c'){
                theWorkstreams = filterList[i].selectedFilters;
                system.debug('Workstreams: ' + filterList[i].selectedFilters);
                
                if(theWorkstreams.size() != 0){
                    system.debug('theWorkstreams: ' + theWorkstreams);
                    workstreamClause = ' AND toLabel(innohub__Clouds_Involved__c) INCLUDES ' + theWorkstreams;
                    selectClause += workstreamClause;
                }
            }
            else if(filterList[i].filterName == 'innohub__Demo_Type__c'){
                theDemoType = filterList[i].selectedFilters;
                system.debug('DemoType: ' + filterList[i].selectedFilters);
                
                if(theDemoType.size() != 0){
                    system.debug('DemoType: ' + theDemoType);
                    DemoTypeClause = ' AND toLabel(innohub__Demo_Type__c) INCLUDES ' + theDemoType;
                    selectClause += DemoTypeClause;
                }
            }
            else if(filterList[i].filterName == 'innohub__Category__c'){
                theCategories = filterList[i].selectedFilters;
                system.debug('Category: ' + filterList[i].selectedFilters);
                
                if(theCategories.size() != 0){
                    system.debug('Categories: ' + theCategories);
                    categoryClause = ' AND toLabel(innohub__Category__c) INCLUDES ' + theCategories;
                    selectClause += categoryClause;
                }
            }
            else{
                system.debug('WOOHOO IN ELSE');
                /* NEED TO TEST WITH MORE THAN ONE PICKLIST FIELD VALUE SELECTED */
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
                
                when 'My Demos' {
                    system.debug('Type: MY DEMOS'); 
                    selectClause += ' AND OwnerId =\''+ userinfo.getuserid()+'\'';
                    system.debug('selectClause: ' + selectClause);
                }
                
                when 'Favourite Demos' {
                    system.debug('Type: FAVOURITE DEMOS');  
                    
                    List<String> demoVotesTrue = new List<String>();
                    List<innohub__Demo_Vote__c > demoVotes = new List<innohub__Demo_Vote__c >();
                    demoVotes = [SELECT Id, innohub__Demo__c FROM innohub__Demo_Vote__c WHERE innohub__Vote_Type__c = true AND CreatedById = :userinfo.getuserid()];
                    system.debug('demoVotes: ' + demoVotes);
                    
                    for (innohub__Demo_Vote__c myDemoVote : demoVotes) {
                        demoVotesTrue.add('\'' + myDemoVote.innohub__Demo__c  + '\'');
                    }
                    selectClause += 'AND Id IN ' + demoVotesTrue;
                    system.debug('selectClause: ' + selectClause);
                }
            }
        }
        
        system.debug('***selectClause*** ' + selectClause);
        
        //selectClause += orderBy;
        selectClause += ' ORDER BY CreatedDate DESC ';
        
        try {
            theDemos = Database.query(selectClause);
        } catch (Exception e) {
            System.debug(e);
        }
        
        return theDemos;
    }
    
    @AuraEnabled
    global static Double getPoints(String recordId){
        system.debug('getPoints');
        //Checking the innohub__Demo__c Field Level Security
        String [] demoFields = new String [] {'innohub__Points__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoIdeaMap = Schema.SObjectType.Demo__c.fields.getMap();  
        
        for (String fieldToCheck : demoFields) {
            
            // Check if the user has access to view field
            if (!demoIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        innohub__Demo__c theIdea = [SELECT innohub__Points__c FROM innohub__Demo__c WHERE Id =: recordId];
        
        return theIdea.innohub__Points__c;
    }
    
    /* Get available picklist values for picklistAPIName*/
    @AuraEnabled
    global static List<String> getPicklistValues(String picklistAPIName) {
        system.debug('getPicklistValues ' + picklistAPIName);
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Demo__c.fields.getMap();
        
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
        List<Schema.PicklistEntry> fieldResult = Schema.getGlobalDescribe().get('innohub__Demo__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getPicklistValues();
        
        for(Schema.PicklistEntry f : fieldResult) {
            options.add(f.getLabel());
        }
        return options;
    }
    
    
    /* Get available picklist labels*/
    @AuraEnabled
    global static String getPicklistLabel(String picklistAPIName) {
        system.debug('picklistAPIName: ' + picklistAPIName);
        
        //Check Innovation_Idea__c
        String [] innIdeaFields = new String [] {'Id', 
            picklistAPIName
            };  
                // Obtain the field name/token map for the Innovation_Idea__c object
                Map<String,Schema.SObjectField> innIdeaMap = Schema.SObjectType.innohub__Demo__c.fields.getMap();
        
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
        String theLabel = Schema.getGlobalDescribe().get('innohub__Demo__c').getDescribe().fields.getMap().get(picklistAPIName).getDescribe().getlabel();
        system.debug('After Schema.getGlobalDescribe(): ' + theLabel);
        return theLabel;
    }
    
    /* Get Creator*/
    @AuraEnabled
    global static User getCreator(String creatorId) {
        system.debug('getCreator');
        //Checking the User Field Level Security
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
    
    @AuraEnabled
    static global Demo__c getDemo(String recordId){
        system.debug('getDemo');
        //Checking the innohub__Demo__c Field Level Security
        String [] demoFields = new String [] {'Id', 
            'Name', 
            'innohub__Image__c', 
            'innohub__Overview__c',
            'CreatedById',
            'CreatedDate',
            'OwnerId',
            'innohub__Category__c',
            'innohub__Clouds_Involved__c',
            'innohub__Video_URL__c', 
            'innohub__Video_Title__c', 
            'innohub__Video_File_Id__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoIdeaMap = Schema.SObjectType.innohub__Demo__c.fields.getMap();  
        
        for (String fieldToCheck : demoFields) {
            
            // Check if the user has access to view field
            if (!demoIdeaMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        Demo__c thisDemo = [SELECT Id, toLabel(innohub__Category__c), innohub__Overview__c, innohub__Image__c, Name, innohub__Description__c, OwnerId, innohub__Video_URL__c, innohub__Video_Title__c, innohub__Video_File_Id__c FROM innohub__Demo__c where Id = : recordId];
        return thisDemo;
    }
    
    @AuraEnabled
    global static Boolean checkVote(Id recordId){
        system.debug('checkVote');
        //Checking the Demo_Vote__c Field Level Security
        String [] demoVoteFields = new String [] {'CreatedById', 
            'innohub__Vote_Type__c',
            'innohub__Demo__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoVoteMap = Schema.SObjectType.innohub__Demo_Vote__c.fields.getMap();  
        
        for (String fieldToCheck : demoVoteFields) {
            
            // Check if the user has access to view field
            if (!demoVoteMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Checking the User Field Level Security
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
                return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        innohub__Demo_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c  FROM innohub__Demo_Vote__c WHERE innohub__Demo__c = :recordId AND CreatedById = :voterId LIMIT 1];
        return myObject.innohub__Vote_Type__c;
        
    }
    
    @AuraEnabled
    global static List<innohub__Demo_Vote__c> checkAllVotes(List<Id> demos){
        system.debug('checkVote');
        //Checking the Demo_Vote__c Field Level Security
        String [] demoVoteFields = new String [] {'CreatedById', 
            'innohub__Vote_Type__c',
            'innohub__Demo__c'
            };
                
                // Obtain the field name/token map for the Demo__c object
                Map<String,Schema.SObjectField> demoVoteMap = Schema.SObjectType.innohub__Demo_Vote__c.fields.getMap();  
        
        for (String fieldToCheck : demoVoteFields) {
            
            // Check if the user has access to view field
            if (!demoVoteMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Checking the User Field Level Security
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
                return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        List<innohub__Demo_Vote__c> myObject = [SELECT CreatedById, innohub__Vote_Type__c, innohub__Demo__c  FROM innohub__Demo_Vote__c WHERE innohub__Demo__c IN: demos AND CreatedById = :voterId];
        if(myObject.size() > 0){
            //System.debug('DBG: ' + ideas);
            return myObject; 
        }else{
            return null;
        }
        
    }
    
    @AuraEnabled
    global static Boolean upvote(Id recordId){
        system.debug('upVote');
        //Checking the Demo_Vote__c Field Level Security
        String [] demoVoteFields = new String [] { 
            'innohub__Vote_Type__c',
                'innohub__Demo__c'
                };
                    
                    // Obtain the field name/token map for the Demo__c object
                    Map<String,Schema.SObjectField> demoVoteMap = Schema.SObjectType.innohub__Demo_Vote__c.fields.getMap();  
        
        if (!demoVoteMap.get('CreatedById').getDescribe().isAccessible()) {
            
            // Pass error to client
            throw new System.NoAccessException();
            
            // Suppress editor logs
            return null;
        }
        for (String fieldToCheck : demoVoteFields) {
            
            // Check if the user has access to view field
            if (!demoVoteMap.get(fieldToCheck).getDescribe().isCreateable() && !demoVoteMap.get(fieldToCheck).getDescribe().isUpdateable()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Checking the User Field Level Security
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
                return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        
        try{
            
            innohub__Demo_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c, innohub__Demo__c  FROM innohub__Demo_Vote__c WHERE innohub__Demo__c = :recordId AND CreatedById = :voterId LIMIT 1];
            
            System.debug('downvoteing' + myObject);
            
            myObject.innohub__Vote_Type__c = true;
            update myObject;
        }
        catch(Exception e){
            
            innohub__Demo_Vote__c myObject = new innohub__Demo_Vote__c();
            myObject.innohub__Demo__c = recordId;
            myObject.innohub__Vote_Type__c = true;
            insert myObject;
            System.debug('created downvoteing' + myObject);
        } 
        return null;
    } 
    
    @AuraEnabled
    global static Boolean downvote(Id recordId){
        system.debug('downVote');
        //Checking the Demo_Vote__c Field Level Security
        String [] demoVoteFields = new String [] {
            'innohub__Vote_Type__c',
                'innohub__Demo__c'
                };
                    
                    // Obtain the field name/token map for the Demo__c object
                    Map<String,Schema.SObjectField> demoVoteMap = Schema.SObjectType.innohub__Demo_Vote__c.fields.getMap();  
        
        System.debug('###########');
        System.debug(UserInfo.getUserId());
        
        if (!demoVoteMap.get('CreatedById').getDescribe().isAccessible()) {
            
            // Pass error to client
            throw new System.NoAccessException();
            
            // Suppress editor logs
            return null;
        }
        
        for (String fieldToCheck : demoVoteFields) {
            System.debug(fieldToCheck);
            
            // Check if the user has access to view field
            if (!demoVoteMap.get(fieldToCheck).getDescribe().isCreateable() && !demoVoteMap.get(fieldToCheck).getDescribe().isUpdateable()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        //Checking the User Field Level Security
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
                return null;
            }
        }
        
        String voterId = userinfo.getuserid();
        
        
        try{
            
            Demo_Vote__c myObject = [SELECT CreatedById, innohub__Vote_Type__c, innohub__Demo__c  FROM innohub__Demo_Vote__c WHERE innohub__Demo__c = :recordId AND CreatedById = :voterId LIMIT 1];
            
            System.debug('downvoteing' + myObject);
            
            myObject.innohub__Vote_Type__c = false;
            update myObject;
            
        }
        catch(Exception e){
            
            innohub__Demo_Vote__c myObject = new innohub__Demo_Vote__c();
            myObject.innohub__Demo__c = recordId;
            myObject.innohub__Vote_Type__c = false;
            insert myObject;
        } 
        return null; 
    }
    
    @AuraEnabled
    global static User getLoggedInUser(){
        system.debug('getLoggedInUser');
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
                return null;
            }
        }
        
        //Checking the Profile Field Level Security
        String [] profileFields = new String [] {'Id',
            'Name'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> profileMap = Schema.SObjectType.Profile.fields.getMap();  
        
        for (String fieldToCheck : profileFields) {
            
            // Check if the user has access to view field
            if (!profileMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        Profile myProfile = [SELECT Id FROM Profile WHERE Name = 'System Administrator' OR Name = 'Administrateur système'];
        
        User myUser = [SELECT Name FROM User WHERE Id = :UserInfo.getUserId() AND profileId = :myProfile.Id];
        
        return myUser;
    }
    
    @AuraEnabled
    global static Demo_Scorecard__c firstSubmissionCheck(String theRecordId, User theUser){
        system.debug('firstSubmissionCheck');
        system.debug('***** 1 *****');
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
                return null;
            }
        }
        
        //Checking the_Demo_Scorecard__c Field Level Security
        String [] demoScorecardFields = new String [] {'Id',
            'Name',
            'innohub__Demo__c',
            'CreatedById',
            'CreatedDate',
            'innohub__Demo__c',
            'innohub__Helpful__c',
            'innohub__Reusable__c',
            'innohub__Straightforward__c'
            };
                
                // Obtain the field name/token map for the User object
                Map<String,Schema.SObjectField> demoScorecardMap = Schema.SObjectType.innohub__Demo_Scorecard__c.fields.getMap();  
        
        for (String fieldToCheck : demoScorecardFields) {
            
            // Check if the user has access to view field
            if (!demoScorecardMap.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
                
                // Suppress editor logs
                return null;
            }
        }
        
        User myUser = new User();
        if(theUser != null){
            myUser = theUser;
            system.debug('***** 2 *****');
        }
        else{
            myUser = [SELECT Name, profileId FROM User WHERE Id = :UserInfo.getUserId()];
            system.debug('***** 3 *****');
        }
        
        system.debug('***** 4 *****');
        innohub__Demo_Scorecard__c myScorecard = [SELECT Id, Name FROM innohub__Demo_Scorecard__c WHERE innohub__Demo__c = :theRecordId AND OwnerId = :myUser.Id];
        system.debug('***** 5 *****');
        system.debug('myScorecard: ' + myScorecard);
        return myScorecard;
    }
}