@isTest
global with sharing class IH_IdeaCtrTestClass { 
    global static testMethod void testGetPoints(){
        Double points;
        
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea;
        
        innohub__Innovation_Idea_Vote__c myVote1 = new innohub__Innovation_Idea_Vote__c();
        myVote1.innohub__Vote_Type__c = True;
        myVote1.innohub__Innovation_Idea__c = myIdea.Id;
        
        insert myVote1;
        
        List<Double> myList = new List<Double>();
        Double myDouble = IH_IdeaCtr.getPoints(myIdea.Id);
        myList.add(myDouble);
        
        system.debug('myList.size()' + myList.size());
        System.assertEquals(myList.size(), 1);
    }
    
    global static testMethod void testGetIdeas(){  
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Category__c = 'Value 1;Value 2;Value 3;Value 4;Value 5;';
        insert myIdea;  
        
        RecordType myEvoRequestRecType =  [SELECT Id FROM RecordType WHERE Name = 'Evolution Request'];
        RecordType myIdeaType =  [SELECT Id FROM RecordType WHERE Name = 'Idea'];
        
        innohub__Innovation_Idea__c myEvoReq = new innohub__Innovation_Idea__c();
        myEvoReq.Name = 'Test';
        myEvoReq.RecordTypeId = myEvoRequestRecType.Id;
        myEvoReq.innohub__Approval_Status__c = 'Approved';
        myEvoReq.innohub__Improvement_Request__c = false;
        myEvoReq.innohub__Category__c = 'Value 1;Value 2;Value 3;Value 4;Value 5;';
        insert myEvoReq;  
        
        //Type Evolution Request
        String selectedFilter = 'Type';
        String searchFiltersJSON = '[{"filterName":"Type","selectedFilters":["'+myEvoRequestRecType.Id+'"]}]';
        
        List<innohub__Innovation_Idea__c> theIdeas = IH_IdeaCtr.getIdeas(selectedFilter, searchFiltersJSON,'innohub__Approval_Status__c', 'Owner');
        
        //ASSERT EQUALS
        System.assertEquals(theIdeas.size(), 1);
        
        //Category Value 1
        String selectedFilter_2 = 'Category';
        String searchFiltersJSON_2 = '[{"filterName":"innohub__Category__c","selectedFilters":["Value 1"]}]';
        
        List<innohub__Innovation_Idea__c> theSecondIdeas = IH_IdeaCtr.getIdeas(selectedFilter_2, searchFiltersJSON_2,'innohub__Approval_Status__c', 'Created By');
        
        //ASSERT EQUALS
        System.assertEquals(theSecondIdeas.size(), 0);
        
        //Type Ideas
        String selectedFilter_4 = 'Type';
       String searchFiltersJSON_4 = '[{"filterName":"Type","selectedFilters":["'+myIdeaType.Id+'"]}]';
        
        List<innohub__Innovation_Idea__c> theFourthIdeas = IH_IdeaCtr.getIdeas(selectedFilter_4, searchFiltersJSON_4, 'innohub__Approval_Status__c', 'Owner');
        
        //ASSERT EQUALS
        System.assertEquals(theFourthIdeas.size(), 0);
        
        //Type My Submissions
        String selectedFilter_6 = 'Type';
        String searchFiltersJSON_6 = '[{"filterName":"Type","selectedFilters":["My Submissions"]}]';
        
        List<innohub__Innovation_Idea__c> theSixthIdeas = IH_IdeaCtr.getIdeas(selectedFilter_6, searchFiltersJSON_6, 'innohub__Approval_Status__c', 'Created By');
        
        //ASSERT EQUALS
        System.assertEquals(theSixthIdeas.size(), 1);
        
        //Type Favourite Submissions
        String selectedFilter_7 = 'Type';
        String searchFiltersJSON_7 = '[{"filterName":"Type","selectedFilters":["Favourite Submissions"]}]';
        
        List<innohub__Innovation_Idea__c> theSeventhIdeas = IH_IdeaCtr.getIdeas(selectedFilter_7, searchFiltersJSON_7, 'innohub__Approval_Status__c', 'Owner');
        
        //ASSERT EQUALS
        System.assertEquals(theSeventhIdeas.size(), 0);
        
        //Type All
        String selectedFilter_8 = 'Type';
        String searchFiltersJSON_8 = '[{"filterName":"Type","selectedFilters":["All"]}]';
        
        List<innohub__Innovation_Idea__c> theEightIdeas = IH_IdeaCtr.getIdeas(selectedFilter_8, searchFiltersJSON_8, 'innohub__Approval_Status__c', 'Created By');
        
        //ASSERT EQUALS
        System.assertEquals(theEightIdeas.size(), 1);
    }
    
    global static testMethod void testGetCreator(){
        Id p = [select id from profile where name='Innohub General User'].id;
        
        Account ac = new Account(name ='Grazitti') ;
        insert ac; 
        
        Contact con = new Contact(LastName ='testCon',AccountId = ac.Id);
        insert con;  
        
        User user = new User(alias = 'test123', email='test123@noemail.com',
                             emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                             localesidkey='en_US', profileid = p, country='United States',IsActive=true,
                             ContactId = con.Id,
                             timezonesidkey='America/Los_Angeles', username='tester@dermo.com');
        
        insert user;
        
        User theUser = IH_IdeaCtr.getCreator(user.Id);
        
        List<User> theUserList = new List<User>();
        theUserList.add(theUser);
        
        System.assertEquals(theUserList.size(), 1);
    }
    
    global static testMethod void testGetIdea(){ 
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea; 
        
        List<innohub__Innovation_Idea__c> myList = new List<innohub__Innovation_Idea__c>();
        innohub__Innovation_Idea__c theIdea = IH_IdeaCtr.getIdea(myIdea.Id);
        myList.add(theIdea);
        
        System.assertEquals(myList.size(), 1);
    }
    
    global static testMethod void testCheckVote(){        
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea; 
        
        innohub__Innovation_Idea_Vote__c myVote = new innohub__Innovation_Idea_Vote__c();
        myVote.innohub__Vote_Type__c = true;
        myVote.innohub__Innovation_Idea__c = myIdea.Id;
        insert myVote;
        
        Boolean theVote = IH_IdeaCtr.checkVote(myIdea.Id);
        List<Boolean> myVoteList = new List<Boolean>();
        myVoteList.add(theVote);
        
        System.assertEquals(myVoteList.size(), 1);
    }
    
    global static testMethod void testUpvote(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea; 
        
        innohub__Innovation_Idea_Vote__c myVote = new innohub__Innovation_Idea_Vote__c();
        myVote.innohub__Vote_Type__c = true;
        myVote.innohub__Innovation_Idea__c = myIdea.Id;
        insert myVote;
        List<Boolean> myBooleans = new List<Boolean>();
        Boolean theVote = IH_IdeaCtr.upvote(myIdea.Id);
        myBooleans.add(theVote);
        
        System.assertEquals(myBooleans.size(), 1); 
    }
    
    global static testMethod void testDownvote(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        insert myIdea; 
        
        innohub__Innovation_Idea_Vote__c myVote = new innohub__Innovation_Idea_Vote__c();
        myVote.innohub__Vote_Type__c = false;
        myVote.innohub__Innovation_Idea__c = myIdea.Id;
        insert myVote;
        List<Boolean> myBooleans = new List<Boolean>();
        Boolean theVote = IH_IdeaCtr.downvote(myIdea.Id);
        myBooleans.add(theVote);
        
        System.assertEquals(myBooleans.size(), 1); 
    }
    
    /*global static testMethod void testGetRecordTypeName(){
        RecordType theRecordTypeId = [SELECT Id FROM RecordType LIMIT 1];
        system.debug('theRecordTypeId: ' + theRecordTypeId);
        List<String> myRecTypes = new List<String>();
        String theType = IH_IdeaCtr.getRecordTypeName(theRecordTypeId.Id);
        system.debug('theType: ' + theType);
        myRecTypes.add(theType);
        system.debug('myRecTypes: ' + myRecTypes);
        System.assertEquals(myRecTypes.size(), 1);        
    }*/
    
    global static testMethod void testIsApproved(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Approval_Status__c = 'Approved';
        insert myIdea;
        
        List<String> myStatuses = new List<String>();
        String theIdeaStatus = IH_IdeaCtr.isApproved(myIdea.Id);
        myStatuses.add(theIdeaStatus);
        
        System.assertEquals(myStatuses.size(), 1);
    }
    
    global static testMethod void testGetLatestIdea(){
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        myIdea.Name = 'Test';
        myIdea.innohub__Approval_Status__c = 'Approved';
        insert myIdea;
        
        innohub__Innovation_Idea__c myLatestIdea = IH_IdeaCtr.getLatestIdea();
        
        List<innohub__Innovation_Idea__c> myIdeaList = new List<innohub__Innovation_Idea__c>();
        myIdeaList.add(myIdea);
        
        System.assertEquals(myIdeaList.size(), 1);
    }
    
    global static testMethod void testGetLoggedInUser(){
        Id p = [select id from profile where name='Innohub General User'].id;
        
        Account ac = new Account(name ='GrazittiFurstSub') ;
        insert ac; 
        
        Contact con = new Contact(LastName ='testCon2',AccountId = ac.Id);
        insert con;  
        
        User user = new User(alias = 'test124', email='test124@noemail.com',
                             emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                             localesidkey='en_US', profileid = p, country='United States',IsActive=true,
                             ContactId = con.Id,
                             timezonesidkey='America/Los_Angeles', username='tester4@dermo.com');
        
        insert user;
        
        innohub__Innovation_Idea__c myIdea = new innohub__Innovation_Idea__c();
        
        //True
        System.runAs(user) {
            myIdea.Name = 'Test';
            myIdea.OwnerId = user.Id;
            myIdea.innohub__Approval_Status__c = 'Submitted';
            insert myIdea;
        }
        
        
        Boolean myBool = IH_IdeaCtr.getLoggedInUser(myIdea.Id, user);   
        System.assertEquals(myBool, true);
        
        //False
        innohub__Innovation_Idea__c myIdea_2 = new innohub__Innovation_Idea__c();
        myIdea_2.Name = 'Test';
        myIdea_2.innohub__Approval_Status__c = 'Submitted';
        insert myIdea_2;
        
        Boolean myBool_2 = IH_IdeaCtr.getLoggedInUser(myIdea_2.Id, user); 
        System.assertEquals(myBool_2, false);
    }
    
    global static testMethod void testGetPicklistValues(){
        List<String> myPicks = IH_IdeaCtr.getPicklistValues('innohub__Category__c');
        
        System.assertEquals(myPicks.size(), 6);
    }
    
    global static testMethod void testGetPicklistLabel(){
        String myLabel = IH_IdeaCtr.getPicklistLabel('innohub__Category__c');
        
        System.assertEquals(myLabel, 'Category');
    }
    
    global static testMethod void testGetRecordTypeRadio(){
        Map<String, String> myMap = IH_IdeaCtr.getRecordTypeRadio();
        
        System.assertEquals(myMap.size(), 3);
    }
    
    global static testMethod void getIdeaRecordTypesButton(){
        List<IH_IdeaCtr.myRecordTypeStructure> myStruc = IH_IdeaCtr.getIdeaRecordTypesButton();
        
        System.assertEquals(myStruc.size(), 3);
    }
}